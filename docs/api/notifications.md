---
sidebar_position: 7
---
# Notifications

```go
message TransactionNotification {
    // The transaction in this notification has finalized and
    // been added to the blockchain.
    Transaction transaction = 1;
}

message WalletTransactionNotification {
    // The transaction in this notification has finalized and
    // been added to the blockchain.
    WalletTransaction transaction = 1;
}

message WalletSyncNotification {
	// The current height the wallet is synced up to
    uint32 current_height = 1;
    // The height of the chain that the wallet is syncing to
    uint32 best_height    = 2;
}

message BlockNotification {
    // The BlockInfo (including header data) for the block
    BlockInfo block_info                  = 1;
    // The blocks transactions (if requested).
    //
    // The transactions will either be returned in for or just the txids depending
    // on the request.
    repeated TransactionData transactions = 2;
}

message CompressedBlockNotification {
    // A compressed block containing only the height,
    // txids, outputs, and nullifiers.
    CompressedBlock block = 1;
}
```