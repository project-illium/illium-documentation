---
sidebar_position: 3
---
# Node Service

```protobuf
service NodeService {
    // GetHostInfo returns info about the libp2p host
    rpc GetHostInfo(GetHostInfoRequest) returns (GetHostInfoResponse) {}

    // GetPeers returns a list of peers that this node is connected to
    rpc GetPeers(GetPeersRequest) returns (GetPeersResponse) {}

    // AddPeer attempts to connect to the provided peer
    rpc AddPeer(AddPeerRequest) returns (AddPeerResponse) {}

    // BlockPeer blocks the given peer for the provided time period
    rpc BlockPeer(BlockPeerRequest) returns (BlockPeerResponse) {}

    // UnblockPeer removes a peer from the block list
    rpc UnblockPeer(UnblockPeerRequest) returns (UnblockPeerResponse) {}

    // SetLogLevel changes the logging level of the node
    rpc SetLogLevel(SetLogLevelRequest) returns (SetLogLevelResponse) {}

    // GetMinFeePerKilobyte returns the node's current minimum transaction fee needed to relay
    // transactions and admit them into the mempool. Validators will also set their initial preference
    // for blocks containing transactions with fees below this threshold to not-preferred.
    rpc GetMinFeePerKilobyte(GetMinFeePerKilobyteRequest) returns (GetMinFeePerKilobyteResponse) {}

    // SetMinFeePerKilobyte sets the node's fee policy
    rpc SetMinFeePerKilobyte(SetMinFeePerKilobyteRequest) returns (SetMinFeePerKilobyteResponse) {}

    // GetMinStake returns the node's current minimum stake policy. Stake transactions staking less than
    // this amount will not be admitted into the mempool and will not be relayed. Validators will also
    // set their initial preference for blocks containing stake transactions below this threshold to
    // not-preferred.
    rpc GetMinStake(GetMinStakeRequest) returns (GetMinStakeResponse) {}

    // SetMinStake sets the node's minimum stake policy
    rpc SetMinStake(SetMinStakeRequest) returns (SetMinStakeResponse) {}

    // GetBlockSizeSoftLimit returns the node's current blocksize soft limit. Validators will also
    // set their initial preference for blocks over this size to not-preferred.
    rpc GetBlockSizeSoftLimit(GetBlockSizeSoftLimitRequest) returns (GetBlockSizeSoftLimitResponse) {}

    // SetBlockSizeSoftLimit sets the node's blocksize soft limit policy.
    rpc SetBlockSizeSoftLimit(SetBlockSizeSoftLimitRequest) returns (SetBlockSizeSoftLimitResponse) {}

    // GetTreasuryWhitelist returns the current treasury whitelist for the node. Blocks containing
    // TreasuryTransactions not found in this list will have their initial preference set to not-preferred.
    rpc GetTreasuryWhitelist(GetTreasuryWhitelistRequest) returns (GetTreasuryWhitelistResponse) {}

    // UpdateTreasuryWhitelist adds or removes a transaction to from the treasury whitelist
    rpc UpdateTreasuryWhitelist(UpdateTreasuryWhitelistRequest) returns (UpdateTreasuryWhitelistResponse) {}

    // ReconsiderBlock tries to reprocess the given block
    rpc ReconsiderBlock(ReconsiderBlockRequest) returns (ReconsiderBlockResponse) {}

    // RecomputeChainState deletes the accumulator, validator set, and nullifier set and rebuilds them by
    // loading and re-processing all blocks from genesis.
    rpc RecomputeChainState(RecomputeChainStateRequest) returns (RecomputeChainStateResponse) {}
}
```

### RPC Messages

```protobuf
message GetHostInfoRequest {}
message GetHostInfoResponse {
    // The host peer ID
    string peer_ID        = 1;
    // A list of multiaddrs that this node is listening on
    repeated string addrs = 2;
    // The number of peers this node is connected to
    uint32 peers    = 3;
    // Is tx index enabled
    bool tx_index         = 4;
    // Is the wallet server enabled
    bool wallet_server    = 5;
}

message GetPeersRequest {}
message GetPeersResponse {
    // List of peers
    repeated Peer peers = 1;
}

message AddPeerRequest {
    // The peer addr to add. This must be in multiaddr format and include
    // the /p2p/<peerID> field.
    // Ex) /ip4/167.172.126.176/tcp/4001/p2p/12D3KooWHnpVyu9XDeFoAVayqr9hvc9xPqSSHtCSFLEkKgcz5Wro
    string addr = 1;
}
message AddPeerResponse {}

message BlockPeerRequest {
    // Peer ID to block
    string peer_ID = 1;
}
message BlockPeerResponse {}

message UnblockPeerRequest {
    // Peer ID to unblock
    string peer_ID = 1;
}
message UnblockPeerResponse {}

message SetLogLevelRequest {
    // The debug level to set the logging to
    Level level = 1;

    enum Level {
       DEBUG     = 0;
       INFO      = 1;
       WARNING   = 2;
       ERROR     = 3;
       CRITICAL  = 4;
       ALERT     = 5;
       EMERGENCY = 6;
    }
}
message SetLogLevelResponse {}

message GetMinFeePerKilobyteRequest {}
message GetMinFeePerKilobyteResponse {
    // Fee per kilobyte response
    uint64 fee_per_kilobyte = 1;
}

message SetMinFeePerKilobyteRequest {
    // Fee per byte to set
    uint64 fee_per_kilobyte = 1;
}
message SetMinFeePerKilobyteResponse {}

message GetMinStakeRequest {}
message GetMinStakeResponse {
    // Minimum stake response
    uint64 min_stake_amount = 1;
}

message SetMinStakeRequest {
    // Minimum stake amount to set
    uint64 min_stake_amount = 1;
}
message SetMinStakeResponse {}

message GetBlockSizeSoftLimitRequest {}
message GetBlockSizeSoftLimitResponse {
    // Block size response
    uint32 block_size = 1;
}

message SetBlockSizeSoftLimitRequest {
    // Blocksize to set
    uint32 block_size = 1;
}
message SetBlockSizeSoftLimitResponse {}

message GetTreasuryWhitelistRequest {}
message GetTreasuryWhitelistResponse {
    // Whitelisted txids
    repeated bytes txids = 1;
}

message UpdateTreasuryWhitelistRequest {
    // Txids to add to the whitelist
    repeated bytes add    = 1;
    // Txids to remove from the whitelist
    repeated bytes remove = 2;
}
message UpdateTreasuryWhitelistResponse {}

message ReconsiderBlockRequest {
    // Block ID to reconsider.
    bytes block_ID = 1;

    // We likely don't have the block and will have to download it from
    // another peer. You can set the peer here. If empty we will try to find
    // it form a few random peers.
    string download_peer = 2;
}
message ReconsiderBlockResponse {}

message RecomputeChainStateRequest {}
message RecomputeChainStateResponse {}
```
