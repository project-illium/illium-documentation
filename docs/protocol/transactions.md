---
sidebar_position: 6
---

# Transaction Format

```go
message Transaction {
    oneof Tx {
        StandardTransaction standard_transaction = 1;
        CoinbaseTransaction coinbase_transaction = 2;
        StakeTransaction    stake_transaction    = 3;
        TreasuryTransaction treasury_transaction = 4;
        MintTransaction     mint_transaction     = 5;
    }
}

message Output {
    bytes commitment       = 1;
    bytes ciphertext       = 2;
}

message StandardTransaction {
    repeated Output outputs =   1;
    repeated bytes nullifiers = 2;
    bytes txo_root            = 3;
    Locktime locktime         = 4;
    uint64 fee                = 5;
    bytes proof               = 6;
}

message CoinbaseTransaction {
    bytes validator_ID       = 1;
    uint64 new_coins         = 2;
    repeated Output outputs  = 3;
    bytes signature          = 4;
    bytes proof              = 5;
}

message StakeTransaction {
    bytes validator_ID = 1;
    uint64 amount      = 2;
    bytes nullifier    = 3;
    bytes txo_root     = 4;
    int64 locked_until = 5;
    bytes signature    = 6;
    bytes proof        = 7;
}

message TreasuryTransaction {
    uint64 amount            = 1;
    repeated Output outputs  = 2;
    bytes proposal_hash      = 3;
    bytes proof              = 4;
}

message MintTransaction {
    AssetType type            = 1;
    bytes asset_ID            = 2;
    bytes document_hash       = 3;
    uint64 new_tokens         = 4;
    repeated Output outputs   = 5;
    uint64 fee                = 6;
    repeated bytes nullifiers = 7;
    bytes txo_root            = 8;
    bytes mint_key            = 9;
    Locktime locktime         = 10;
    bytes signature           = 11;
    bytes proof               = 12;

    enum AssetType {
        FIXED_SUPPLY    = 0;
        VARIABLE_SUPPLY = 1;
    }
}

message Locktime {
    int64 timestamp = 1;
    int64 precision = 2;
}
```