---
sidebar_position: 3
description: Examples of basic scripts
---

# Scripts

Let's turn our attention back to the script. All unlocking scripts are written in a language called Lurk and share the same
signature of a lambda function with a specific set of parameters.

```lisp
(lambda (script-params unlocking-params input-index private-params public-params)
      ;; Must return t (true) or nil (false)
)
```

Notice the `script-params` parameter. This is the same `params` that was committed to as part of the `scriptHash`

```
scritHash = hash(lurkCommitment || params)
```

The `params` that are committed to will ultimately get passed in to the unlocking function when the utxo is being
spent and the script will have an opportunity to evaluate the arguments.

Consider the following script:

```lisp
(lambda (script-params unlocking-params input-index private-params public-params)
      (check-sig (car unlocking-params) (car script-params) (nth 7 public-params))
)
```

This script handles a basic transfer. The `params` that is committed to is a public key and the script verifies
a digital signature covering the transaction's `sighash` against the committed public key.

The signature gets passed into the script via the `unlocking-params` and the `sighash` gets passed in by the circuit via 
the `public-params`.

If we wanted to we could have just hard-coded the public key inside the script instead of putting it in the params.

```lisp
(lambda (script-params unlocking-params input-index private-params public-params)
      (check-sig (car unlocking-params) 79877116396000796934016162317696488904839608298135655275973165100101729765931 (nth 7 public-params))
)
```

This works just fine, but it's generally preferred to put variables like this in the `params` field instead of hard-coding
them so scripts can be shared and reused easily without having to edit them.

## Parameters

The parameters to the unlocking function are as follows:

- **script-params** (type `list`): The list of parameters committed to in the script-hash.
- **unlocking-params** (type `list`): A list of unlocking parameters provided when creating the transaction's proof and spending the utxo. If the unlocking parameters make the function return `True`, the funds can move.
- **input-index** (type `num`): The index of the input in the transaction currently being evaluated.
- **private-params** (type `cons`): A cons cell containing two elements ― a list of `private-input`s and a list of `private-output`s.
    - **private-input** (type `list`):
        - **script-commitment** (type `commitment`): The hash of this script being evaluated.
        - **amount** (type `u64`): The amount of coins or tokens of this utxo.
        - **asset-id** (type `num`): The asset ID of the utxo.
        - **script-params** (type `list`): The same script-params above.
        - **commitment-index** (type `num`): The index of the utxo in the transaction output commitment set.
        - **state** (type `list`): The utxo's state field.
        - **salt** (type `num`): The utxo's salt field.
        - **unlocking-params** (type `list`): The same unlocking-params above.
        - **inclusion-proof-hashes** (type `list`): A list of (`num`, `bool`) cons cells representing the inclusion proof linking the output commitment to the transaction's merkle root.
        - **inclusion-proof-accumulator** (type `list`): A list of `num` hashes that represent the preimage of the transactions' merkle root.
    - **private-output** (type `list`):
        - **script-hash** (type `num`): The output's script-hash.
        - **amount** (type `u64`): The output's amount.
        - **asset-id** (type `num`): The asset ID of the output.
        - **state** (type `list`): The output's state field.
        - **salt** (type `num`): The output's salt field.
- **public-params** (type `list`): A list of public parameters. These are all pulled from the body of the transaction as
seen by the network.
  - **nullifiers** (type `list`): A list of `num` nullifiers from the transaction.
  - **txo-root** (type `num`): The tranaction's txo-root.
  - **fee** (type `u64`): The fee paid by the transaction.
  - **coinbase** (type `u64`): The amount of new coins created by the transaction. This only applies to coinbase transactions. It will
be zero for all others.
  - **mint-id** (type `num`): If this is a token mint transaction, this is the ID of the token being minted. It will be `nil` otherwise.
  - **mint-amount** (type `u64`): This is the amount of tokens being minted if this is a token mint transaction.
  - **public-outputs** (type `list`): A list of cons cells of format (`num`, `list`). Representing the outputput commitment and
