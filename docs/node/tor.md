---
sidebar_position: 7
---

# Using Tor

Ilxd can be configured to run over Tor to protect your IP address and increase network layer privacy.

To use tor you'll need to have tor installed on your system and provide the path to the tor binary as a config option.

```
$ ilxd --torbinary=/path/to/tor
```

Optionally, you can put this in your ilxd.conf:
```
torbinary=/path/to/tor
```

Ilxd will start tor automatically on startup and manage its lifecycle, including shutting it down when ilxd is shut down. 

All outgoing connections get proxied through tor, and it sets up a hidden service to accept incoming
connections as well.

If you want to manually set additional configuration options for tor you can do so by pointing it at
a custom `torrc` file.

```
$ ilxd --torrcfile=/path/to/torrc
```

### Dual Stack Mode

Your node can be configured to make connections through both tor AND the clear internet. In this way you act as a bridge
between both networks. Dual stack mode is obviously *NOT* private and your IP will be visible.

```
$ ilxd --torbinary=/path/to/tor --tordualstack
```

### Validating with Tor

Generally speaking it's not recommended that you use Tor when running a validator node. The reason for this is that validators
and users not running tor may not be able to connect to you (there is relaying functionality, but it's a best effort service). 

To the extent that other validators have trouble connecting to you, it could cause to get marked
as having poor uptime resulting in a loss of your coinbase rewards. 

You also will likely have a much slower internet connection which could result in most of your consensus query responses lagging
behind non-tor validators which results in you having less say in consensus.

Finally, if your responses are slow it could ultimately result in other validators making more queries than necessary to finalize 
transactions which could slow finalization time.