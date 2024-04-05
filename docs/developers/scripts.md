---
sidebar_position: 3
description: Examples of basic scripts
---

# Scripts

Let's turn our attention back to the script. All unlocking scripts are written in a language called Lurk and share the same
signature of a lambda function with a specific set of parameters.

```lisp
(lambda (locking-params unlocking-params input-index private-params public-params)
      ;; Must return t (true) or nil (false)
)
```

Notice the `locking-params` parameter. This is the same `lockingParams` that was committed to as part of the `scriptHash`.

```
scriptHash = hash(scriptCommitment || lockingParams)
```

The `lockingParams` that are committed to will ultimately get passed in to the unlocking function when the utxo is being
spent and the script will have an opportunity to evaluate the arguments.

Consider the following script:

```lisp
(lambda (locking-params unlocking-params input-index private-params public-params)
    !(import std/crypto/checksig)
    (checksig unlocking-params locking-params (car public-params))
)
```

This script handles a basic transfer. The `lockingParams` that is committed to is a public key and the script verifies
a digital signature covering the transaction's `sighash` against the committed public key.

The signature gets passed into the script via the `unlocking-params` and the `sighash` gets passed in by the circuit via 
the `public-params`.

If we wanted to we could have just hard-coded the public key inside the script instead of putting it in the params.

```lisp
(lambda (locking-params unlocking-params input-index private-params public-params)
      !(import std/crypto/checksig)
      (checksig unlocking-params !(list 0x06efea8759a776da6aba3eae8cb8546259dcbf8b972336218eb60ebec93d5136 1c9db35580e3c8d4b5bb2dc33075835d85c4e340845337b6e5f6624aaf1f086a) (car public-params))
)
```

This works just fine, but it's generally preferred to put variables like this in the `locking-params` field instead of hard-coding
them so scripts can be shared and reused easily without having to edit them.

## Parameters

The parameters to the unlocking function are as follows:

- **locking-params** (type `list`): The list of parameters committed to in the script-hash.
- **unlocking-params** (type `list`): A list of unlocking parameters provided when creating the transaction's proof and spending the utxo. If the unlocking parameters make the function return `True`, the funds can move.
- **input-index** (type `num`): The index of the input in the transaction currently being evaluated.
- **private-params** (type `cons`): A cons cell containing two elements ― a list of `private-input`s and a list of `private-output`s.
    - **private-input** (type `list`):
        - **amount** (type `num`): The amount of coins or tokens of this utxo.
        - **asset-id** (type `num`): The asset ID of the utxo.
        - **salt** (type `num`): The utxo's salt field.
        - **state** (type `list`): The utxo's state field.
        - **commitment-index** (type `num`): The index of the utxo in the transaction output commitment set.
        - **inclusion-proof** (type `list`): A list of (`num`, `bool`) cons cells representing the inclusion proof linking the output commitment to the transaction's merkle root.
        - **script** (type `lambda`): The script being executed.
        - **locking-params** (type `list`): The locking-params for the input.
        - **unlocking-params** (type `list`): The unlocking-params for the input.
    - **private-output** (type `list`):
        - **script-hash** (type `num`): The output's script-hash.
        - **amount** (type `num`): The output's amount.
        - **asset-id** (type `num`): The asset ID of the output.
        - **salt** (type `num`): The output's salt field.
        - **state** (type `list`): The output's state field.
- **public-params** (type `list`): A list of public parameters. These are all pulled from the body of the transaction as
seen by the network.
  - **sighash** (type `num`): The transaction's sighash.
  - **nullifiers** (type `list`): A list of `num` nullifiers from the transaction.
  - **txo-root** (type `num`): The transaction's txo-root.
  - **fee** (type `num`): The fee paid by the transaction.
  - **mint-id** (type `num`): If this is a token mint transaction, this is the ID of the token being minted. It will be `nil` otherwise.
  - **mint-amount** (type `num`): This is the amount of tokens being minted if this is a token mint transaction.
  - **public-outputs** (type `list`): A list of cons cells of format (`num`, `list`) representing the output commitment and
ciphertext respectively. Note that each 32-byte chunk of ciphertext has the two most significant bits set to zero to fit within the
max field element size.
  - **locktime** (type `num`): The transaction's locktime field.
  - **locktime-precision** (type `num`): The transaction's locktime precision field.

