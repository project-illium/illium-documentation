---
sidebar_position: 5
description: Examples of smart contracts
---

# Smart Contracts

We're now in a position to see how we can use the building blocks we've learned about so far to build a full smart contract.
In the context of the illium protocol a smart contract is a recursive script deployed on the network that maintains
state, offers methods to the user to read or update that state, and/or transfer coins or tokens according to the rules
defined in the code.

It should be noted that utxo-based smart contracts are not *that* different from account-based system that you're probably
familiar with. 

Consider Ethereum as an example:
- Contracts are deployed to a specific address.
- This address defines the instance of the contract.
- Each transaction made to the address represents a state transition of the contract.
- Users only need to know the address of the contract to interact with it.

Now compare that to Illium:
- Contracts are deployed by sending coins to utxo who's script-hash defines the contract code.
- The outpoint (txid, output-index) of this initial utxo defines the instance of the contract.
- Each linked spend of the utxo represents a state transition of the contract.
- User's need to know data about the most recent utxo in the chain of transactions to interact with the contract.

Outside of that last part about needing to track the most recent utxo, there is very little difference betweeen
illium and ethereum. And it wouldn't be hard for an IDE to track the utxos for you to remove any mental overhead. 

Let's take a look at some examples:

## Examples

### Auction Contract

This contract conducts a basic auction. Before the expiration is reached anyone can bid on the auction by calling 
`bid()` method and sending coins into the contract. When they do so the contract enforces a covenant requiring
that the previous high bidder be refunded. 

The beneficiary of the contract can claim the funds after expiration using the `withdraw()` method. 

When `bid()` is called the transaction format is required to be:
```
Inputs
======
0: <this-contract>
1: <bid>
2: <fee-paying-input> (optional)

Outputs
=======
0: <this-contract>
1: <prev-bidder-refund>
2: <change> (optional)
```

```
script-params = (<auction-expiration> <asset-id> <recipient-pubkey>)
unlocking-params = (t <bid-amount> <refund-output>)
or
unlocking-params = (nil <signature>)
```

```lisp
(lambda (script-params unlocking-params input-index private-params public-params)
	;; Grab the locktime fields from the public parameters
	!(def locktime !(param locktime))
	!(def locktime-precision !(param locktime-precision))

	;; Assert that the locktime precision is less within the required range.
	!(assert (<= locktime-precision 60))

	;; Bid is a method to the contract. It can be called any time prior to 
	;; expiration to increase the current bid amount.
	;;
	;; It will also refund the previous high bidder his money.
	!(defun bid (bid-amount refund-output) (
		;; Import the encryption function from the standard library
		!(import std/crypto)

		;; Set a bunch of variables based on the input parameters
		!(def input-script-hash !(param priv-in 0 script-hash))
		!(def state !(param priv-in 0 state ))
		!(def current-bid (car state))
		!(def prev-bidder-comm (car (cdr state)))
		!(def asset-id (car (cdr script-params)))
		!(def refund-comm (hash refund-output))
		!(def bid-amount (car (cdr unlocking-params)))
		!(def new-state !(list bid-amount refund-comm))
		!(def in-salt !(param priv-in 0 salt))
		!(def new-salt (hash in-salt))
		!(def new-output !(list input-script-hash bid-amount asset-id new-state new-salt))

		;; Assert that input 1's amount is greater than or equal to the bid amount provided
		;; in the unlocking params.
		!(assert (>= !(param priv-in 1 amount) bid-amount))
		
		;; Assert that input 1's asset-id is the same as the one set in the script-params
		!(assert (>= !(param priv-in 1 asset-id) asset-id))

		;; Assert that output 0 is constructed as expected
		;; - script-hash is same as the input script-hash (recursion)
		;; - amount is equal to the new bid
		;; - asset-id is equal to the input asset id
		;; - the new state is of form (bid-amount bidder-comm)
		;; - the salt is the hash of the previous salt
		!(assert-eq !(param priv-out 0) new-output)

		;; Assert that the input 1 amount is greater than the current bid
		!(assert (> bid-amount current-bid))

		;; Assert that the bidder's commitment contains the correct amount
		!(assert-eq bid-amount (list-get 1 refund-output))

		;; Assert that the bidder's commitment contains the correct asset id
		!(assert-eq asset-id (list-get 2 refund-output))

		;; Assert that the public output 0 ciphertext is equal to the encryption of
		;; the new contract output.
		!(assert-eq !(param pub-out 0 ciphertext) (encrypt new-salt new-output))

		;; Assert that the tranasction's locktime is less than the auction expiration
		!(assert (< locktime (car script-params)))
		
		;; If the current-bid is greater than zero make sure the public output 1 commitment 
		;; is equal to the prev-bidder-comm. Otherwise we can just return t.
		(if (current-bid > 0)
		    (= !(param pub-out 1) prev-bidder-comm)
		    t
        )
	))

	;; Withdraw is another method. It can be used the by the auction beneficiary to withdraw
	;; the funds after expiration
	!(defun withdraw (signature) ( 
		;; Import the check-sig function from the standard library
		!(import std/crypto)

		;; Assert that the tranasction's locktime is greater than or equal to the auction expiration
		!(assert (>= locktime (car script-params)))

		;; Assert that the transaction's sig-hash is signed by the key provided in the script-params
		!(assert (check-sig signature (car (cdr (cdr script-params))) !(param sighash)))

		;; Return true
		t
	))

	;; Execute one of the two methods based on the selection in the unlocking params
	(if (car unlocking-params)
		(bid (list-get 1 unlocking-params) (list-get 2 unlocking-params))
		(withdraw (list-get 1 unlocking-params))
    )
)
```

