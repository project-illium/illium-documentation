---
sidebar_position: 2
---
# Blockchain Service
```javascript
service BlockchainService {
    // GetMempoolInfo returns the state of the current mempool
    rpc GetMempoolInfo(GetMempoolInfoRequest) returns (GetMempoolInfoResponse) {}

    // GetMempool returns all the transactions in the mempool
    rpc GetMempool(GetMempoolRequest) returns (GetMempoolResponse) {}

    // GetBlockchainInfo returns data about the blockchain including the most recent
    // block hash and height.
    rpc GetBlockchainInfo(GetBlockchainInfoRequest) returns (GetBlockchainInfoResponse) {}

    // GetBlockInfo returns a BlockHeader plus some extra metadata.
    rpc GetBlockInfo(GetBlockInfoRequest)returns (GetBlockInfoResponse) {}

    // GetBlock returns a BlockInfo metadata object plus the transactions either
    // as IDs or full transactions.
    rpc GetBlock(GetBlockRequest) returns (GetBlockResponse) {}
    
    // GetRawBlock returns the raw block in protobuf format
    rpc GetRawBlock(GetRawBlockRequest) returns (GetRawBlockResponse) {}

    // GetCompressedBlock returns a block that is stripped down to just the outputs.
    // It is the bare minimum information a client side wallet needs to compute its internal
    // state.
    rpc GetCompressedBlock(GetCompressedBlockRequest) returns (GetCompressedBlockResponse) {}

    // GetHeaders returns a batch of headers according to the request parameters.
    rpc GetHeaders(GetHeadersRequest) returns (GetHeadersResponse) {}

    // GetCompressedBlocks returns a batch of CompressedBlocks according to the request parameters.
    rpc GetCompressedBlocks(GetCompressedBlocksRequest) returns (GetCompressedBlocksResponse) {}

    // GetTransaction returns the transaction for the given transaction ID.
    //
    // **Requires TxIndex**
    // **Input/Output metadata requires AddrIndex**
    rpc GetTransaction(GetTransactionRequest) returns (GetTransactionResponse) {}

    // GetAddressTransactions returns a list of transactions for the given address
    // Note: only public address are indexed
    //
    // **Requires AddrIndex**
    rpc GetAddressTransactions(GetAddressTransactionsRequest) returns (GetAddressTransactionsResponse) {}

    // GetMerkleProof returns a Merkle (SPV) proof for a specific transaction
    // in the provided block.
    //
    // **Requires TxIndex**
    rpc GetMerkleProof(GetMerkleProofRequest) returns (GetMerkleProofResponse) {}

    // GetValidator returns all the information about the given validator including number
    // of staked coins.
    rpc GetValidator(GetValidatorRequest) returns (GetValidatorResponse) {}

    // GetValidatorSetInfo returns information about the validator set.
    rpc GetValidatorSetInfo(GetValidatorSetInfoRequest) returns (GetValidatorSetInfoResponse) {}

    // GetValidatorSet returns all the validators in the current validator set.
    rpc GetValidatorSet(GetValidatorSetRequest) returns (GetValidatorSetResponse) {}

    // GetValidatorCoinbases returns a list of coinbase txids for the validator.
    //
    // **Requires AddrIndex**
    rpc GetValidatorCoinbases(GetValidatorCoinbasesRequest) returns (GetValidatorCoinbasesResponse) {}
    
    // GetAccumulatorCheckpoint returns the accumulator at the requested height.
    // If there is no checkpoint at that height, the *prior* checkpoint found in the
    // chain will be returned. If there is no prior checkpoint (as is prior to the first)
    // an error will be returned.
    rpc GetAccumulatorCheckpoint(GetAccumulatorCheckpointRequest) returns (GetAccumulatorCheckpointResponse) {}

    // SubmitTransaction validates a transaction and submits it to the network. An error will be returned
    // if it fails validation.
    rpc SubmitTransaction(SubmitTransactionRequest) returns (SubmitTransactionResponse) {}

    // SubscribeBlocks returns a stream of notifications when new blocks are finalized and
    // connected to the chain.
    rpc SubscribeBlocks(SubscribeBlocksRequest) returns (stream BlockNotification) {}

    // SubscribeCompressedBlocks returns a stream of CompressedBlock notifications when new
    // blocks are finalized and connected to the chain.
    rpc SubscribeCompressedBlocks(SubscribeCompressedBlocksRequest) returns (stream CompressedBlockNotification) {}
}
```

