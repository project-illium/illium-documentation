---
sidebar_position: 6
---

# Transaction Validation

We're now in a position to put it all together. 

So far we've learned how we use output commitments to avoid revealing
information about a transaction's outputs. But how do we avoid revealing information about the inputs we're spending?

Remember in Bitcoin an input looked like this:

```json
{
  "inputs": [
    {
      "prev_hash": "4dd8bc776abd45aa9df7186966fa0733ad28aeab1bac0860d2316a051e65c6d2",
      "output_index": 1,
      "signatue_script": "47304402203b39d75ef932b9192b89dc2ba74e76611f552ef7167e74d55ef5e6822740a8140220063231351174d6c31ca15b7da1d8d60cc8f8a764fd578a9a11c1b564522c512b01210391adc032a6cd78870d5ec400bdecc031344e96364654f1cfedb34fdbd6afaea5",
    }
  ]
}
```

The `prev_hash` is the transaction ID of transaction containing the unspent transaction output (UTXO) that we're trying to
spend. And the `output_index` is the number of the output in that transaction that we're spending. 

Additionally, `signature_script` is the signature that proves that we are authorized to spend this UTXO. 

## Illium Transaction Format

In illium, transactions look like this when they are sent over the wire (in protobuf):

```protobuf
message Transaction {
    repeated Output outputs =   1;
    repeated bytes nullifiers = 2;
    bytes txoc_root           = 3;
    int64 locktime            = 4;
    uint64 fee                = 5;
    bytes proof               = 6;

    message Output {
        bytes commitment       = 1;
        bytes ciphertext       = 2;
    }
}
```

Every data field (except the proof) will be used as a public input to the transaction validation lurk program. We're 
going to use this program to prove the validity of the transaction, in zero-knowledge, and without revealing the private
information about our inputs. 

Let's see how we do it.

## Proving Transaction Validity

### Proving the Commitment Exists

The first thing that we need to prove is that the output commitments that our inputs are spending from actually exist in 
the txoc set. Remember that txoc accumulator? We're going to use it here. 

Below is an example of what the transaction validation lurk program look like. Instead of writing it in lurk here we will 
write it in Go for easier readability. Just remember that in the illium codebase, this is written in lurk.

```go

// This is the private parameters that we will use to
// prove transaction validity, but we will NOT reveal
// them publicly to the network.
type PrivateParams struct {
	Inputs []struct{
		Commitment       []byte
		Index            uint64
		InclusionProof   struct{
            Hashes      [][]byte
            Flags       uint64
            Accumulator [][]byte
        }       
		ScriptHash       []byte
		Amount           uint64
		Salt             []byte
		ScriptCommitment []byte
		ScriptParams     [][]byte
		UnlockingParams  [][]byte
	}
	Outputs []struct{
        ScriptHash []byte
        Amount     uint64
        Salt       []byte
	}
}

// The public parameters are pulled directly from the
// body of the transaction.
type PublicParams struct {
	Outputs []struct{
		Commitment      []byte
		Ciphertext      []byte
	}
	Nullifies [][]byte
	TxocRoot  []byte
	Locktime  int64
	Fee       uint64
}

func ProveTransactionValidity(priv PrivateParams, pub PublicParams) bool {
	for _, input := range priv.Inputs {
		
		h := blake2s(append(input.Index, input.Commitment...))
		
		if !ValidateInclusionProof(h, input.InclusionProof, pub.TxocRoot) {
			return false
		}
	}
	return true
}
```

What you're seeing above is the lurk program is validating that each input's commitment exists in the set of
all commitments by validating the merkle inclusion proof that links the commitment to a txoc root for a given block.

The user specifies which block's txoc root they want to use for this purpose and include it in the body of their
transaction. The only requirement is that the commitment must be in tree represented by the provided root. It's generally 
recommended that users just select the txoc root at the tip of the chain. Full nodes will verify that the root provided
in the transaction actually exists in the blockchain when they validate the transaction.

Notice what we've done here. The proof created by this lurk program will prove that we're spending a valid commitment that
exists in the set of all commitments, *without* actually revealing the specific commitment to the network.

### Proving Spend Authorization

Next we need to prove that we're actually *authorized* to spend this commitment. To do this we will first prove that 
we know the preimage to the output commitment:

