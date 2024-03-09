---
sidebar_position: 2
---

# Libp2p

Illium uses libp2p for its networking stack. This means that much of the illium protocol is defined by the underlying 
libp2p protocol. 

You can find the technical specification for libp2p [here](https://github.com/libp2p/specs). Below we will document the
configuration settings illium uses for the libp2p networking stack.


## Host configuration

```go
// This is a wire encryption option. Illium uses the default security options
// which includes the Noise protocol as well as TLS.
libp2p.DefaultSecurity,

// Transports. TCP, QUIC, and an optional tor transport are supported.
libp2p.Transport(tcp.NewTCPTransport),
libp2p.Transport(quic.NewTransport),
libp2p.Transport(torTransport),

// Using the default stream multiplexer which is yamux.
libp2p.DefaultMuxers,

// Enables the circuit relay transport for peers behind
// a severe NAT. See AutoRelay below.
libp2p.EnableAutoRelayWithPeerSource(peerSource),

// This option runs a service for other peers that allows
// them to determine the status of their firewall. It will
// attempt to dial the requesting peer and report on the
// result.
libp2p.EnableNATService(),

// Enable the node to act as a relay if it discovers that we are
// publicly reachable.
libp2p.EnableRelayService(),

// Enables the relay transport. It allows the illium node
// to accept incoming conenctions through a relay and make
// outgoing connections to other peers through a relay.
libp2p.EnableRelay(),

// Allows the illium node to attempt to make direction connections
// to another peer by coordinating a hole punch over a relayed connection.
libp2p.EnableHolePunching(),

// Enables the ping protocol.
libp2p.Ping(true),
```

## Protocols

The following protocols are supported by the illium node. The /ilx/ protocols will be further defined in this documentation.

Network: `mainnet`, `testnet1`, or `regtest`
```
/ilx/<network>/chainservice/1.0.0
/ilx/<network>/consensus/1.0.0
/ilx/<network>/kad/1.0.0
/ilx/<network>/meshsub/1.1.0
/ipfs/id/1.0.0
/ipfs/id/push/1.0.0
/ipfs/ping/1.0.0
/libp2p/autonat/1.0.0
/libp2p/circuit/relay/0.2.0/hop
/libp2p/circuit/relay/0.2.0/stop
```

## DHT Configuration
Illium uses the libp2p kademlia DHT for peer and content routing but not the value store.

The DHT is initialized with:
```
dht.DisableValues()
dht.ProtocolPrefix(cfg.params.ProtocolPrefix),
```

Where protocol prefix is `/ilx/<network>` and `<network>` is either `mainnet`, `testnet`, or `regtest` depending on which
network is being used.

## AutoRelay Configuration

The auto-relay uses the DHT content routing to discover a list of peers capable of acting as a relay. When a node determines
that it is publicly reachable it advertises itself as a potential relay in the DHT. 

The DHT key used for the advertisement is:

```go
relayKey := "/ilx/relaypeers"
hash, _ := multihash.Sum([]byte(relayKey), multihash.SHA2_256, -1)
key := cid.NewCidV1(cid.Raw, hash)
```

## Pub-sub Configuration

Pub-sub is used for relaying transactions and blocks. The configuration options are:

```go
// We don't want to advertise who authored a transaction or block.
pubsub.WithNoAuthor(),

// Using the DHT for peer discovery.
pubsub.WithDiscovery(discovery.NewRoutingDiscovery(kdht)),

// Maxmessage size is a consensus parameter. This would cause a hardfork if you
// change it.
//
// Default: 8 MiB
pubsub.WithMaxMessageSize(cfg.maxMessageSize),

// hash.HashFunc is blake2s.
pubsub.WithMessageIdFn(func(pmsg *pb.Message) string {
    h := hash.HashFunc(pmsg.Data)
    return string(h[:])
}),

// Where the protocol prefix is /ilx/<network> and <network> is either mainnet, 
// testnet, or regtest depending on which network is being used.
pubsub.WithGossipSubProtocols([]protocol.ID{cfg.params.ProtocolPrefix + pubsub.GossipSubID_v11}, func(feature pubsub.GossipSubFeature, id protocol.ID) bool {
    if id == cfg.params.ProtocolPrefix+pubsub.GossipSubID_v11 && (feature == pubsub.GossipSubFeatureMesh || feature == pubsub.GossipSubFeaturePX) {
        return true
    }
    return false
}),
```

The subscription topics are:

```go
BlockTopic        = "blocks"
TransactionsTopic = "transactions"
```