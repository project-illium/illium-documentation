---
slug: /api
sidebar_position: 1
description: Illium API overview
---

# Overview

Ilxd offers a full-featured gRPC API which can be used to control the running full node, interact with the internal
wallet, act as a high-powered blockchain server, and even act as an indexed wallet server for lite wallets. 

### Running the rpc server
By default, ilxd will start the blockchain service, node service, and wallet service and only accept connections from
localhost.

If you want to except external connections you will need to use the `grpclisten` command line option:

```
ilxd --grpclisten=/ip4/0.0.0.0/tcp/5001
```

Optionally, you can also put this in the ilxd config file:

ilxd.conf:
```
grpclisten=/ip4/0.0.0.0/tcp/5001
```

If you want to disable the node service, wallet service, or wallet server service you can do so again with either a command line option:

```
--disablenodeservice
--disablewalletservice
--disablewalletserverservice
```

Or a config option:
```
disablenodeservice=1
disablewalletservice=1
disablewalletserverservice=1
```

The wallet server service requires the node to be run with the `--wsindex` option. If this index is not used the wallet
server service will be disabled by default.

To enable the proving service:

```
--enableproverservice
```

### TLS

Grpc requires the use of TLS for all RPCs. On first startup, ilxd will generate a self-signed certificate and put it in the 
application directory. 

On linux the default is:
```
$HOME/.ilxd/rpc.cert
```

By default this certificate is used by the gRPC server. If for some reason you wish to generate a new certificate you can
simply delete the `rpc.cert` and `rpc.key` files and it will generate new ones on next startup.

***NOTE***: If a server using a self-signed certificate is running on a different machine from the client(s) the server's
external IP address will need to be in the certificate for it to work. To tell ilxd to generate the certificate using your
external IP address use the following option on first startup or when generating a new certificate:

```
--externalIP=<your_ip_address>
```

To connect to a server using a self-signed certificate all clients will need to be in possession of the `rpc.cert` and
use it in the client configuration. 

For example, in Go:
```go
certificateFile := filepath.Join(repo.AppDataDir("ilxd", false), "rpc.cert")
creds, err := credentials.NewClientTLSFromFile(certificateFile, "localhost")
if err != nil {
    fmt.Println(err)
    return
}
tlsOption := grpc.WithTransportCredentials(creds)
```

If you have a valid TLS certificate signed by a certificate authority you may use it and avoid the need to distribute
the certificate to clients. 

To configure ilxd to use your certificate use the following options:
```
--rpccert=/path/to/rcp.cert
--rpckey=/parth/to/rpc.key
```

Clients can then be configured as follows:

```go
tlsOption := gprc.WithTransportCredentials(credentials.NewClientTLSFromCert(nil, "")
```

### Client Authentication

Clients are not authenticated by default. You can require client authentication by setting an authentication key on ilxd
either as a command line option:

```
--grpcauthtoken=<long_random_authentication_token>
```

Or in the config file:
````
grpcauthtoken=<long_random_authentication_token>
````

Clients then need to include the authentication token is the RPC request context:

For example, in Go:

```go
md := metadata.Pairs("AuthenticationToken", "long_random_authentication_token")
ctx := metadata.NewOutgoingContext(context.Background(), md)

// Make the RPC
response, err := client.SomeRPC(ctx, someRequest)
```

### gRPC Web
Ilxd multiplexes gRPC Web over the same endpoint as standard gRPC so that the server can also be queried from web browsers.