```go
func ProveTransactionValidity(priv PrivateParams, pub PublicParams) bool {
	for _, input := range priv.Inputs {
		
		h := blake2s(append(input.Index, input.Commitment...))
		
		if !ValidateInclusionProof(h, input.InclusionProof, pub.TxocRoot) {
			return false
		}
		
		preimage := append(input.ScriptHash, input.Amount, input.Salt)
		if !bytes.Equal(input.Commitment, blake2s(preimage)) {
			return false
		}
	}
	return true
}
```

Next we'll prove that we know the unlocking script that produced the `ScriptHash` in the preimage. 

```go
func ProveTransactionValidity(priv PrivateParams, pub PublicParams) bool {
	for _, input := range priv.Inputs {
		h := blake2s(append(input.Index, input.Commitment...))
		
		if !ValidateInclusionProof(h, input.InclusionProof, pub.TxocRoot)
		        return false
		}
		
		preimage := append(input.ScriptHash, input.Amount, input.Salt)
		if !bytes.Equal(input.Commitment, blake2s(preimage)) {
			    return false
		}

        unlockingScript := append(input.ScriptCommitment, input.ScriptParams...)
        if !bytes.Equal(input.ScriptHash, blake2s(unlockingScript)) {
                return false
        }
	}
	return true
}
```

Finally, we will validate the unlocking script using the provided private script parameters.

```go
func ProveTransactionValidity(priv PrivateParams, pub PublicParams) bool {
	for _, input := range priv.Inputs {
		
		h := blake2s(append(input.Index, input.Commitment...))
		
		if !ValidateInclusionProof(h, input.InclusionProof, pub.TxocRoot) {
			    return false
		}
		
		preimage := append(input.ScriptHash, input.Amount, input.Salt)
		if !bytes.Equal(input.Commitment, blake2s(preimage)) {
			    return false
		}
		
		unlockingScript := append(input.ScriptCommitment, input.ScriptParams...)
		if !bytes.Equal(input.ScriptHash, blake2s(unlockingScript)) {
			    return false
		}
		
		if !ValidateUnlockingScript(unlockingScript, input.UnlockingParams, pub.Locktime) {
			    return false
		}
	}
	return true
}
```

Note that the `ValidateUnlockingScript()` function also takes in the transaction's `locktime` as a parameter. This is so
unlocking scripts can make time based decisions if they want to. When validating blocks, full nodes validate that a 
transaction's locktime is less than or equal to the block timestamp.

### Proving Amounts are Correct

Next we need to prove that this transaction is spending only the correct amount of coins. If we didn't do this it would
be possible for a transaction to create coins out of thin air. 

First let's add up the input amounts:

```go
func ProveTransactionValidity(priv PrivateParams, pub PublicParams) bool {
	inputTotal := 0
	
	for _, input := range priv.Inputs {
		
		h := blake2s(append(input.Index, input.Commitment...))
		
		if !ValidateInclusionProof(h, input.InclusionProof, pub.TxocRoot) {
			    return false
		}
		
		preimage := append(input.ScriptHash, input.Amount, input.Salt)
		if !bytes.Equal(input.Commitment, blake2s(preimage)) {
			    return false
		}

        unlockingScript := append(input.ScriptCommitment, input.ScriptParams...)
        if !bytes.Equal(input.ScriptHash, blake2s(unlockingScript)) {
                return false
        }

        if !ValidateUnlockingScript(unlockingScript, input.UnlockingParams, pub.Locktime) {
                return false
        }
		
		inputTotal += input.Amount
	}
	return true
}
```

Now we can turn to the outputs. Remember that the in the body of the transaction the output amounts are hidden behind
the commitment hash. To total up the output amounts we're going to need to provide the output commitment preimages as
private parameters and validate that they do in fact hash to the commitments found in the transaction. 

```go
func ProveTransactionValidity(priv PrivateParams, pub PublicParams) bool {
	inputTotal := 0
	
	for _, input := range priv.Inputs {
		
		h := blake2s(append(input.Index, input.Commitment...))
		
		if !ValidateInclusionProof(h, input.InclusionProof, pub.TxocRoot) {
			    return false
		}
		
		preimage := append(input.ScriptHash, input.Amount, input.Salt)
		if !bytes.Equal(input.Commitment, blake2s(preimage)) {
			    return false
		}

        unlockingScript := append(input.ScriptCommitment, input.ScriptParams...)
        if !bytes.Equal(input.ScriptHash, blake2s(unlockingScript)) {
                return false
        }

        if !ValidateUnlockingScript(unlockingScript, input.UnlockingParams, pub.Locktime) {
                return false
        }
		
		inputTotal += input.Amount
	}
	
	outputTotal := 0
	
	for i, output : range priv.Outputs {
		    preimage := append(output.ScriptHash, output.Amount, output.Salt)
		    if !bytes.Equal(pub.Outputs[i].Commitment, blake2s(preimage)) {
			        return false
		    }
		    outputTotal += output.Amount
	}
	return true
}
```

