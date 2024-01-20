---
sidebar_position: 4
description: Examples of basic scripts
---

# Locktime

In this section we're going to talk about how time is used in illium transactions. 

In a perfect world the timestamp of the block containing the transaction would be passed in to the unlocking script as a
parameter. The problem here we often need to validate transactions twice ― once when they enter the mempool and again when 
they enter a block and we simply don't know the block timestamp at the point when the transaction enters the mempool. 

Other blockchains get around this problem by just not validating transactions when they enter the mempool, instead relying
on gas to prevent flooding. But one of the benefits of illium is we don't have gas fees! So we can't use that approach
here.

The approach we use is to hard-code a timestamp into a transaction along with a `precision` field. The network then 
adopts a consensus rule that in order to be included in a block, a transaction's timestamp must be within `precision` seconds
of the block's timestamp.

```protobuf
message StandardTransaction {
    repeated Output outputs =   1;
    repeated bytes nullifiers = 2;
    bytes txo_root            = 3;
    Locktime locktime         = 4;
    uint64 fee                = 5;
    bytes proof               = 6;
}

message Locktime {
    int64 timestamp   = 1;
    int64 precision = 2;
}
```

Using this approach, scripts can be sure that the transaction's timestamp is within `precision` seconds of the block's 
timestamp and can enforce their desired level of precision. This allows scripts to make time based decisions.

For example, the timelock script mentioned earlier:
```
locking-params = (<lock-until-timestamp> <pubkey>)
unlocking-params = (<signature>)
```

```lisp
(lambda (locking-params unlocking-params input-index private-params public-params)
        !(import std/crypto/checksig)
        !(assert (<= !(param locktime-precision) 120))
        !(assert (> !(param locktime) (car locking-params))
        !(assert (checksig unlocking-params (cdr locking-params) !(param sighash)))
        t
)
```

## Relative Locktime

Sometimes you want your script to take an action if a certain amount of time has passed since the last transaction. 

This can be done in illium scripts by encoding the current timestamp into the state field, then having the subsequent
transaction read this timestamp from the input state and compare its own timestamp.

```
locking-params = (<relative-timelock> <pubkey>)
unlocking-params = (<signature>)
```

```lisp
(lambda (locking-params unlocking-params input-index private-params public-params)
        !(assert (<= !(param locktime-precision) 120))
        !(assert (> !(param locktime) (+ (car locking-params) !(param priv-in input-index state))))
        !(assert (checksig unlocking-params (cdr locking-params) !(param sighash)))
        t
)
```

Note: the above examples assumes the input state is the previous transaction's locktime. This script (or another script) 
would likely need to enforce that state was set correctly to make this secure. 