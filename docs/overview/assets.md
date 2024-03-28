---
sidebar_position: 8
---

# Assets

Illium has native support for fungible and non-fungible assets (or tokens). An asset transfer looks no
different from ordinary transfers or smart contracts on chain, so it's not possible to distinguish a transaction
which transfers assets from all other illium transactions. 

To enable the token protocol we are going to once again modify our output commitment. This time we will add an
`assetID` field.

```go
outputCommitment := hash(scriptHash, amount, assetID, salt, state)
```

For regular illium (ILX) transfers the `assetID` is just a zero byte array. For all other transfers it's the unique 
ID of the asset. In this way we can mark outputs as representing a specific asset but keep that information hidden
to the rest of the network. 

To go along with this change we're going to need to modify our transaction validation lurk program to distinguish
between illium (ILX) coins and other assets and to verify that neither are being inflated. 

```go
func ProveTransactionValidity(priv PrivateParams, pub PublicParams) bool {
    inputTotal := 0
    inAssetMap := make(map[string]uint64)
    for i, input := range priv.Inputs {
        scriptCommitment := hash(input.Script)
        scriptHash := hash(scriptCommitment, input.LockingParams...)
        commitment := hash(scriptHash, input.Amount, input.AssetID, input.Salt, input.State)
    
        if !ValidateInclusionProof(commitment, input.index, input.InclusionProof, pub.TxocRoot) {
            return false
        }
        
        if !ValidateScript(input.Script, input.LockingParams, input.UnlockingParams, i, priv, pub) {
            return false
        }
        
        nullifier := hash(input.Index, input.Salt, scriptCommitment, input.LockingParams...)
        if !bytes.Equal(nullifier, pub.Nullifiers[i]) {
            return false
        }
        if input.AssetID = ILXID {
            inputTotal += input.Amount
        } else {
            inAssetMap[input.AssetID] += input.Amount
        }
    }
    
    outputTotal := 0
    outAssetMap := make(map[string]uint64)
    for i, output : range priv.Outputs {
        preimage := append(output.ScriptHash, output.Amount, output.AssetID, output.Salt, output.State)
        if !bytes.Equal(pub.Outputs[i].Commitment, hash(preimage)) {
            return false
        }
        if output.AssetID = ILXID {
            outputTotal += output.Amount
        } else {
            outAssetMap[output.AssetID] += output.Amount
        }
    }
        
    if outputTotal + pub.Fee > inputTotal {
        return false
    }
    for assetID, amount := range outAssetMap {
        if inAssetMap[assetID] < amount {
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
  Locktime locktime         = 10;
  bytes signature           = 11;
  bytes proof               = 12;

  enum AssetType {
    FIXED_SUPPLY    = 0;
    VARIABLE_SUPPLY = 1;
  }
}
```