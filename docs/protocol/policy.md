---
sidebar_position: 5
---

# Policy Protocol

The policy protocol exposes an RPC protocol which allows network crawlers to query each node
for their current policy settings. This endpoint is rate limited as there isn't much of a need
to query too frequently.

### Protocol ID

```go
/ilx/<network>/policy/1.0.0
```

Where `<network>` is either `mainnet`, `testnet`, or `regtest` depending on which
network is being used.

### Network Messages

```go
message MsgPolicyRequest {
    oneof msg {
        GetFeePerKB get_fee_per_kb                     = 1;
        GetMinStake get_min_stake                      = 2;
        GetBlocksizeSoftLimit get_blocksize_soft_limit = 3;
        GetTreasuryWhitelist get_treasury_whitelist    = 4;
    }
}

message GetFeePerKB {}

message MsgGetFeePerKBResp {
    uint64 fee_per_kb = 1;
}

message GetMinStake {}

message MsgGetMinStakeResp {
    uint64 min_stake = 1;
}

message GetBlocksizeSoftLimit {}

message MsgGetBlocksizeSoftLimitResp {
    uint32 limit = 1;
}

message GetTreasuryWhitelist {}

message MsgGetTreasuryWhitelistResp {
    repeated bytes whitelist = 1;
}
```