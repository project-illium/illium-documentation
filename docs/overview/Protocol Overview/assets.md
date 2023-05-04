---
sidebar_position: 8
---

# Assets

Illium has native support for fungible and non-fungible assets (or tokens). An asset transfer looks no
different from ordinary transfers or smart contracts on chain so it's not possible to distinguish a transaction
which transfers assets from all other illium transactions. 

To enable the token protocol we are going to once again modify our output commitment. This time we will add an
`assetID` field.

```go
outputCommitment := blake2b(scriptHash, amount, assetID, state, salt)
```

For regular illium (ILX) transfers the `assetID` is just a zero byte array. For all other transfers it's the unique 
ID of the asset. In this way we can mark outputs as representing a specific asset but keep that information hidden
to the rest of the network. 

To go along with this change we're going to need to modify our transaction validation lurk program to distinguish
between illium (ILX) coins and other assets and to verify that neither are being inflated. 

```go
func ProveTransactionValidity(priv PrivateParams, pub PublicParams) bool {
	ilxInputTotal := 0
	assetInputTotals := make(map[[32]byte]uint64)

	for i, input := range priv.Inputs {
		
		h := blake2b(append(input.Index, input.Commitment...))
		
		if !ValidateInclusionProof(h, input.InclusionProof, pub.TxocRoot) {
			return false
		}
		
		preimage := append(input.ScriptHash, input.Amount, in.AssetID, in.State, input.Salt)
		if !bytes.Equal(input.Commitment, blake2b(preimage)) {
			return false
		}
		
		if !bytes.Equal(input.ScriptHash, blake2b(input.UnlockingScript)) {
			return false
		}
		
		if !ValidateUnlockingScript(input.UnlockingScript, input.ScriptParams, pub.Locktime) {
			return false
		}

        if input.AssetID == ILX_ASSET_ID {
                ilxInputTotal += input.Amount
        } else {
                assetInputTotals[input.AssetID] += input.Amount
        }
		
		nullifier := blake2b(append(input.Index, input.Salt, input.UnlockingScript))
		
		if !bytes.Equal(pub.Nullifiers[i], nullifier) {
			return false
		}
	}
	
	ilxOutputTotal := 0
    assetOutputTotals := make(map[[32]byte]uint64)
	
	for i, output : range priv.Outputs {
		preimage := append(output.ScriptHash, output.Amount, output.AssetID, output.State, output.Salt)
		if !bytes.Equal(pub.Outputs[i].Commitment, blake2b(preimage)) {
			return false
		}
		if output.AssetID == ILX_ASSET_ID {
                ilxOutputTotal += output.Amount
        } else {
                assetOutputTotals[output.AssetID] += output.Amount
        }
	}
	
	if ilxOutputTotal + pub.Fee > ilxInputTotal {
		return false
	}
	
	for assetID, total := range assetOutputTotals {
		if total > assetInputTotals[assetID] {
			return false
        }
	}
	
	return true
}
```

And to go along with this we will need a new transaction type to mint new assets:

```protobuf
message MintTransaction {
    AssetType type            = 1;
    bytes asset_ID            = 2;
    bytes document_hash       = 3;
    uint64 new_tokens         = 4;
    repeated Output outputs   = 5;
    uint64 fee                = 6;
    repeated bytes nullifiers = 7;
    bytes txo_root            = 8;
    bytes mint_key            = 9;
    int64 locktime            = 10;
    bytes signature           = 11;
    bytes proof               = 12;

    enum AssetType {
        FIXED_SUPPLY    = 0;
        VARIABLE_SUPPLY = 1;
    }
}
```