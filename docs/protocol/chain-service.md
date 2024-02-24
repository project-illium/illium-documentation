---
sidebar_position: 4
---

# Chain Service Protocol

The chain service protocol allows nodes to query each other for blocks and transactions.

### Protocol ID

```go
/ilx/<network>/chainservice/1.0.0
```
Where `<network>` is either `mainnet`, `testnet`, or `regtest` depending on which
network is being used.

### Network Messages

```go
enum ErrorResponse {
    None       = 0;
    NotFound   = 1;
    BadRequest = 2;
    NotCurrent = 3;
}

message MsgChainServiceRequest {
    oneof msg {
        GetBlockTxsReq       get_block_txs        = 1;
        GetBlockTxidsReq     get_block_txids      = 2;
        GetBlockReq          get_block            = 3;
        GetBlockIDReq        get_block_id         = 4;
        GetHeadersStreamReq  get_headers_stream   = 5;
        GetBlockTxsStreamReq get_block_txs_stream = 6;
        GetBestReq           get_best             = 7;
    }
}

// Request to download tranasctions at specific
// indexes within a block.
message GetBlockTxsReq {
    bytes block_ID              = 1;
    repeated uint32 tx_indexes  = 2;
}

message MsgBlockTxsResp {
    repeated Transaction transactions = 1;
    ErrorResponse error               = 2;
}

// Request to download the full list of txids
// in the block.
message GetBlockTxidsReq {
    bytes block_ID = 1;
}

message MsgBlockTxidsResp {
    repeated bytes txids = 1;
    ErrorResponse error  = 2;
}

// Request to download a full block
message GetBlockReq {
    bytes block_ID = 1;
}

message MsgBlockResp {
    Block block         = 1;
    ErrorResponse error = 2;
}

// Request to get the block ID at a given height
message GetBlockIDReq {
    uint32 height = 1;
}

message MsgGetBlockIDResp {
    bytes block_ID       = 1;
    ErrorResponse error  = 2;
}

// Request to stream a batch of block headers
message GetHeadersStreamReq {
    uint32 start_height = 1;
}

// Request to stream a batch of block transactions (the full
// transaction list for each block)
message GetBlockTxsStreamReq {
    uint32 start_height = 1;
}

// Request to get the peer's block ID and height at the tip of the chain.
message GetBestReq {}

message MsgGetBestResp {
    bytes block_ID      = 1;
    uint32 height       = 2;
    ErrorResponse error = 3;
}
```

### Streaming Requests
The `GetHeadersStreamReq` and `GetBlockTxsStreamReq` open a new stream to the remote peer over which the response is expected
to be returned. The remote peer should close the stream once the batch has been fully written.

```go
batchSize = 2000
```

All other requests may reuse an open stream.