ciphertext respectively.
  - **sighash** (type `num`): The transaction's sighash.
  - **locktime** (type `num`): The transaction's locktime field.
  - **locktime-precision** (type `num`): The transaction's locktime precision field.

## Examples

### Password Script

A user can spend the utxo if they know the password. 

```
script-params = (<large_random_secret_number>)
unlocking-params = (<large_random_secret_number>)
```

```lisp
(lambda (script-params unlocking-params input-index private-params public-params)
      (= (car unlocking-params) (car script-params))
)
```

### Multisig Script

This is an example of a 2 of 3 multisig. If 2 out of 3 key holders sign the transaction, the funds will unlock.

The committed script params contains the threshold and a list of public keys.

The unlocking params contains a list of booleans which controls which public keys are used in the validation plus
enough signatures to meet the threshold.

```
script-params = (<threshold> <pubkey0> <pubkey1> <pubkey2>)
                 
unlocking-params ((1 0 1) <sig0> <sig2>)
                 
```

```lisp
(lambda (script-params unlocking-params input-index private-params public-params)
        !(def threshold (car script-params))
        !(def key-selector (car unlocking-params))
        !(def pubkeys (cdr script-params))
        !(def sigs (cdr unlocking-params))
        
        !(defun validate-sigs (selector, key-idx, sig-idx, valid-sigs) (
                (if (= (car selector) 1)
                    (if (check-sig (nth sig-idx sigs) (nth key-idx pubkeys) !(param sighash))
                        (validate-sigs (cdr selector) (+ key-idx 1) (+ sig-idx 1) (+ valid-sigs 1))
                        nil
                    )
                    (if (cdr selector)
                        (validate-sigs (cdr selector) (+ key-idx 1) sig-idx valid-sigs)
                        (>= valid-sigs threshold)
                    )
                )
        ))
         
        (validate-sigs key-selector 0 0 0)
)
```

### Timelock script

Coins cannot be spent until after a certain time has past.


The script-params contain the locktime and a public key. The unlocking-params a signature.

```
script-params = (<lock-until-timestamp> <pubkey>)
unlocking-params = (<signature>)
```

```lisp
(lambda (script-params unlocking-params input-index private-params public-params)
        !(assert (<= !(param locktime-precision) 120))
        !(assert (> !(param locktime) (car script-params))
        !(assert (check-sig (car unlocking-params) (car (cdr script-params)) !(param sighash)))
        t
)
```

### Hash Timelock Contract

Alice can spend the coins at any time by revealing a hash preimage. 
Bob can spend the coins after a timelock expires with his public key.


The script-params contain the locktime, hash, and public key. 
The unlocking-params a signature or hash preimage and a control bit.

```
script-params = (<lock-until-timestamp> <hash> <bob-pubkey>)
                              
unlocking-params = (t <hash-preimage>)
or
unlocking-params = (nil <signature>)
```

```lisp
(lambda (script-params unlocking-params input-index private-params public-params)
        !(defun validate-hash () (
                (= (hash (car (cdr unlocking-params))) (car (cdr script-params)))
        ))
        
        !(defun validate-sig () (
                !(assert (<= !(param locktime-precision) 120))
                !(assert (> !(param locktime) (car script-params))
                !(assert (check-sig (car (cdr unlocking-params)) (car (cdr (cdr script-params))) !(param sighash)))
                t
        ))

       (if (car unlocking-params)
           (validate-hash)
           (validate-sig)
       )
)
```

### HODL Vault

Funds can only be spent after a third party price oracle signs a message attesting to the
illium dollar exchange rate reaching a certain amount. 

```
script-params = (<exchange-rate-target> <oracle-pubkey> <spend-pubkey>)
unlocking-params = (<exchange-rate> <oracle-signature> <spend-signature>)
```

```lisp
(lambda (script-params unlocking-params input-index private-params public-params)
        !(assert (>= (car unlocking-params) (car script-params)))
        !(assert (check-sig (car (cdr unlocking-params)) (car (cdr script-params)) (car unlocking-params)))
        !(assert (check-sig (car (cdr (cdr unlocking-params))) (car (cdr (cdr script-params))) !(param sighash)))
        t
)
```