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