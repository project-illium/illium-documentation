---
sidebar_position: 6
---
# Notifications

```go
message TransactionNotification {
    // State of the transaction acceptance.
    enum Type {
        // A transaction in mempool.
        UNCONFIRMED = 0;
        // A transaction in a finalized block.
        FINALIZED   = 1;
    }

    // Whether or not the transaction has been included in a block.
    Type type = 1;
    oneof transaction {
        // A transaction included in a block.
        Transaction finalized_transaction          = 2;
        // A transaction in mempool.
        MempoolTransaction unconfirmed_transaction = 3;
    }
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
```