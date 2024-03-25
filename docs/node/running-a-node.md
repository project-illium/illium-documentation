---
slug: /node
sidebar_position: 1
description: Running a node
---

# Running a node

To start running an illum full node first head over to the [downloads page](https://github.com/project-illium/ilxd/releases) 
and download the binaries for your operating system.

The download will be a .zip file that contains two executables:

- `ilxd`: The illium full node application
- `ilxcli`: A command line interface to interact with a running instance of ilxd

To start the node with default options run the following command in the terminal:
```
$ ./ilxd
```

To see a list of runtime option use:

```
$ ./ilxd --help
```

```
Usage:
  ilxd [OPTIONS]

Node Options:
  -v, --version                     Display version information and exit
  -C, --configfile=                 Path to configuration file
  -d, --datadir=                    Directory to store data
      --logdir=                     Directory to log output
      --walletdir=                  Directory to store wallet data
  -l, --loglevel=                   Set the logging level [trace, debug, info,
                                    warning, error, fatal]. (default: info)
      --debug                       Enable libp2p debug logging to the terminal
      --seedaddr=                   Override the default seed addresses with
                                    the provided values
      --listenaddr=                 Override the default listen addresses with
                                    the provided values
  -t, --testnet                     Use the test network
      --alpha                       Use the alpha network
  -r, --regtest                     Use regression testing mode
      --regtestval                  Set self as the regtest genesis validator.
                                    This can only be done on first startup.
      --noupnp                      Disable use of upnp
      --useragent=                  A custom user agent to advertise to the
                                    network
      --notxindex                   Disable the transaction index
      --droptxindex                 Delete the tx index from the database
      --wsindex                     Enable the wallet server index to serve
                                    lite wallets
      --dropwsindex                 Delete the wallet server index from the
                                    database
      --addrindex                   Enable the address index
      --dropaddrindex               Delete the address index from the database                            
      --maxbanscore=                The maximum ban score a peer is allowed to
                                    have before getting banned (default: 100)
      --banduration=                The duration for which banned peers are
                                    banned for (default: 24h)
      --walletseed=                 A mnemonic seed to initialize the node
                                    with. This can only be used on first
                                    startup.
      --coinbaseaddr=               An optional address to send all coinbase
                                    rewards to. If this option is not used the
                                    wallet will automatically select an
                                    internal address.
      --networkkey=                 A network key to use for this node. This
                                    will override the node's peer ID.
      --prune                       Delete the blockchain from disk. The node
                                    will store just the date needed to validate
                                    new blocks.
      --mock                        Set the node to use mock proofs instead of
                                    full proofs. This option is only available
                                    for regtest.
      --checkpoint=                 Set a custom block checkpoint. Proof validation
                                    will be skipped up to this block. Formatted
                                    as a json string {'blockID': 'hex',
                                    'height': uint32}

Policy:
      --minfeeperkilobyte=          The minimum fee per kilobyte that the node
                                    will accept in the mempool and generated
                                    blocks
      --minstake=                   The minimum stake required to accept a
                                    stake tx into the mempool or a generated
                                    block
      --treasurywhitelist=          Allow these treasury txids into the mempool
                                    and generated blocks
      --blocksizesoftlimit=         The maximum size block this node will
                                    generate
      --maxmessagesize=             The maximum size of a network message. This
                                    is a hard limit. Setting this value
                                    different than all other nodes could fork
                                    you off the network.

RPC Options:
      --rpccert=                    A path to the SSL certificate to use with
                                    gRPC
      --rpckey=                     A path to the SSL key to use with gRPC
      --externalip=                 This option should be used to specify the
                                    external IP address if using the
                                    auto-generated SSL certificate.
      --grpclisten=                 Add an interface/port to listen for
                                    experimental gRPC connections in multiaddr
                                    format (default:/ip4/127.0.0.1/tcp/5001)
      --grpcauthtoken=              Set a token here if you want to enable
                                    client authentication with gRPC.
      --disablenodeservice          Disable the node RPC service. This option
                                    should be used if running a public
                                    blockchain or wallet server.
      --disablewalletservice        Disable the wallet RPC service. This option
                                    should be used if running a public
                                    blockchain or wallet server.
      --disablewalletserverservice  Disable the wallet server RPC service. This
                                    will automatically be disable if wsindex is
                                    disabled.

Tor Options:
      --torbinary=                  A path to the Tor binary. If this is
                                    provided the server will start tor
                                    automatically and shut it down on close.
                                    All incoming and outgoing connections will
                                    be routed through Tor.
      --torrcfile=                  A path to a custom torrc file if you want
                                    to configure tor with your own settings.
      --tordualstack                This option tells ilxd to accept
                                    connections over Tor AND over the clear
                                    internet. Clear TCP connections will be
                                    prioritized. This mode is NOT private.

Help Options:
  -h, --help                        Show this help message
```