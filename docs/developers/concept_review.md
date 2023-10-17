---
sidebar_position: 2
description: Review of transactions concepts
---

# Concept Review

Unlike most other smart contracting platforms, Illium is a UTXO-based cryptocurrency. This design allows us maximize
user privacy but comes a little steeper learning curve. In the future we'll likely have a smart contract IDE that will
abstract away some of this complexity and deliver a more familiar developer experience, but it's still good to understand
the nuts and bolts of the system. 

If you've read the illium protocol overview and feel like you have to grasp of how things work you can skip to the next
section.

## Utxos

Illium transactions have both inputs and outputs just like Bitcoin. Take a look at the transaction structure (in protobuf):

```protobuf
message StandardTransaction {
    repeated Output outputs =   1;
    repeated bytes nullifiers = 2;
    bytes txo_root            = 3;
    Locktime locktime         = 4;
    uint64 fee                = 5;
    bytes proof               = 6;
}

message Output {
    bytes commitment = 1;
    bytes ciphertext = 2;
}
```

It's pretty easy to spot the outputs. There's an explicit `outputs` field. However, the inputs are a little less obvious. 
Since we're intentionally trying to hide the information about the inputs there isn't any explicit `inputs` field,
however transactions are required to have one `nullifier` for each input. It's not possible to figure out what the input
is from the `nullifier` data, but you at least know the number of inputs as it must be the same as the number of nullifiers. 

Each input points to an output from a prior transaction. In this sense inputs can be said to "spend" an output from another 
transaction. 

![Utxos](/img/utxo.jpg)

Outputs which have been created but not yet spent are call ― unspent transaction outputs or UTXOs.

## Output Commitments

Each output commits to a `script` ― a computer program that is used to determine whether the coins are allowed to
be spent. 

Notice the `commitment` field in the `output`:
```protobuf
message Output {
    bytes commitment = 1;
    bytes ciphertext = 2;
}
```

The `commitment` is a hash of the concatenation of five values:

```
commitment = hash(scriptHash || amount || assetID || state || salt)
```

The `scriptHash` is found inside each illium payment address and senders use it when constructing their outputs.

```
address = serialize(scriptHash || viewKey)
```

The `scriptHash` itself is the hash of a `lurkCommitment` and some `params`. 

```
scriptHash = hash(lurkCommitment || params)
```

And finally the `lurkCommitment` is computed as the hash of unlocking script.

```
script = `(lambda (script-params unlocking-params input-index private-params public-params)
                  (check-sig (car unlocking-params) (car script-params) (nth 7 public-params))
          )`

lurkCommitment = commit(script)          
```

Ultimately illium addresses are a type of Pay-Script-Hash (P2SH) address (if you're familiar with that term from Bitcoin).