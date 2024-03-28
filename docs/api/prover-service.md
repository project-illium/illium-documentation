---
sidebar_position: 4
---
# Prover Service

```javascript
service ProverService {
    // Prove creates the proof for the transaction and returns the transaction
    // with the proof attached. The transaction is *not* submitted to the network.
    //
    // The transaction is validated against the mempool and will return an error
    // if it is an otherwise invalid transaction.
    rpc Prove(ProveRequest) returns (ProveResponse) {}
    
    // ProveAndSubmit creates the proof for the transaction and then submits it to
    // the network. And error is returned if it fails mempool submission.
    rpc ProveAndSubmit(ProveAndSubmitRequest) returns (ProveAndSubmitResponse) {}
}
```

### RPC Messages

```go
message ProveRequest {
    // The full transaction with the proof set to nil
    Transaction transaction        = 1;
    // The private (hidden) data for each input
    repeated PrivateInput inputs   = 2;
    // The private (hidden) data for each output
    repeated PrivateOutput outputs = 3;
}
message ProveResponse {
    // The returned transaction with the proof attached
    Transaction transaction = 1;
}

message ProveAndSubmitRequest {
    // The full transaction with the proof set to nil
    Transaction transaction        = 1;
    // The private (hidden) data for each input
    repeated PrivateInput inputs   = 2;
    // The private (hidden) data for each output
    repeated PrivateOutput outputs = 3;
}
message ProveAndSubmitResponse {
    // The transaction ID of the transaction.
    //
    // If submission was unsuccessful and error will be returned.
    bytes transaction_ID = 1;
}
```