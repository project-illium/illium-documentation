---
sidebar_position: 3
---

# Consensus Protocol

The consensus protocol implements the avalanche consensus algorithm.

### Protocol ID

```go
/ilx/<network>/consensus/1.0.0
```
Where `<network>` is either `mainnet`, `testnet`, or `regtest` depending on which
network is being used.

### Network Messages
```go
message MsgAvaRequest {
	// The request ID
	uint32 request_ID       = 1; 
	
	// A list of one or more block heights
	// we want the peer to vote on.
	repeated uint32 heights = 2;
}

message MsgAvaResponse {
	// The ID of the request this is a
	// response to.
	uint32 request_ID    = 1; 
	// BlockID responses. One for each
	// height in the request. A zero
	// byte array means either unknown or
	// unacceptable.
	repeated bytes votes = 2;
}

```

### Protocol

1. When a new block comes off the wire a node checks it against its local policy. If the block passes the local policy
check then it is marked as `Acceptable`, otherwise `Unacceptable`.
2. If an `Acceptable` block gets passed into the consensus engine it is assigned a preference of `Preferred` if there are no
other preferred blocks. `Unacceptable` blocks start as `NotPreferred`.
3. If a new block conflicts (same height) with another block that is `Preferred` the new block preference is set to `Not Preferred`.
4. Once per millisecond the consensus engine select a random peer to query from the validator set, weighted by the percentage of
total stake that validator has, and sends a `MsgAvaRequest` to that peer requesting a vote on a block height. The peer responds 
with the ID of the block it prefers at that height.
5. We rate limit the number of inflight requests go out at any one time to the number of responses remaining needed to finalize the block. 
If the next 1 millisecond step occurs before any of the outstanding requests return, the step is skipped.
6. When the `MsgAvaResponse` returns the votes are processed. 
    - We record a `Yes` vote for the block ID in the response and a `No` vote for all other block IDs.
    - If `>12` out of the last `16` recorded votes for a block are `Yes` then we consider the vote conclusive.
    - If `>12` out of the last `16` recorded votes for a block are `No` then we consider the vote conclusive.
    - Unknown or unacceptable votes (zero ID) *are* included in the last 16 votes. They will prevent a block vote from being conclusive
   if there are enough of them.
    - If the vote is conclusive and it agrees with our current state, either `Preferred` or `Not Preferred`, then we
   increment a confidence counter by 1.
      - If the confidence counter is >= `160` and the current state is `Preferred`, then we mark the block as `Finalized` and
      mark all conflicting blocks as `Rejected`.
      - If the confidence counter is >= `160` and the current state is `Not Preferred`, then we do nothing. Eventually a
      conflicting block will finalize resulting in this one being marked as `Rejected`.
    - If the vote is conclusive and it does not agree with our current state, either `Preferred` or `Not Preferred`, then
   we flip our current preference and reset our confidence counter to zero. 
      - If the preference flipped from `Not Preferred` to `Preferred` then all conflicting blocks must also flip to `NotPreferred`
      by virtue of the same number of `No` votes having been cast for them.
      - If the preference flipped from `Preferred` to `NotPreferred` and we have no other preferred blocks. We selected a
      new `Preferred` block from the list of `Acceptable` blocks. If no blocks are `Acceptable` then have no preference and
      respond to `MsgAvaRequest`s with a zero ID.
7. Simultaneously we work to finalize the leading bits of the block ID. 
   - We start with the most significant bit (MSB). When a block ID vote is recorded we examine the MSB of the block ID.
     - If the MSB is a 0 we record a `Zero` vote for the MSB.
     - If the MSB is a 1 we record a `One` vote for the MSB.
     - Unknown or unacceptable votes (zero ID)  *are* included in the last 16 votes. They will prevent a bit vote from being conclusive
     if there are enough of them.
     - If `>12` out of the last `16` bit votes are the same we consider the vote conclusive.
       - We increment the confidence counter for that bit.
       - If the current `Preferred` block does not start with the same MSB we flip our preference to a different block
       that does match the preferred MSB.
     - If the confidence counter is >= `160` we consider the MSB finalized and repeat the process for the remaining bits.

In situations where there are more than two conflicting blocks at the same height, the bit finalization helps to coordinate
preferences by reducing the candidate set until a block eventually finalizes. 

    
    