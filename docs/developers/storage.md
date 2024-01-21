---
sidebar_position: 7
description: Marco extensions
---

# Storage

Illium only gives you 128 bytes to use for each contract's state field. For a lot of applications this is enough space.
For other's it's not.

If you need more storage you'll need create an offchain database, compute a merkle root of all the data in the database, 
and store the root hash of the database in state. 

Here's the interface for an offchain database written in Go:
```go
type MerkleDB interface {
        // Put a new key/value pair into the database. This operation
        // will update the database's merkle root. It will also override
        // any value that is currently stored in the database at this
        // key.
        Put(key types.ID, value []byte) error

        // Get returns a value from the database for a given key along with
        // a merkle proof linking the value to the database's root hash. This
        // method with not return an exclusion proof if the value does not exist
        // just an error.
        Get(key types.ID) ([]byte, MerkleProof, error)

        // Exists returns whether the key exists in the database along with
        // a merkle inclusion or exclusion proof which links either the value,
        // or nil, to the database's merkle root.
        Exists(key types.ID) (bool, MerkleProof, error)

        // Delete removes a key/value pair from the database. In the tree
        // structure the value will be set to the nil hash.
        Delete(key types.ID) error

        // Root returns the database's root hash.
        Root() (types.ID, error)
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
- All other users of the contract insert the new data into their local databases to track the updated state.

```
unlocking-params = (<data> <merkle-proof>)
```

```lisp
(lambda (locking-params unlocking-params input-index private-params public-params)
    !(import std/merkle-db)
    !(import std/crypto/encrypt)
    !(import std/collections/nth
    
    !(def data (nth 0 unlocking-params))
    !(def merkle-proof (nth 1 unlocking-params))
    !(def state-root (car !(param priv-in input-index state)))

    ;; Compute the new state root
    !(def new-state-root (db-put nil data merkle-proof state-root))

    ;; Compute the required output
    !(def required-output !(list
                            script-hash
                            new-amount
                            !(param priv-in input-index asset-id)
                            new-state-root
                            (num (commit !(param priv-in input-index salt)))))
    
    ;; Enforce covenant requring output 0 to be of the required form                  
    !(assert-eq required-output !(param priv-out 0))
    
    ;; Enforce  a covenant requring that the ciphertext contains (required-output data-to-store)
    ;; and is encrypted with the hash of the input-salt. 
    !(assert-eq !(param pub-out 0 ciphertext) (encrypt !(list required-output data-to-store) (num (commit !(param priv-in input-index salt)))))
    
    t
)
```