### Voting Contract

```
script-params = (<admin-pubkey> <len-candidates>)
state = (<is_open> <db_root> <vote-records>)

unlocking-params = (<method> <vote> <pubkey> <signature> <merkle-proof>)
or 
unlocking-params = (<method> <signature>)
```

```lisp
(lambda (script-params unlocking-params input-index private-params public-params)
    !(defun close-vote () (
           ;; Verify the admin signature
           !(assert (check-sig (car (cdr unlockingparams)) (car script-params) !(param sighash)))      
                       
           ;; Set the vote-open flag to 0      
           !(def state !(param priv-in input-index state))
           !(def new-state !(list 0 (cdr state)))
                            
           ;; Enforce a covenant making sure the output commitment is computed correctly
           !(def new-salt (hash !(param priv-in intput-index salt)))
           !(def new-output (hash !(list !(param priv-in input-index script-hash) 0 !(param priv-in input-index asset-id) new-state new-salt)))
           !(assert-eq !(priv-out 0) new-output)
   
           ;; Enforce that the ciphertext is computed correctly.
           !(assert-eq (!param pub-out 0 ciphertext) (encrypt new-salt new-output))
           
           ;; Return True
           t
    ))
  
    !(defun vote () (
        ;; Import the encryption function from the standard library
        !(import std/crypto)

        ;; Import the merkle database
        !(import std/merkle-db)

        !(def state !(param priv-in input-index state))

        ;; Make sure the vote is open
        !(assert (> (car state) 0))

        !(defun record-vote (candidate vote-records) (
            !(def current-votes (list-get candidate vote-records))
            (list-update vote-records candidate (+ current-votes 1))
        ))

        !(defun make-vote-records (n i records) (
             (if (< i n)
                 (make-vote-records n (+ i 1) (cons records (cons 0 nil)))
                 records
             )
        ))

        !(def vote-records (if (state)
                                state
                                (make-vote-records (car (cdr script-params)) 1 !(list 0))
                            ))

        !(def pubkey (list-get 1 unlocking-params))
        !(def merkle-proof (list-get 4 unlocking-params))
        !(def signature (list-get 3 unlocking-params))
        !(def state-root (list-get 1 state))
        
        ;; Verify the voter can produce a valid signature
        !(assert (checksig signature pubkey !(param sighash)))

        ;; Verify this pubkey hasn't voted yet
        !(assert-eq (db-exists pubkey merkle-proof state-root) nil)  
              
        ;; Compute the new state root                   
        !(def new-state-root (db-put pubkey merkle-proof state-root))

        ;; Compute the new state with the recorded vote
        !(def new-state !(list 1 new-state-root (record-vote (car (cdr unlocking-params)) vote-records)))

        ;; Enforce a covenant making sure the output commitment is computed correctly
        !(def new-salt (hash !(param priv-in intput-index salt)))
        !(def new-output (hash !(list !(param priv-in input-index script-hash) 0 !(param priv-in input-index asset-id) new-state new-salt)))
        !(assert-eq !(priv-out 0) new-output)

        ;; Enforce that the ciphertext is computed correctly.
        !(assert-eq (!param pub-out 0 ciphertext) (encrypt new-salt new-output))
        
        ;; Return True
        t
    ))
  
    (if (car unlocking-params)
        (vote)
        (close-vote)
    )
)
```