## Examples

### Password Script

A user can spend the utxo if they know the password. 

```
locking-params = (hash(<large_random_secret_number>))
unlocking-params = (<large_random_secret_number>)
```

```lisp
(lambda (locking-params unlocking-params input-index private-params public-params)
    (= (num (commit (car unlocking-params))) (car locking-params))
)
```

### Multisig Script

This is an example of a 2 of 3 multisig. If 2 out of 3 keyholders sign the transaction, the funds will unlock.

The committed locking params contains the threshold and a list of public keys.

The unlocking params contains a list of booleans which controls which public keys are used in the validation plus
enough signatures to meet the threshold.

```
locking-params = (<threshold> <pubkey0-x> <pubkey0-y> <pubkey1-x> <pubkey1-y> <pubkey2-x> <pubkey2-y>)
                 
unlocking-params ((1 0 1) <sig0> <sig1>)
                 
```

```lisp
(lambda (locking-params unlocking-params input-index private-params public-params)
        !(import std/crypto/checksig)

        !(def threshold (car locking-params))
        !(def key-selector (car unlocking-params))
        !(def pubkeys (cdr locking-params))
        !(def signatures (cdr unlocking-params))
        !(def sighash !(param sighash))

        !(defun validate-sigs (selector sigs keys valid-sigs) (
                (if (car selector)
                    (if (= (car selector) 1)
                        (if (checksig (car sigs) !(list (car keys) (car (cdr keys))) sighash)
                            (validate-sigs (cdr selector) (cdr sigs) (cdr (cdr keys)) (+ valid-sigs 1))
                            nil
                        )
                        (validate-sigs (cdr selector) sigs (cdr (cdr keys)) valid-sigs)
                    )
                    (>= valid-sigs threshold)
                )
        ))

        (validate-sigs key-selector signatures pubkeys 0)
)
```

### Timelock script

Coins cannot be spent until after a certain time has past.


The locking-params contain the locktime and a public key. The unlocking-params a signature.

```
script-params = (<lock-until-timestamp> <pubkey>)
unlocking-params = (<signature>)
```

```lisp
(lambda (locking-params unlocking-params input-index private-params public-params)
        !(import std/crypto/checksig)
        !(assert (<= !(param locktime-precision) 120))
        !(assert (> !(param locktime) (car locking-params))
        !(assert (checksig unlocking-params (cdr locking-params) !(param sighash)))
        t
)
```

### Hash Timelock Contract

Alice can spend the coins at any time by revealing a hash preimage. 
Bob can spend the coins after a timelock expires with his public key.


The locking-params contain the locktime, hash, and public key. 
The unlocking-params a signature or hash preimage and a control bit.

```
locking-params = (<lock-until-timestamp> <hash> <bob-pubkey>)
                              
unlocking-params = (t <hash-preimage>)
or
unlocking-params = (nil <signature>)
```

```lisp
(lambda (locking-params unlocking-params input-index private-params public-params)
        !(import std/crypto/checksig)
        
        !(defun validate-hash () (
                (= (num (commit (car (cdr unlocking-params)))) (car (cdr locking-params)))
        ))
        
        !(defun validate-sig () (
                !(assert (<= !(param locktime-precision) 120))
                !(assert (> !(param locktime) (car locking-params))
                !(assert (checksig (cdr unlocking-params) (cdr (cdr locking-params)) !(param sighash)))
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
locking-params = (<exchange-rate-target> <oracle-pubkey> <spend-pubkey>)
unlocking-params = (<exchange-rate> <oracle-signature> <spend-signature>)
```

```lisp
(lambda (locking-params unlocking-params input-index private-params public-params)
        !(import std/crypto/checksig)
        !(import std/collections/nth)
        !(assert (>= (car unlocking-params) (car locking-params)))
        !(assert (checksig (car (cdr unlocking-params)) !(list (nth 1 locking-params) (nth 2 locking-params)) (car unlocking-params)))
        !(assert (checksig (car (cdr (cdr unlocking-params))) !(list (nth 3 locking-params) (nth 4 locking-params)) !(param sighash)))
        t
)
```