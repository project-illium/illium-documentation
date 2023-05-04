---
sidebar_position: 9
---

# Consensus Algorithm

Illium uses a variant of avalanche for its consensus algorithm. There are several major benefits of avalanche that
other consensus algorithms do not have.

- **Near instant transaction finalization**: Transactions finalize as fast as network latency will allow for. This is
much different from Proof-of-work and even most Proof-of-stake algorithms which often take a number of minutes for 
transactions to confirm. And confirmations in Proof-of-work or Proof-of-stake blockchains are not final and remain
potentially reversible for some time after confirmation. In illium transactions are final, meaning they've reached a
point of irreversibility, just seconds after the transaction is made.

- **High level of security**: We'll talk about security in more depth below, but generally most Proof-of-work and 
Proof-of-stake blockchains have a 51% security threshold. Meaning if an attacker can gain 51% of the mining power or 
stake they can do some damage to the network. With avalanche the threshold for serious damage is much higher ― generally over 70%.

- **Energy Efficiency**: Obviously Proof-of-work blockchains consume extreme amounts of energy that just isn't needed
by Proof-of-stake or Avalanche. 

## How's it work?

Imagine you have a room full of people and everyone's trying to decide between two valid, conflicting blocks ― block A and 
block B. We don't really care which block we select, just that all the honest participants in the room select the same
block. We'll perform an algorithm that goes like this:

- Everyone starts with an initial preference, either block A or block B, based on which block they saw first.
- Each person will conduct multiple rounds of polls of a random subset of people in the room.
- Each round they will select 10 other people ask them what their current preference is (block A or B).
- If the majority of those polled agree with a person's current preference they will keep their preference the
same and proceed to round 2. 
- If the majority prefer the opposite of a person's current preference, they will flip their preference and proceed
to round 2.
- The process will be repeated for the remaining rounds. 

At the end of the process all honest nodes should have the same current preference. The reason for this is because the
algorithm is designed to tip one way or another. Even in the event of a worst-case scenario initial preference split
50-50, it's unlikely that it will still be 50-50 after the first round of polling due simply to the random nature of the
polling. Even if somehow it did, it's extremely unlikely that would remain so after round 2 (or 3, 4, etc). 

What you might see after each round is something like:

Round 1: 51-49  
Round 2: 61-39  
Round 3: 84-16  
Round 4: 98-2  
Round 5: 100-0

Very quickly the honest participants come to consensus. 

How might this system be attacked? Malicious participants could depart from the protocol and strategically flip their
votes to try to disrupt and slow down the consensus process. 

The amazing thing about avalanche is that if all the honest participants had infinite time, they would still come to a
consensus no matter what percentage of participants are malicious.

Of course in the real world we don't have infinite time. Blocks need to finalize fairly quickly. So we have to stop
polling at some point. This means that if the percentage of malicious participants is above some critical threshold,
typically around 70%, the honest participants could fail to come to consensus. 

70% is pretty high. Much higher than the 51% threshold in most other blockchains. But even here 70% would be trivial to
achieve if participating in the consensus process was costless. Malicious users would just spin up many nodes and
overwhelm the network. 

So we need to gate access to the consensus process and make participating have a cost. 

## Staking

In Illium access to the consensus group is limited to nodes which have staked a minimum amount of coins and the polling
algorithm selects nodes randomly from the coin-weighted list of stakers (which we will call validators going forward).

In this sense Illium *is* a Proof-of-stake coin. It just uses the avalanche protocol to solve some of the problems with
Proof-of-stake, such as the nothing-at-stake problem, which Proof-of-stake coins typically solve through other 
mechanisms.

To stake coins users broadcast a special `StakeTransaction` which locks up a given UTXO:

```protobuf
message StakeTransaction {
    bytes validator_ID = 1;
    uint64 amount      = 2;
    bytes nullifier    = 3;
    bytes txoc_root    = 4;
    int64 locktime     = 5;
    bytes signature    = 6;
    bytes proof        = 7;
}
```

Full nodes validate the transaction and, when it's included in a block, add the validator to the validator set. The validator
can remove himself from the validator set by spending his staked UTXO. The appearance of the nullifier in a standard
transaction triggers the stake to be removed from the validator set. Validators are automatically removed from the set
after 26 weeks if coins are not re-staked.

## Rewards

Unlike Bitcoin, illium blocks do not create new coins for the block creator. Since there is no cost to creating a block,
validators would be incentivized to flood the network with blocks to try to earn the reward. 

For the same reason, transactions fees are burned and are not paid to the creator of the block.

Instead validators are rewarded at fixed one-week intervals. At each interval, each validator is credited with their
weighted share of that week's block reward. They can claim that share by creating and broadcasting a special `CoinbaseTransaction`:

```protobuf
message CoinbaseTransaction {
    bytes validator_ID       = 1;
    uint64 new_coins         = 2;
    repeated Output outputs  = 3;
    bytes signature          = 4;
    bytes proof              = 5;
}
```

Coinbase transactions are only valid for validators with an unclaimed reward. If a non-validator, or a validator with 
no remaining unclaimed reward broadcasts a coinbase transaction, it will be invalid. 

## Block Creation

Blocks don't create themselves. A validator needs gather up transactions, put them in a block, and broadcast it. Unlike
most other blockchains Illium has no fixed block interval. Blocks can be created as fast as transactions are generated. 

Also unlike other Proof-of-stake chains, there are no restrictions on which validator can create a block. This 
creates a potential attack vector whereby a malicious validator could flood the network with blocks, clog up the
network, and slow down the consensus process. 

To prevent this type of attack validators are expected to create blocks in proportion to their weighted share of the
total stake. If a validator has 2% of the total stake, they should average 2% of the blocks over some interval. 

If the number of blocks created by a validator deviates from their expected number of blocks by some standard deviation
(up or down) they will lose their block reward. If the misbehavior continues, they will lose their stake. 

There's also burst protection whereby a validator will be banned if he creates too large a percentage of the most recent blocks.