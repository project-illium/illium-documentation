---
sidebar_position: 7
description: Marco extensions
---

# Storage

[**NOTE** Nothing in this section has been implemented yet and may change.]

Illium only gives you 128 bytes to use for each contract's state field. For a lot of applications this is enough space.
For other's it's not.

If you need more storage you'll need create an offchain database, compute a merkle root of all the data in the database, 
and store the root hash of the database in state. 

Here's the interface for an offchain database written in Go:
```go
type MerkleDB interface {
        // Put a new key-value pair into the local db or update the value for an existing key. 
        // This operation should update the root hash.
        Put(key, value []byte) (err error) 

        // Get the value for a given key.
        // Nil is returned if the key is not in the db.
        // And inclusion (or exclusion in case of nil value) proof is returned linking to the root.
        Get(key []byte) (value []byte, proof [][]byte, err error)
	
	    // Returns the root hash of the db.
        Root() (hash []byte, err error) 
}
```

The `std/merkle-db` module interface is:
```lisp
;; Verify that the key-value pair exists in the db by making
;; sure the key-value pair links to the state root via the provided
;; proof.
;; Returns t or nil
!(defun db-exists (key value proof root) ())

;; Same as above but verifies an exclusion proof for the given key.
;; Returns t or nil
!(defun db-not-exists (key proof root) ())

;; Verifies that the old-value (which can be nil) links to the state 
;; root via the provided proof, then uses the hashes in the proof
;; to compute the new state root.
;; Returns the new root or nil if the proof was invalid
!(defun db-put (key old-val new-val proof root) ())
```

Now consider the following contract. It allows users to add new data to the contract storage. To do so they have to do
the following:

- Put the data to their local, offchain database.
- Get the new database root hash.
- Fetch a merkle inclusion proof linking the data they just inserted to the new root hash.
- Use data and merkle inclusion proof as input parameters to the contract.
- Contract uses the data and the inclusion proof to:
  - Verify the inclusion proof hashes link to the current contract state root
  - Compute the new contract state root
  - Enforce a covenant saving the new state root

```
unlocking-params = (<data> <merkle-proof>)
```

```lisp
(lambda (script-params unlocking-params input-index private-params public-params)
    !(import std/merkle-db)
    !(import std/crypto)
    
    !(def data (nth 0 unlocking-params))
    !(def merkle-proof (nth 1 unlocking-params))
    !(def state-root (car !(param priv-in input-index state)))

    ;; Compute the new state root
    !(def new-state-root (db-put pubkey merkle-proof state-root))

    ;; Compute the required output
    !(def required-output !(list
                            !(param priv-in input-index script-hash)
                            new-amount
                            !(param priv-in input-index asset-id)
                            new-state-root
                            (hash !(param priv-in input-index salt))))
    
    ;; Enforce covenant requring output 0 to be of the required form                  
    !(assert-eq required-output !(param priv-out 0))
    
    ;; Enforce  a covenant requring that the ciphertext contains (required-output data-to-store)
    ;; and is encrypted with the hash of the input-salt. 
    !(assert-eq !(param pub-out 0 ciphertext) (encrypt !(list required-output data-to-store) (hash !(param priv-in input-index salt))))
    
    t
)
```