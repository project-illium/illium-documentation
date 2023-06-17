---
sidebar_position: 7
---

# Smart Contracts

Thus far we've seen how we can create Bitcoin-like unlocking scripts, albeit with a more advanced turning complete
programming language. But there is more to smart contracts than just unlocking scripts. Typically, smart contract 
allow users to save data (state) inside a contract and to read and manipulate that state. 

Illium allows users to do this as well. To understand how we're going to have to introduce some changes to a few concepts
we've already taked about. 

## Output Commitments

First, the output commitment preimage is modified to include a `state` field.

```go
outputCommitment := blake2s(scriptHash, amount, state, salt)
```

This makes it such that each output in the chain can now optionally have state attached to it, but the state will
remain hidden behind the commitment hash. (Note that the state is included in the output ciphertext so recipients can 
read it).

Nobody will be able to tell which contracts are saving and/or mutating state just by looking at the transactions in the 
blockchain as they all look the same.

## Covenants

In blockchain parlance a covenant is a restriction placed on an output such that it can only be spent if it sends the coins
to a specific address. 

Bitcoin does not have covenants. Once you provide a signature script that satisfies the unlocking script you are free to
send the coins to any address of your pleasing. It's not possible to restrict *which* address the coins are sent to.

Illium does have covenants. To enable this feature we have to modify the `ValidateUnlockingScript()` function inside the
transaction validation lurk program to accept the private and public parameters as an input. 

```go
func ValidateUnlockingScript(unlockingScript, input.UnlockingParams, pub.Locktime, PrivateParams, PublicParams) bool
```

This is a form of *transaction introspection*. The private and public parameters contain all the information, both
public and private, about the transaction being validated. This allows the unlocking script to inspect the relevant
parts of the transaction and to make a decision to unlock or not based on what data the transaction includes.

## Smart Contracts

From this we can enforce a covenant and start building something that looks like a smart contract (again we are writting
this is Go for readability, but in practice this would be written in lurk):

```go
func Unlock(unlockingParams input.UnlockingParams, locktime pub.Locktime, priv PrivateParams, pub PublicParams) {
	switch unlockingParams[0] {
	case 0x00: 
		Method0()
    case 0x01:
        Method1()
	case 0x02:
		Method2()
	}
	
	if !bytes.Equal(priv.Outputs[0].ScriptHash, priv.Inputs[0].ScriptHash) {
		return false
	}
	return true
}
```

The above is a basic contract with three methods. The user can select which method gets executed by passing in `0`, `1`,
or `2` into the `ScriptParams`. Further, the contract enforces a covenant which requires that coins can only be sent from
this output if they are sent right back to the *same* `ScriptHash`.

This is essentially *recursive contract* whereby each time a method is called the contract loops and enables the same three
methods to be called again by spending from the next output commitment.

This contract could read and mutate state if it wanted to:

```go
func Unlock(unlockingParams input.UnlockingParams, locktime pub.Locktime, priv PrivateParams, pub PublicParams) {
	
	state := priv.Inputs[0].State
	
	switch unlockingParams[0] {
	case 0x00: 
		state = Method0(state)
    case 0x01:
        Method1()
	case 0x02:
		Method2()
	}

    if !bytes.Equal(priv.Outputs[0].State, state) {
        return false
    }
	
	if !bytes.Equal(priv.Outputs[0].ScriptHash, priv.Inputs[0].ScriptHash) {
		return false
	}
	return true
}
```

In this contract `Method0` reads the current contract state, mutates it, then enforces a covenant which requires that the
new state be saved in the output before enforcing the `ScriptHash` covenant and setting up for the next iteration.

Contracts could even interact with other contracts:

```go
func Unlock(unlockingParams input.UnlockingParams, locktime pub.Locktime, priv PrivateParams, pub PublicParams) {

    var (
        state = priv.Inputs[1].State
        contract2ScriptHash = []byte{//some script hash}
    )
    
    switch unlockingParams[0] {
    case 0x00:
        if !bytes.Equal(priv.Inputs[1].ScriptHash, contract2ScriptHash) {
            return false
        }
        state = Method0(state)
    case 0x01:
        Method1()
    case 0x02:
        Method2()
    }

    if !bytes.Equal(priv.Outputs[0].State, state) {
        return false
    }
    
    if !bytes.Equal(priv.Outputs[0].ScriptHash, priv.Inputs[0].ScriptHash) {
        return false
    }
    return true
}
```

This contract requires that if `Method0()` is called, `contract2` must also be executed at the same time by enforcing
a covenant that `contract2` must also be an input to the same transaction. Further it reads the state from `contract2`
and uses it as an input for its own computation.

All told anything that could be done with smart contracts on Ethereum, say, can also be done in illium. While a UTXO-based
system like illium is a little more complex to reason about than an account-based system like Ethereum, the complexity 
could be abstracted away by a purpose-built smart contract IDE. 

There is just one caveat to all this. Unlike Ethereum, where the time it takes to verify a smart contract transaction
grows with the complexity of the contract, in illium the verification is constant time! This means that complex smart
contracts take no longer to verify than ordinary transfers. This is not only good for privacy, but also for scalability. 

The tradeoff here, however, is the more complex the smart contract, the more time it takes to create the proof for the
transaction. So the CPU time ends up being offloaded onto the prover (those creating the transactions) rather than the
verifiers (the full nodes in the network).
