---
sidebar_position: 3
---

# Command Line Interface

`ilxcli` is a command line interface for controlling a running ilxd instance. It communicates with ilxd via the gRPC API.
As noted in the [API docs](https://illium.org/docs/api/overview) the gRPC API requires use of TLS for connections.

By default, ilxd generates a self-signed certificate for use with the gRPC interface and ilxcli will look for the self-signed
cert in the default home directory. Thus, if you are running ilxd on localhost with the default configuration ilxcli should
be able to connect to ilxd with no further configuration. 

### Connection Options

If you want to connect ilxcli to a remote instance of ilxd, or if you need to change the default configuration, there are
options for that:

```
Connection options:
  -C, --configfile= Path to configuration file
  -t, --authtoken=  The ilxd node gRPC authentican token if needed
  -a, --serveraddr= The address of the ilxd gRPC server (in multiaddr format)
                    (default: /ip4/127.0.0.1/tcp/5001)
      --rpccert=    A path to the SSL certificate to use with gRPC (this is
                    only need if using a self-signed cert) (default:
                    ~/.ilxd/rpc.cert)
```

For example, if you want to connect ilxcli to a remote server that uses client authentication and a TLS certificate issued
by a valid certificate authority you could use options that look like:

```javascript
$ ilxcli --authtoken=e9aae15bad0532527f8222573bc4b77222d867c2 --serveraddr=/ip4/1.2.3.4/tpc/5001
```

### Config file

To avoid having to enter your configuration options for each command you can optionally put them into a config file.
By default, ilxcli will look for a config file named `ilxcli.conf` in the default application directory.

You can tell ilxcli to use a different config file directory by using:
```
$ ilxcli --configfile=/path/to/ilxcli.conf
```

Sample ilxcli.conf:
```
authtoken=e9aae15bad0532527f8222573bc4b77222d867c2
serveraddr=/ip4/1.2.3.4/tpc/5001
```

### Commands

```
Available commands:
  addpeer                     Attempts to connect to the provided peer
  blockpeer                   Blocks the given peer for the provided time period
  changewalletpassphrase      Changes the passphrase used to encrypt the wallet private keys
  createmultisigaddress       Generates a new multisig address using the provided public keys
  createmultisignature        Generates and returns a signature for use when proving a multisig transaction
  createmultisigspendkeypair  Generates a spend keypair for use in a multisig address
  createmultisigviewkeypair   Generates a view keypair for use in a multisig address
  createrawstaketransaction   Creates a new, unsigned (unproven) stake transaction using the given parameters
  createrawtransaction        Creates a new, unsigned (unproven) transaction using the given parameters
  deleteprivatekeys           Deletes the wallet's private keys and seed from disk
  getaccumulatorcheckpoint    Returns the accumulator at the requested height
  getaddress                  Returns the most recent address of the wallet
  getaddresses                Returns all the addresses created by this wallet
  getaddrinfo                 Returns info about the given address
  getbalance                  Returns the combined balance of all addresses in the wallet
  getblock                    Returns the detailed data for a block
  getblockchaininfo           Returns data about the blockchain
  getblockinfo                Returns a block header plus some extra metadata
  getblocksizesoftlimit       Returns the node's current blocksize soft limit
  getcompressedblock          Returns a block in compressed format
  gethostinfo                 Returns info about the libp2p host
  getmempool                  Returns all the transactions in the mempool
  getmempoolinfo              Returns the state of the current mempool
  getmerkleproof              Returns a Merkle (SPV) proof for a specific transaction in the provided block
  getminfeeperkilobyte        Returns the node's current minimum transaction fee
  getminstake                 Returns the node's current minimum stake policy
  getnetworkkey               Returns node's network private key
  getnewaddress               Generates a new address and returns it
  getpeers                    Returns a list of peers that this node is connected to
  getprivatekey               Returns the serialized spend and view keys for the given address
  gettimelockedaddress        Returns an address which locks coins until the provided timestamp
  gettransaction              Returns the transaction for the given transaction ID
  gettransactions             Returns the list of transactions for the wallet
  gettreasurywhitelist        Returns the current treasury whitelist for the node
  getutxos                    Returns a list of the wallet's current unspent transaction outputs (UTXOs)
  getvalidator                Returns all the information about the given validator
  getvalidatorset             Returns all the validators in the current validator set
  getvalidatorsetinfo         Returns information about the validator set
  getwalletseed               Returns the mnemonic seed for the wallet
  importaddress               Imports a watch address into the wallet
  proverawtransaction         Creates the zk-proof for the transaction
  recomputechainstate         Rebuilds the entire chain state from genesis
  reconsiderblock             Tries to reprocess the given block
  setautostakerewards         Automatically stakes validator rewards
  setblocksizesoftlimit       Sets the node's blocksize soft limit policy
  setloglevel                 Changes the logging level of the node
  setminfeeperkilobyte        Sets the node's fee policy
  setminstake                 Sets the node's minimum stake policy
  setwalletpassphrase         Encrypts the wallet for the first time
  signmessage                 Sign a message with the network key
  spend                       Sends coins from the wallet
  stake                       Stakes the selected wallet UTXOs and turns the node into a validator
  submittransaction           Validates a transaction and submits it to the network
  timelockcoins               Lock coins in a timelocked address
  unblockpeer                 Removes a peer from the block list
  updatetreasurywhitelist     Adds or removes a transaction from the treasury whitelist
  verifymessage               Verify a signed message
  walletlock                  Encrypts the wallet's private keys
  walletunlock                Decrypts the wallet seed and holds it in memory for the specified period of time
```

Example:

```
$ ilxcli getblockchaininfo

{
    "network":  "REGTEST",
    "bestHeight":  7,
    "bestBlockID":  "0007aafc24fd2d78e3a1529116c30b562edde76516bf3c87d83e1cea10437bf2",
    "blockTime":  "1686969557",
    "txIndex":  true,
    "ciculatingSupply":  "230584300921369395",
    "totalStaked":  "115292150460684697",
    "treasuryBalance":  "0"
}

```