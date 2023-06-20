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
	// Random uint32 for request ID
    uint32 request_ID   = 1;
    
    // A list of block IDs
    repeated bytes invs = 2;
}

message MsgAvaResponse {
	// Same uint32 found in the request
    uint32 request_ID = 1;
    
    // A list of votes. One vote for block ID in
    // the request. Votes are 1 byte:
    //
    // 0x00: No vote
    // 0x01: Yes vote
    // 0x80: Peer doesn't know about the block
    bytes votes       = 2;
}
```

### Protocol

1. When a new block is passed into the consensus engine it is assigned a preference - `Preferred` or `Not Preferred`.
2. If a new block conflicts (same height) with another block that is `Preferred` the new block preference is set to `Not Preferred`.
3. Once per millisecond the consensus engine select a random peer to query to the validator set, weighted by the percentage of
total stake that validator has, and sends a `MsgAvaRequest` to that peer containing all outstanding inventory.
4. We rate limit the number of inflight requests go out at any one time to the number of responses remaining needed to finalized the block. 
If the next 1 millisecond step occurs before any of the outstanding requests return, the step is skipped.
5. When the `MsgAvaResponse` returns the votes are processed. 
    - If `12` out of the last `16` recorded votes are `Yes` then we consider the vote conclusive.
    - If `12` out of the last `16` recorded votes are `No` then we consider the vote conclusive.
    - Unknown votes `0x80` *are* included in the last 16 votes.
    - If the vote is conclusive and it agrees with our current state, either `Preferred` or `Not Preferred`, then we
   increment a confidence counter by 1.
      - If the confidence counter is >= `160` and the current state is `Preferred`, then we mark the block as `Finalized` and
      mark all conflicting blocks as `Rejected`.
      - If the confidence counter is >= `160` and the current state is `Not Preferred`, then we do nothing. Eventually a
      conflicting block will finalize resulting in this one being marked as `Rejected`.
    - If the vote is conclusive and it does not agree with our current state, either `Preferred` or `Not Preferred`, then
   we flip our current preference and reset our confidence counter to zero. 
      - If the preference flipped from `Not Preferred` to `Preferred` we flip the preference of all conflicting blocks
      to `Not Preferred` and reset their confidence counter to zero.