Finally, we can verify that the output amount plus the transaction fee does not exceed the input amount. 

```go
func ProveTransactionValidity(priv PrivateParams, pub PublicParams) bool {
	inputTotal := 0
	
	for _, input := range priv.Inputs {
		
		h := blake2s(append(input.Index, input.Commitment...))
		
		if !ValidateInclusionProof(h, input.InclusionProof, pub.TxocRoot) {
			    return false
		}
		
		preimage := append(input.ScriptHash, input.Amount, input.Salt)
		if !bytes.Equal(input.Commitment, blake2s(preimage)) {
			    return false
		}

        unlockingScript := append(input.ScriptCommitment, input.ScriptParams...)
        if !bytes.Equal(input.ScriptHash, blake2s(unlockingScript)) {
                return false
        }

        if !ValidateUnlockingScript(unlockingScript, input.UnlockingParams, pub.Locktime) {
                return false
        }
		
		inputTotal += input.Amount
	}
	
	outputTotal := 0
	
	for i, output : range priv.Outputs {
		    preimage := append(output.ScriptHash, output.Amount, output.Salt)
		    if !bytes.Equal(pub.Outputs[i].Commitment, blake2s(preimage)) {
			        return false
		    }
		    outputTotal += output.Amount
	}
	
	if outputTotal + pub.Fee > inputTotal {
		    return false
	}
	
	return true
}
```

### Proving No Double Spends

If you've made it this far you've probably realized that we've proved that the output commitments that we're spending
exist in the set of all output commitments. But we don't, as of yet, have any way of determining if those commitments 
are unspent. 

To do this for each input we will calculate a hash value that we will call a `nullifier`. The nullifier will be derived 
from private data in each commitment's preimage. It's calculated such that for each output commitment there is only one 
nullifer but it's not possible to link the nullifier to a specific commitment without knowing the private data. 

These nullifiers will be included in the body of the transaction that gets relayed to the network. 

Full nodes will maintain a database of all nullifiers that exist in the chain. Validating new transactions consists of
verifying that the transaction's nullifiers do *not* already exist in the nullifier database. If they do, the transaction
must be a double spend and is invalid. 

Finally, we need to make sure that the nullifiers included in the transaction are actually calculated correctly otherwise
people could just put fake nullifiers in the transaction. 

We'll again do this inside the transaction validation lurk program:

```go
func ProveTransactionValidity(priv PrivateParams, pub PublicParams) bool {
inputTotal := 0

	for i, input := range priv.Inputs {
		
		h := blake2s(append(input.Index, input.Commitment...))
		
		if !ValidateInclusionProof(h, input.InclusionProof, pub.TxocRoot) {
			    return false
		}
		
		preimage := append(input.ScriptHash, input.Amount, input.Salt)
		if !bytes.Equal(input.Commitment, blake2s(preimage)) {
			    return false
		}
	
		unlockingScript := append(input.ScriptCommitment, input.ScriptParams...)
        if !bytes.Equal(input.ScriptHash, blake2s(unlockingScript)) {
                return false
        }

        if !ValidateUnlockingScript(unlockingScript, input.UnlockingParams, pub.Locktime) {
                return false
        }
		
		inputTotal += input.Amount
		
		nullifier := blake2s(append(input.Index, input.Salt, unlockingScript))
		
		if !bytes.Equal(pub.Nullifiers[i], nullifier) {
			    return false
		}
	}
	
	outputTotal := 0
	
	for i, output : range priv.Outputs {
		preimage := append(output.ScriptHash, output.Amount, output.Salt)
		if !bytes.Equal(pub.Outputs[i].Commitment, blake2s(preimage)) {
			    return false
		}
		outputTotal += output.Amount
	}
	
	if outputTotal + pub.Fee > inputTotal {
		    return false
	}
	
	return true
}
```

So there you have it! We've managed to prove all of the following in zero knowledge:
- That we are spending an output commitment that exists in the set of all output commitments.
- That this output commitment has not been spent before by any other transaction.
- That we are authorized to spend this commitment.
- That the transaction only spends the correct amount of coins and does not create coins out of thin air.
