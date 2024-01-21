---
sidebar_position: 5
description: Covenants and recursive scripts
---

# Covenants

In a basic transfer, there are usually no restrictions on which address the coins can be sent to or what the structure
of the transaction must look like. 

Because the full list of private and public parameters are passed into the unlocking function, scripts have the ability
to inspect any part of the private or public data and make decisions to unlock or remain locked based on this data. 

Using introspection a script can enforce restrictions on what parts of the transaction must look like or where the coins are sent. 

We call these restrictions covenants. 

Here's an example. The following script only allows funds to be sent to a specific address (or more specifically the address' script-hash).

```lisp
(lambda (locking-params unlocking-params input-index private-params public-params)
      !(import std/crypto/checksig)
      !(assert-eq !(param pub-out 0 script-hash) 0x06efea8759a776da6aba3eae8cb8546259dcbf8b972336218eb60ebec93d5136)
      !(assert-eq !(param pub-out 0 amount) !(param priv-in input-index amount))
      !(assert (checksig unlocking-params (cdr locking-params) !(param sighash)))
      t
)
```

# Recursive Scripts

Covenants can be used to require the funds be sent back into the same script. For example, the following is a recursive 
script. The funds can only be sent back into the same script-hash.

```lisp
(lambda (locking-params unlocking-params input-index private-params public-params)
      !(import std/inputs/script-hash)
      !(assert-eq !(param priv-out 0 amount) (!praram priv-in input-index amount))
      (= !(param priv-out 0 script-hash) (script-hash !(params priv-in input-index)))
)
```

Recursive scripts really start to unlock the full power of illium. Consider that all inputs and outputs have a state field
attached to them. Using a recursive script we can read the input state, mutate it in some way, and save the new state in the
output. 

```lisp
(lambda (locking-params unlocking-params input-index private-params public-params)
      !(import std/inputs/script-hash)
      !(assert-eq !(param priv-out 0 amount) (!praram priv-in input-index amount))
      !(assert-eq !(param priv-out 0 script-hash) (script-hash !(params priv-in input-index)))
      
      (= !(param priv-out 0 state) (+ !(param priv-in input-index state) 1))
)
```

The above example reads an integer from the input state, increments it by one, and saves the new state in the next output, 
which a covenant enforces must be the same script. 

You can think of this script as a deployed contract. The contract has code that runs every time the utxo is spent and it also
has state associated with it that can be read and mutated. 

Let's take a look at a more practical example. The following is vault script. It has two keys, a hot key and a cold key. The
cold key can spend the funds at any time. If the funds are spent with the hot key a covenant is enforced requiring the
funds move back into the same script while activating a timer. When the timer expires the hot key can spend the funds with
no restrictions. Before the timer expires the cold key can still spend the funds. 

```
locking-params = (<recovery-window> <hot-pubkey> <cold-pubkey>)
unlocking-params = (t <cold-signature>)
or 
unlocking-params = (nil <output-index> <hot-signature> )
```

```lisp
(lambda (locking-params unlocking-params input-index private-params public-params))
      !(import std/crypto/checksig)
      !(import std/collections/nth)
      !(import std/inputs/script-hash)

      ;; cold-spend allows the funds to be spent any time using the cold key
      !(defun cold-spend () (
              (checksig (cdr unlocking-params) (cdr (cdr locking-params)) !(param sighash))
      ))

      ;; hot-spend allows coins to be spent with the hot key if the right conditions are met
      !(defun hot-spend () (
              !(def state !(param priv-in input-index state))
              !(def locktime !(param locktime))
        
              ;; Make sure the locktime is within 120 seconds of the blocktime.
              !(assert (< !(param locktime-precision) 120)
              
              ;; Validate the hot signature
              !(assert (checksig (cdr (cdr unlocking-params)) (cons (nth 3 locking-params) (cons (nth 4 locking-params) nil)) !(param sighash)))
                        
              (if state
                  ;; If state contains a timestamp allow the funds to be spent if the current time is
                  ;; greater than the state timestamp plus the recovery-window.
                  (> locktime (+ state (car locking-params))
                  
                  ;; If the state is nil
                  (let ((output-index (car (cdr unlocking-params))))   
                      ;; Make sure the full amount is transferred back into the contract.
                      ;; Fees will need to be paid with additional inputs.
                      !(assert-eq !(param priv-out output-index amount) !(param priv-in input-index amount))
                      
                      ;; Require funds are sent back into the same script-hash
                      !(assert-eq !(param priv-out output-index script-hash) (script-hash !(params priv-in input-index)))
                      
                      ;; Require the new state contains the current timestamp
                      !(assert-eq !(params priv-out output-index state) locktime)
                      
                      ;; Require the new salt be the hash of the previous salt. This is necessary because we are
                      ;; assuming a potential adversarial case where the hot key may be compromised and the owner
                      ;; of the cold key needs to be able to compute the output-commitment preimage to be able to
                      ;; spend this output and recover his coins.
                      !(assert-eq !(params priv-out output-index salt) (num (commit !(param priv-in input-index salt))))
                      
                      ;; Ensure the asset-id is the same as the input asset-id. This also prevents a potential attack
                      ;; where the attacker sends junk tokens to this output.
                      !(assert-eq !(params priv-out output-index asset-id) !(param priv-in input-index asset-id))
                      t
                  )
              )
      ))
      
      (if (car unlocking-params)
          (cold-spend)
          (hot-spend)
      )
)
```