### RPC Messages
```go
message GetMempoolInfoRequest{}
message GetMempoolInfoResponse {
    // The count of transactions in the mempool
    uint32 size  = 1;
    // The size in bytes of all transactions in the mempool
    uint32 bytes = 2;
}

message GetMempoolRequest {
    // When `full_transactions` is true, full transaction data is provided
    // instead of just transaction hashes. Default is false.
    bool full_transactions = 1;
}
message GetMempoolResponse {
    // List of unconfirmed transactions.
    repeated TransactionData transaction_data = 1;
}

message GetBlockchainInfoRequest {}
message GetBlockchainInfoResponse {
    // Illium network types
    enum Network {
        // Live public network with monetary value
        MAINNET  = 0;
        // An isolated environment for automated testing
        REGTEST  = 1;
        // A public environment where monetary value is agreed to be zero,
        // and some checks for transaction conformity are disabled.
        TESTNET  = 2;
        // Alpha testnet
        ALPHANET = 3;
    }
    
    // Which network the node is operating on
    Network network           = 1;
    // The current number of blocks in the chain
    uint32 best_height        = 2;
    // The hash of the best (tip) block in the chain
    bytes best_block_ID       = 3;
    // The timestamp of the best block
    int64 block_time          = 4;
    // When `tx_index` is true, the node has full transaction index enabled
    bool tx_index             = 5;
    // The total number of coins in circulation in nanoillium
    uint64 circulating_supply = 6;
    // The total number of coins staked in nanoillium
    uint64 total_staked       = 7;
    // The balance of the treasury in nanoillium
    uint64 treasury_balance   = 8;
    // The total size of the database on disk
    uint64 blockchain_size    = 9;
    // The current epoch number (also total number of epochs)
    uint32 epoch              = 10;
}

message GetBlockInfoRequest {
    oneof id_or_height {
        // The block hash as a byte array
        bytes block_ID = 1;
        // The block number
        uint32 height  = 2;
    }
}
message GetBlockInfoResponse {
    // Marshaled block header data, as well as metadata
    BlockInfo info = 1;
}

message GetBlockRequest {
    oneof id_or_height {
        // The block hash as a byte array
        bytes block_ID = 1;
        // The block number
        uint32 height  = 2;
    }

    // Default is false, only the transaction IDs are included for
    // a marshaled block.
    bool full_transactions = 3;
}
message GetBlockResponse {
    // The BlockInfo (including header data) for the block
    BlockInfo block_info                  = 1;
    // The blocks transactions (if requested).
    //
    // The transactions will either be returned in for or just the txids depending
    // on the request.
    repeated TransactionData transactions = 2;
}

message GetRawBlockRequest {
    oneof id_or_height {
        // The block hash as a byte array
        bytes block_ID = 1;
        // The block number
        uint32 height   = 2;
    }
}
message GetRawBlockResponse {
    // The full block response
    Block block = 1;
}

message GetCompressedBlockRequest {
    oneof id_or_height {
        // The block hash as a byte array
        bytes block_ID = 1;
        // The block number
        uint32 height  = 2;
    }
}
message GetCompressedBlockResponse {
    // The compressed block contains only transaction outputs
    CompressedBlock block = 1;
}

message GetHeadersRequest {
    // The height to start receiving headers
    uint32 start_height = 1;
    // The last header height to return. Note that a maximum of 2000
    // blocks will be returned per request. If end_height is > start_height + 1999
    // then end_height will be set set to start_height + 1999 and 2000 headers
    // will be returned. If end_height is past the tip of the chain the headers
    // will be returned up to the tip.
    //
    // If end_height is less than start_height 2000 headers will be returned.
    uint32 end_height   = 2;
}
message GetHeadersResponse {
    repeated BlockHeader headers = 1;
}

message GetCompressedBlocksRequest {
    // The height to start receiving headers
    uint32 start_height = 1;
    // The last block height to return. Note that a maximum of 2000 blocks will be returned
    // per request. If end_height is > start_height + 1999 then end_height will be set set
    // to start_height + 1999 and 2000 compressed blocks will be returned. If end_height is
    // past the tip of the chain the compressed blocks will be returned up to the tip.
    //
    // If end_height is less than start_height 2000 blocks will be returned.
    uint32 end_height   = 2;
}
message GetCompressedBlocksResponse {
    // The compressed block response
    repeated CompressedBlock blocks = 1;
}

message GetTransactionRequest {
    // A transaction hash
    bytes transaction_ID = 1;
}
message GetTransactionResponse {
    // The transaction response
    Transaction tx              = 1;
    // The ID of the containing block
    bytes block_ID              = 2;
    // The height of the containing block
    uint32 height               = 3;

    // The input and output metadata will
    // only only be non-nil if the address
    // index is enabled.
    //
    // Further it will only metadata for public
    // inputs or outputs will be included otherwise
    // it will be `unknown`.
    repeated IOMetadata inputs  = 4;
    repeated IOMetadata outputs = 5;
}

message GetAddressTransactionsRequest {
    // The address to get transactions for
    string address = 1;
    // The number of transactions to skip, starting with the oldest first.
    uint32 nb_skip = 2;
    // Specify the number of transactions to fetch.
    uint32 nb_fetch = 3;
}
message GetAddressTransactionsResponse {
    // The list of transactions
    repeated TransactionWithMetadata txs = 1;
    
    message TransactionWithMetadata {
        // The transaction response
		Transaction tx              = 1;
		// The ID of the containing block
		bytes block_ID              = 2;
        // The height of the containing block
        uint32 height               = 3;
        
        // Metadata will only metadata for public
        // inputs or outputs will be included otherwise
        // it will be `unknown`.
        repeated IOMetadata inputs  = 4;
        repeated IOMetadata outputs = 5;
    }
}

message GetMerkleProofRequest {
    // A transaction hash
    bytes transaction_ID = 1;
}
message GetMerkleProofResponse {
    // Block header information for the corresponding transaction
    BlockInfo block       = 1;
    // Is the proof hashes linking the tx to the root
    repeated bytes hashes = 2;
    // The least significant bit in flags corresponds to the last hash in `hashes`. The second least
    // significant to the second to last hash, and so on. The bit signifies whether the hash should be
    // prepended (0) or appended (1) when hashing each level in the tree.
    uint32 flags          = 3;
}

message GetValidatorRequest {
    // A serialized validator ID
    bytes validator_ID = 1;
}
message GetValidatorResponse {
    // The validator response
    Validator validator = 1;
}

message GetValidatorCoinbasesRequest {
    // A serialized validator ID
    bytes validator_ID = 1;
}
message GetValidatorCoinbasesResponse {
    // Coinbase transactions
    repeated bytes txids = 1;
}

message GetValidatorSetInfoRequest{}
message GetValidatorSetInfoResponse{
    // The total number of coins staked on the network in nanoillium
    uint64 total_staked   = 1;
    // The total stake weighted by time locks in nanoillium
    uint64 stake_weight   = 2;
    // The total number of validators on the network
    uint32 num_validators = 3;
}

message GetValidatorSetRequest{}
message GetValidatorSetResponse{
    // The full list of validators on the network
    repeated Validator validators = 1;
}

message GetAccumulatorCheckpointRequest{
    oneof height_or_timestamp {
        // The height of the accumulator checkpoint to return.
        // If there is no checkpoint at that height, the *prior*
        // checkpoint found in the chain will be returned.
        //
        // An error will be returned if there is no checkpoint before
        // the provided height.
        uint32 height   = 1;
        
        // The timestamp of the accumulator checkpoint to return.
        // If there is no checkpoint at that timestamp, the *prior*
        // checkpoint found in the chain will be returned.
        //
        // An error will be returned if there is no checkpoint before
        // the provided timestamp.
        int64 timestamp = 2;
    }
}
message GetAccumulatorCheckpointResponse{
    // The height of the checkpoint
    uint32 height              = 1;
    // The number of entries in the accumulator at this checkpoint
    uint64 num_entries         = 2;
    // The accumulator hashes
    repeated bytes accumulator = 3;
}

message SubmitTransactionRequest {
    // The transaction to submit to the network
    Transaction transaction = 1;
}
message SubmitTransactionResponse {
    // The transaction ID of the transaction.
    //
    // If submission was unsuccessful and error will be returned.
    bytes transaction_ID = 1;
}

message SubscribeBlocksRequest {
    // When full_block is true, a complete marshaled block is sent.
    // Default is false, block metadata is sent. See `BlockInfo`.
    bool full_block        = 1;
    
    // When full_transactions is true, provide full transaction info
    // for a marshaled block.
    //
    // Default is false, only the transaction IDs are included for
    // a marshaled block.
    bool full_transactions = 2;
}

message SubscribeCompressedBlocksRequest {}
```