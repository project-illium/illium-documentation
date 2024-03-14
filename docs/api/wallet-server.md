---
sidebar_position: 3
---
# Wallet Server Service

```javascript
service WalletServerService {
    // RegisterViewKey registers a new view key with the server. The server will use this key when
    // attempting to decrypt each output. If outputs decrypt, they will be indexed so the client
    // can fetch them later.
    //
    // To free up resources keys will automatically unregister if the wallet has not connected
    // in some time.
    rpc RegisterViewKey(RegisterViewKeyRequest) returns (RegisterViewKeyResponse) {}

    // SubscribeTransactions subscribes to a stream of TransactionsNotifications that match to the
    // provided view key.
    rpc SubscribeTransactions(SubscribeTransactionsRequest) returns (stream TransactionNotification) {}

    // GetWalletTransactions returns a list of transactions for the provided view key.
    rpc GetWalletTransactions(GetWalletTransactionsRequest) returns (GetWalletTransactionsResponse) {}

    // GetTxoProof returns the merkle inclusion proof for the given commitment. This information is needed
    // by the client to create the zero knowledge proof needed to spend the transaction.
    rpc GetTxoProof(GetTxoProofRequest) returns (GetTxoProofResponse) {}
}
```

### RPC Messages

```go
message RegisterViewKeyRequest {
    // A view key to register with the server.
    bytes view_key                = 1;
    
    // The locking script associated with the address belonging
    // to the view key serialized as <scriptCommitment><lockingParams...>
    //
    // The server needs this in order to compute the nullifier and detect
    // spend transactions.
    bytes serializedLockingScript = 2;
    
    // The date the address was created. The server will scan historical blocks
    // for matching transactions from the birthday forward. Please don't use an
    // earlier birthday than needed as it puts more stress on the server.
    //
    // A zero value will not trigger a rescan.
    int64 birthday                = 3;
}
message RegisterViewKeyResponse {}

message SubscribeTransactionsRequest {
    // A list of view keys to subscribe to
    repeated bytes view_keys = 1;
}

message GetWalletTransactionsRequest{
    // The view key to query transactions
    bytes view_key  = 1;
    
    // The number of transactions to skip, starting with the oldest first.
    uint32 nb_skip  = 2;
    // Specify the number of transactions to fetch.
    uint32 nb_fetch = 3;
    
    oneof start_block {
        // Recommended. Only get transactions after (or within) a
        // starting block identified by hash.
        bytes block_ID = 4;
        // Recommended. Only get transactions after (or within) a
        // starting block identified by block number.
        uint32 height  = 5;
    }
}
message GetWalletTransactionsResponse {
    // The height of the chain as of this query
    uint32 chain_height               = 1;
    // A list of transactions as the response
    repeated Transaction transactions = 2;
}

message GetTxoProofRequest {
    // One or more commitments to fetch the txo proof for.
    // Since transactions only contain one txo_root you
    // should request the commitment for each input in your
    // transaction as a batch so the returned proofs all share
    // the same txo_root. Otherwise you may get different roots
    // if you request them separately.
    repeated bytes commitments = 1;
}
message GetTxoProofResponse {
    // The proof responses
    repeated TxoProof proofs = 1;
}
```