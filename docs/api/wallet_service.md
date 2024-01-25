---
sidebar_position: 4
---
# Wallet Service

```javascript
service WalletService {
    // GetBalance returns the combined balance of all addresses in the wallet
    rpc GetBalance(GetBalanceRequest) returns (GetBalanceResponse) {}

    // GetWalletSeed returns the mnemonic seed for the wallet. If the wallet
    // seed has been deleted via the `DeletePrivateKeys` RPC an error will be
    // returned.
    //
    // **Requires wallet to be unlocked**
    rpc GetWalletSeed(GetWalletSeedRequest) returns (GetWalletSeedResponse) {}

    // GetAddress returns the most recent address of the wallet.
    rpc GetAddress(GetAddressRequest) returns (GetAddressResponse) {}

    // GetTimelockedAddress returns a timelocked address that cannot be spent
    // from until the given timelock has passed. The private key used for this
    // address is the same as the wallet's most recent spend key used in a basic
    // address. This implies the key can be derived from seed, however the wallet
    // will not detect incoming payments to this address unless the timelock is
    // included in the utxo's state field.
    rpc GetTimelockedAddress(GetTimelockedAddressRequest) returns (GetTimelockedAddressResponse) {}

    // GetAddresses returns all the addresses create by the wallet.
    rpc GetAddresses(GetAddressesRequest) returns (GetAddressesResponse) {}

    // GetAddressInfo returns additional metadata about an address.
    rpc GetAddressInfo(GetAddressInfoRequest) returns (GetAddressInfoResponse) {}

    // GetNewAddress generates a new address and returns it. Both a new spend key
    // and view key will be derived from the mnemonic seed.
    rpc GetNewAddress(GetNewAddressRequest) returns (GetNewAddressResponse) {}

    // GetTransactions returns the list of transactions for the wallet
    rpc GetTransactions(GetTransactionsRequest) returns (GetTransactionsResponse) {}

    // GetUtxos returns a list of the wallet's current unspent transaction outputs (UTXOs)
    rpc GetUtxos(GetUtxosRequest) returns (GetUtxosResponse) {}

    // GetPrivateKey returns the serialized spend and view keys for the given address
    //
    // **Requires wallet to be unlocked**
    rpc GetPrivateKey(GetPrivateKeyRequest) returns (GetPrivateKeyResponse) {}

    // ImportAddress imports a watch address into the wallet.
    rpc ImportAddress(ImportAddressRequest) returns (ImportAddressResponse) {}

    // CreateMultisigSpendKeypair generates a spend keypair for use in a multisig address
    rpc CreateMultisigSpendKeypair(CreateMultisigSpendKeypairRequest) returns (CreateMultisigSpendKeypairResponse) {}

    // CreateMultisigViewKeypair generates a view keypair for use in a multisig address
    rpc CreateMultisigViewKeypair(CreateMultisigViewKeypairRequest) returns (CreateMultisigViewKeypairResponse) {}

    // CreateMultisigAddress generates a new multisig address using the provided public keys
    //
    // Note this address is *not* imported. You will need to call `ImportAddress` if you want to watch
    // it.
    rpc CreateMultisigAddress(CreateMultisigAddressRequest) returns (CreateMultisigAddressResponse) {}

    // CreateMultiSignature generates and returns a signature for use when proving a multisig transaction
    rpc CreateMultiSignature(CreateMultiSignatureRequest) returns (CreateMultiSignatureResponse) {}

    // ProveMultisig creates a proof for a transaction with a multisig input
    rpc ProveMultisig(ProveMultisigRequest) returns (ProveMultisigResponse) {}

    // WalletLock encrypts the wallet's private keys
    rpc WalletLock(WalletLockRequest) returns (WalletLockResponse) {}

    // WalletUnlock decrypts the wallet seed and holds it in memory for the specified period of time
    rpc WalletUnlock(WalletUnlockRequest) returns (WalletUnlockResponse) {}

    // SetWalletPassphrase encrypts the wallet for the first time
    rpc SetWalletPassphrase(SetWalletPassphraseRequest) returns (SetWalletPassphraseResponse) {}

    // ChangeWalletPassphrase changes the passphrase used to encrypt the wallet private keys
    rpc ChangeWalletPassphrase(ChangeWalletPassphraseRequest) returns (ChangeWalletPassphraseResponse) {}

    // DeletePrivateKeys deletes the wallet's private keys and seed from disk essentially turning the wallet
    // into a watch-only wallet. It will still record incoming transactions but cannot spend them.
    //
    // **Requires wallet to be unlocked**
    rpc DeletePrivateKeys(DeletePrivateKeysRequest) returns (DeletePrivateKeysResponse) {}

    // CreateRawTransaction creates a new, unsigned (unproven) transaction using the given parameters
    rpc CreateRawTransaction(CreateRawTransactionRequest) returns (CreateRawTransactionResponse) {}

    // CreateRawStakeTransaction creates a new, unsigned (unproven) stake transaction using the given parameters
    rpc CreateRawStakeTransaction(CreateRawStakeTransactionRequest) returns (CreateRawStakeTransactionResponse) {}

    // ProveRawTransaction creates the zk-proof for the transaction. Assuming there are no errors, this
    // transaction should be ready for broadcast.
    rpc ProveRawTransaction(ProveRawTransactionRequest) returns (ProveRawTransactionResponse) {}

    // Stake stakes the selected wallet UTXOs and turns the node into a validator
    //
    // **Requires wallet to be unlocked**
    rpc Stake(StakeRequest) returns (StakeResponse) {}

    // SetAutoStakeRewards make it such that any validator rewards that are earned are automatically staked
    //
    // **Requires wallet to be unlocked**
    rpc SetAutoStakeRewards(SetAutoStakeRewardsRequest) returns (SetAutoStakeRewardsResponse) {}

    // Spend sends coins from the wallet according to the provided parameters
    //
    // **Requires wallet to be unlocked**
    rpc Spend(SpendRequest) returns (SpendResponse) {}

    // TimelockCoins moves coins into a timelocked address using the requested timelock.
    // The internal wallet will be able to spend the coins after the timelock expires and
    // the transaction will be recoverable if the wallet is restored from seed.
    //
    // This RPC primarily exists to lock coins for staking purposes.
    //
    // **Requires wallet to be unlocked**
    rpc TimelockCoins(TimelockCoinsRequest) returns (TimelockCoinsResponse) {}

    // SweepWallet sweeps all the coins from this wallet to the provided address.
    // This RPC is provided so that you don't have to try to guess the correct fee
    // to take the wallet's balance down to zero. Here the fee will be subtracted
    // from the total funds.
    //
    // **Requires wallet to be unlocked**
    rpc SweepWallet(SweepWalletRequest) returns (SweepWalletResponse) {}

    // SubscribeWalletTransactions subscribes to a stream of WalletTransactionsNotifications that return
    // whenever a transaction belonging to the wallet finalizes.
    rpc SubscribeWalletTransactions(SubscribeWalletTransactionsRequest) returns (stream WalletTransactionNotification) {}

    // SubscribeWalletSyncNotifications streams notifications about the status of the wallet sync.
    rpc SubscribeWalletSyncNotifications(SubscribeWalletSyncNotificationsRequest) returns (stream WalletSyncNotification) {}
}
```

