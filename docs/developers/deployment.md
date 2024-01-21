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
	"github.com/project-illium/ilxd/zk/lurk/macros"
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
            (lambda (locking-params unlocking-params input-index private-params public-params)
                !(import std/crypto/checksig)
                !(assert (<= !(param locktime-precision) 120))
                !(assert (> !(param locktime) (car locking-params))
                !(assert (checksig unlocking-params (cdr locking-params) !(param sighash)))
                t
            )	
    `

    // Run the script through the preprocessor to expand the macros
    mp, err := macros.NewMacroPreprocessor(macros.WithStandardLib(), macros.RemoveComments())
    if err != nil {
        log.Fatal(err)
    }
	
    script, err = mp.Preprocess(script)
    if err != nil {
        log.Fatal(err)
    }
    
    // Compute the script commitment of the script
    scriptCommitment, err := zk.LurkCommit(script)
    if err != nil {
        log.Fatal(err)
    }
    
    // Well lock the coins for 10 mintues
    lockUntil := time.Now().Add(time.Minute*10)
    locktimeBytes := make([]byte, 8)
    binary.BigEndian.PutUint64(locktimeBytes, uint64(lockUntil.Unix()))
    
    // Generate a key pair to use to sign the transaction
    spendPriv, spendPub, err := crypto.GenerateNovaKey(rand.Reader)
    if err != nil {
        log.Fatal(err)
    }
    
    // Lurk variables cannot exceed the maximum field element
    // Typically public keeps are encoded in a compressed form
    // that would exceed the maximum field element. Thus, to work
    // with public keys in lurk we need to convert them to their 
    // uncompressed (x, y) format.
    pubX, pubY := spendPub.(*crypto.NovaPublicKey).ToXY()
    
    // Create the locking script
    lockingScript := types.LockingScript{
        ScriptCommitment: scriptCommitment,
        LockingParams:    [][]byte{locktimeBytes, pubX, pubY},
    }
    
    // Generate an encryption keypair to use with this address
    viewPriv, viewPub, err := crypto.GenerateCurve25519Key(rand.Reader)
    if err != nil {
        log.Fatal(err)
    }
    
    address, err := walletlib.NewBasicAddress(lockingScript, viewPub, &params.MainnetParams)
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
        UnlockingScript:  lockingScript.Serialize(),
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
    
    // Like public keys, signatures will not normally fit within the
    // max field element for lurk variables. Thus, we need to convert
    // the signature to a format that will fit. In this case the signature
    // consists of an R value (point) and an S value (scalar). So we'll
    // convert the R value to its x, y coordinates.
    sigRx, sigRy, sigS := crypto.UnmarshalSignature(sig)
    
    // Add the signature to the input's unlocking params. This needs to
    // formatted as a lurk expression in the same format our locking script
    // expects it to be. In this case a list.
    createRawResp.RawTx.Inputs[0].UnlockingParams = fmt.Sprintf("(cons 0x%x (cons 0x%x (cons 0x%x nil)))", sigRx, sigRy, sigS)
	
    // We also need to provide the script because the wallet only knows of the
    // script-commitment but not the actual script.
    createRawResp.RawTx.Inputs[0].Script = script
    
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
