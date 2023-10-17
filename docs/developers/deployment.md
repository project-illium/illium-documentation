---
sidebar_position: 10
description: Security notes
---

# Deployment

In this section we'll cover how to create, deploy, and interact with a contract on chain.

### Generating an address from a script

For our purpose's we'll be writing this in Go.
```go
package main

import (
	"context"
	"crypto/rand"
	"encoding/binary"
	"path/filepath"
	"fmt"
	"github.com/project-illium/ilxd/crypto"
	"github.com/project-illium/ilxd/params"
	"github.com/project-illium/ilxd/types"
	"github.com/project-illium/ilxd/zk"
	"github.com/project-illium/walletlib"
	"github.com/project-illium/ilxd/repo"
	"github.com/project-illium/ilxd/rpc/pb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"log"
	"time"
)

func main() {

	// This is an example timelock script
	script := `
		(lambda (script-params unlocking-params input-index private-params public-params)
			!(assert (<= !(param locktime-precision) 120))
			!(assert (> !(param locktime) (car script-params))
			!(assert (check-sig (car unlocking-params) (car (cdr script-params)) !(param sighash)))
			t
		)	
	`
	
	// Compute the lurk commitment of the script
	lurkCommitment, err := zk.LurkCommitment(script)
	if err != nil {
		log.Fatal(err)
	}
	
	// Well lock the coins for 10 mintues
	lockUntil := time.Now().Add(time.Minute*10)
	locktimeBytes := make([]byte, 8)
	binary.BigEndian.PutUint64(locktimeBytes, uint64(lockUntil.Unix()))
	
	// Generate a key pair to use to sign the transaction
	spendPriv, spendPub, err := crypto.GenerateLurkKey(rand.Reader)
	if err != nil {
		log.Fatal(err)
	}
	
	rawPub, err := spendPub.Raw()
	if err != nil {
		log.Fatal(err)
	}

	// Create the unlocking script
	unlockingScript := types.UnlockingScript{
		ScriptCommitment: scriptCommitment,
		ScriptParams:     [][]byte{locktimeBytes, rawPub},
	}
	
	// Generate an encryption keypair to use with this address
	viewPriv, viewPub, err := crypto.GenerateCurve25519Key(rand.Reader)
	if err != nil {
		log.Fatal(err)
	}
	
	address, err := walletlib.NewBasicAddress(unlockingScript, viewPub, &params.MainnetParams)
	if err != nil {
		log.Fatal(err)
	}
	
	fmt.Println(address)
```

### Import the address into the wallet

We'll do this using the gRPC interface.

```go
	certificateFile := filepath.Join(repo.AppDataDir("ilxd", false), "rpc.cert")
	creds, err := credentials.NewClientTLSFromFile(certificateFile, "localhost")
	if err != nil {
		log.Fatal(err)
	}

	conn, err := grpc.Dial("localhost:5001", grpc.WithTransportCredentials(creds))
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()
	walletClient := pb.NewWalletServiceClient(conn)
	blockchainClient := pb.NewBlockchainServiceClient(conn)
	
	viewPrivBytes, err := crypto.MarshalPrivateKey(viewPriv)
	if err != nil {
		log.Fatal(err)
	}

	_, err := walletClient.ImportAddress(context.Background(), &pb.ImportAddressRequest{
		Address:          address.String(),
		UnlockingScript:  unlockingScript.Serialize(),
		ViewPrivateKey:   viewPrivBytes,
	})
    if err != nil {
        log.Fatal(err)
    }
```

### Send some coins to the address

```go
    resp, err := walletClient.Spend(context.Background(), &pb.SpendRequest{
		ToAddress:        address.String(),
		Amount:           10000000,
	})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(types.NewID(resp.Transaction_ID).String())
```

### Spend the UTXO
```go
    // Load the utxos from the wallet
	utxoResp, err := walletClient.GetUtxos(context.Background(), &pb.GetUtxosRequest{})
	if err != nil {
		log.Fatal(err)
	}
	
	// Grab the utxo for our address
	var utxo *pb.Utxo
	for _, u := range utxoResp.Utxos {
		if u.Address == address.String() {
			utxo = u
			break
		}
	}

	// Create a raw tranasction that spends from our utxo
	createRawResp, err := walletClient.CreateRawTransaction(context.Background(), &pb.CreateRawTransactionRequest{
		Inputs: []*pb.CreateRawTransactionRequest_Input{
			{
				CommitmentOrPrivateInput: &pb.CreateRawTransactionRequest_Input_Commitment{
					Commitment: utxo.Commitment,
				},
			},
		},
		Outputs: []*pb.CreateRawTransactionRequest_Output{
			{
				Address: "il1php93at5hy30ysynrjdwghygfqdm3k3k74ync7v658e6n6rccv6mg3rsmjrdcgr5h4x3atzzeemxp3ysztkr0t9jh55nfjaf6nkhtqsqq2knyp",
				Amount:  9000000,
			},
		},
	})
	if err != nil {
		log.Fatal(err)
	}
	
	// Sign the transaction
	sig, err := spendPriv.Sign(createRawResp.RawTx.Tx.GetStandardTransaction().SigHash())
	if err != nil {
		log.Fatal(err)
	}
	
	// Add the signature to the input's unlocking params
	createRawResp.RawTx.Inputs[0].UnlockingParams = [][]byte{sig}
	
	// Create the proof for the transaction
	provedResp, err := walletClient.ProveRawTransaction(context.Background(), &pb.ProveRawTransactionRequest{
		Tx: createRawResp.RawTx,
	})
	if err != nil {
		log.Fatal(err)
	}
	
	// Broadcast to the network
	submitResp, err := blockchainClient.SubmitTransaction(context.Background(), &pb.SubmitTransactionRequest{
		Transaction: provedResp.ProvedTx,
	})
	if err != nil {
		log.Fatal(err)
	}
	
	fmt.Println(types.NewID(submitResp.Transaction_ID).String())
```