### RPC Messages

```go
message GetBalanceRequest {}
message GetBalanceResponse {
    // Balance response
    uint64 balance = 1;
}

message GetWalletSeedRequest {}
message GetWalletSeedResponse {
    // The wallet's mnemonic seed
    string mnemonic_seed = 1;
}

message GetAddressRequest {}
message GetAddressResponse {
    // The most recent wallet address
    string address = 1;
}

message GetTimelockedAddressRequest {
    // The unix timestamp (in seconds) to lock the coins until
    int64 lock_until = 1;
}
message GetTimelockedAddressResponse {
    // The resulting timelocked address
    string address = 1;
}

message GetAddressesRequest {}
message GetAddressesResponse {
    // All wallet addresses
    repeated string addresses = 1;
}

message GetAddressInfoRequest {
    // The address to get info for
    string address = 1;
}
message GetAddressInfoResponse {
    // The address to import
    string address          = 1;
    
    // This is the serialized locking script
    // <scriptCommitment><lockingParams>
    bytes lockingScript   = 2;
    
    //  The private view key for the address
    bytes viewPrivateKey     = 3;
    
    // Is this address watch only
    bool watchOnly          = 4;
}

message GetNewAddressRequest {}
message GetNewAddressResponse {
    // A fresh address generated by the wallet
    string address = 1;
}
message GetTransactionsRequest {}
message GetTransactionsResponse {
    // All transactions in the wallet
    repeated WalletTransaction txs = 1;
}

message GetUtxosRequest {}
message GetUtxosResponse {
    // The full list of utxos in the wallet
    repeated Utxo utxos = 1;
}

message GetPrivateKeyRequest {
    // The address to fetch private keys for
    string address = 1;
}
message GetPrivateKeyResponse {
    bytes serialized_keys = 2;
}

message ImportAddressRequest {
    // The address to import
    string address          = 1;
    
    // The address contains a scriptHash. We also
    // need what's behind the hash in order to
    // import an address and detect spends.
    //
    // This is the serialized locking script
    // <scriptCommitment><lockingParams>
    bytes lockingScript   = 2;
    
    // The view private key needed to decrypt and
    // detect transactions.
    bytes viewPrivateKey    = 3;
    
    // Should the wallet rescan the blockchain looking for
    // transactions for this address.
    bool rescan             = 4;
    // If so what height should it start the rescan.
    uint32 rescanFromHeight = 5;
}
message ImportAddressResponse {}

message CreateMultisigSpendKeypairRequest{}
message CreateMultisigSpendKeypairResponse{
    // A private key response
    bytes privkey = 1;
    // The corresponding public key
    bytes pubkey = 2;
}

message CreateMultisigViewKeypairRequest{}
message CreateMultisigViewKeypairResponse{
    // A private key response
    bytes privkey = 1;
    // The corresponding public key
    bytes pubkey = 2;
}

message CreateMultisigAddressRequest {
    // A list of public keys to use for the multisig address
    repeated bytes pubkeys = 1;
    // The number of keys required to sign the tranaction to
    // release the funds.
    uint32 threshold       = 2;
    
    // A view key to use with the address
    bytes view_pubkey      = 3;
}
message CreateMultisigAddressResponse {
    // Multisig address response
    string address = 1;
}

message CreateMultiSignatureRequest {
    oneof tx_or_sighash {
        // Either provide the transaction so the sighash can be computed
        Transaction tx = 1;
        // Or just provide the sighash itself
        bytes sighash  = 2;
    }
    
    // A private key to sign with
    bytes private_key  = 3;
}
message CreateMultiSignatureResponse {
    // A signature covering the sighash
    bytes signature = 1;
}

message ProveMultisigRequest {
    // A transaction to prove. This RPC requires there to be only one
    // input and that the input be a multisig script.
    RawTransaction raw_tx = 1;
    
    // A list of signatures. Each one must cover the transaction's sighash.
    repeated bytes sigs   = 2;
}
message ProveMultisigResponse {
    // A full transaction with the proof attached
    Transaction proved_tx = 1;
}

message WalletLockRequest {}
message WalletLockResponse {}

message WalletUnlockRequest {
    // The wallet passphrase used to decrypt
    string passphrase = 1;
    // The duration (in seconds) to leave the wallet decrypted for.
    // It will automatically be re-encrypted after the duration passes.
    uint32 duration   = 2;
}
message WalletUnlockResponse {}

message SetWalletPassphraseRequest {
    // Wallet passphrase
    string passphrase = 1;
}
message SetWalletPassphraseResponse{}

message ChangeWalletPassphraseRequest {
    // Current passphrase
    string current_passphrase = 1;
    // Passphrase to change it to
    string new_passphrase     = 2;
}
message ChangeWalletPassphraseResponse {}

message DeletePrivateKeysRequest {}
message DeletePrivateKeysResponse {}

message CreateRawTransactionRequest {
    // A list of either utxo commitments or private inputs
    repeated Input inputs     = 1;
    // A list of outputs to send coins to
    repeated Output outputs   = 2;
    // A bool to control whether the wallet will automatically append a
    // change output and send the remainder of the coins (minus a fee)
    // to the change output.
    bool append_change_output = 3;
    // If append_change_output is true you can specify the fee amount to use.
    // If zero the wallet will use its internal fee policy.
    uint64 fee_per_kilobyte   = 4;

    message Input {
        oneof commitment_or_private_input {
            // This is a utxo commitment known to the wallet
            bytes commitment   = 1;
            // If trying to create a transaction spending a utxo that the
            // wallet does not know about you must provide the full private
            // input data.
            PrivateInput input = 2;
        }
    }

    message Output {
        // Address to send coins to
        string address = 1;
        // The amount to send
        uint64 amount  = 2;
        // An optional state field
        bytes state    = 3;
    }
}
message CreateRawTransactionResponse {
    // Raw transaction response
    RawTransaction raw_tx = 1;
}

message CreateRawStakeTransactionRequest {
    // A list of either utxo commitments or private inputs
    Input input = 1;
    
    message Input {
        oneof commitment_or_private_input {
            // This is a utxo commitment known to the wallet
            bytes commitment   = 1;
            // If trying to create a transaction spending a utxo that the
            // wallet does not know about you must provide the full private
            // input data.
            PrivateInput input = 2;
        }
    }
}
message CreateRawStakeTransactionResponse {
    // Raw transaction response
    RawTransaction raw_tx = 1;
}

message ProveRawTransactionRequest {
    // The raw transaction to prove
    RawTransaction raw_tx = 1;
}
message ProveRawTransactionResponse {
    // A full transaction with the proof attached
    Transaction proved_tx = 1;
}

message StakeRequest {
    // The utxos to stake identified by their commitment hashes
    repeated bytes commitments = 1;
}
message StakeResponse {}

message SetAutoStakeRewardsRequest {
    // Whether to turn on or off autostaking
    bool autostake = 1;
}
message SetAutoStakeRewardsResponse {}

message SpendRequest {
    // Address to send funds to
    string to_address                = 1;
    // Amount to send
    uint64 amount                    = 2;
    // The fee to use for the transaction.
    // If zero the wallet will use its internal fee policy.
    uint64 fee_per_kilobyte          = 3;
    // An optional list of input commitments to spend. If this
    // is empty the wallet will select its own inputs.
    //
    // Note that staked commitments will not be selected by
    // the wallet. You will need to list staked commitments
    // here if you wish to spend them.
    repeated bytes input_commitments = 4;
}
message SpendResponse {
    // The transaction ID of the transaction.
    //
    // If submission was unsuccessful and error will be returned.
    bytes transaction_ID = 1;
}

message TimelockCoinsRequest {
    // Amount of coins to lock
    uint64 amount                    = 1;
    // The unix time (in seconds) to lock the coins until
    int64 lock_until                 = 2;
    // The fee to use for the transaction.
    // If zero the wallet will use its internal fee policy.
    uint64 fee_per_kilobyte          = 3;
    // An optional list of input commitments to spend. If this
    // is empty the wallet will select its own inputs.
    //
    // Note that staked commitments will not be selected by
    // the wallet. You will need to list staked commitments
    // here if you wish to spend them.
    repeated bytes input_commitments = 4;
}
message TimelockCoinsResponse {
    // The transaction ID of the transaction.
    //
    // If submission was unsuccessful and error will be returned.
    bytes transaction_ID = 1;
}

message SweepWalletRequest {
    // Address to send funds to
    string to_address                = 1;
    
    // The fee to use for the transaction.
    // If zero the wallet will use its internal fee policy.
    uint64 fee_per_kilobyte          = 2;
    
    // An optional list of input commitments to sweep. If this
    // is empty the entire wallet will be swept.
    //
    // Note that staked commitments will not be selected by
    // the wallet. You will need to list staked commitments
    // here if you wish to sweep them.
    repeated bytes input_commitments = 3;
}
message SweepWalletResponse {
    // The transaction ID of the transaction.
    //
    // If submission was unsuccessful and error will be returned.
    bytes transaction_ID = 1;
}

message SubscribeWalletTransactionsRequest {}
message SubscribeWalletSyncNotificationsRequest {}
```