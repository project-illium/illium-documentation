---
sidebar_position: 8
---

# Block Relay

Illium uses a block compression protocol called Xthinner when relaying blocks to minimize network bandwidth usage.

### CTOR

There is a consensus rule for blocks that require transactions in a block to be sorted by transaction ID (lowest to highest).
This rule allows us to compute the bare minimum amount of txid bytes needed to disambiguate a block txid from other txids
in our mempool.

### XThinner Spec

Ultimately we'll refer you to the Xthinner [code](https://github.com/project-illium/ilxd/blob/master/mempool/xthinner.go) for
the implementation details. But we will copy a high level overview written by Jonathan Toomim here:

***(a) Encoding***

For encoding, we use a stack-based state machine that follows a three-stage cycle. At the end of each cycle, the bytes on the stack represent enough of the TXID’s initial bytes in order to be able to uniquely identify that TXID in mempool. At the start of each cycle, we’re left with the initial bytes for the previous transaction. Our three stages are as follows:

1. We can pop 1 or more bytes off the stack as necessary to disambiguate from the previous block transaction.
2. We can push 1 or more bytes onto the stack as necessary to disambiguate from neighboring mempool transactions.
3. We commit to a transaction using the prefix encoded on the stack.

We will always need to pop and push at least 1 byte per transaction; otherwise, encoding ambiguities would result. Each pop or push after the first can be encoded as a 1-bit command, where a `0` indicates that we’re ready to move onto the next stage of the state machine and a `1` indicates that we still need to do at least one more pop or push in the current stage. Let’s go through an example. Let’s say the following list of hashes are the TXIDs in our mempool, where the bolded TXIDs are the ones in our block:


>00011aad25656886a26599ec50d2356a09fbc0bf7b31625635112d4407be47f7
0001f62a39b2e11ab1944d2deae329c142cda52b678da21c53d821d609af8555
00023f9d3909138f56a5b7ea8d8e93868f44035a48a9de5d7a156facceff4c18
00026251be10dc0c2c6db58c767f7c733f04dd0ca98cd58e6692ac9ed0a7a635
**000287fcf35fd7158f76478c57fcf38018bb9c9e7fd0710ae23a3943501bc29e**
00036f7da3c5f8972be8ec4ccd40741fb2fe11c19c97bcd92806377877266823
**000437444d7882fe565f45af0135eaf8fe899a90b3864f16233e077fd0545de1**
0004418502e0b7ca6be66dbfb22b1d44b8d130e4881273244175d2b31c87ef6a
**000443e44278f21fd9c6b36074c3b69e127826e622b077952a418bb025a38099**
**00047864535649e341b433f5b5046742889b19f032163dd2c828000dfeeabdd8**
**00047ff913facd948fbac75f6834f0594f333cf0d798513c044b888f78bc3cfc**
**0004bc10acad694635899c094a9265e21ce4ba2941c093859b2d30de6b942246**
**00054c9111edeab8dbc5cdb0911efbcf13291d7388d2898d05017abe2f6c1ecf**
00057a5224fcc5b7b88230e6345053bf8b5616d851551d9127a20eaa5f9d319d
**00064091bb8f250943a8eaa69cd0fa1b83b57a30d96b71ea319a085aabb81d8e**
00064d71e4f0c3aac3338069e020b699a3d693f800cb7d622e5b3c0f16829533
**0007ed917e16035ec722d30eefd849c2a25580d5873131346b9321222caf8761**
0007edd6bf4dd7981639b7ec3ba29671010eb8b34056d265db44395cb5f33282
**000811bab64454e8dc3802753a6430ee79142d5b0e4fb7a9ce17534c17ca3ccb**
00081cfcab0c75a3e25c6166451792ed3c7cdaf3ab839b9bdc2978f7fc54e263

Our state machine starts with an empty stack.

1.1 (Round 1 stage 1) We don’t need to pop off any bytes to disambiguate from the previous transaction (because there was none), so we encode a `0` into our state machine pop command list. `pops.extend([0])`.

1.2 Our transaction needs `00 02 87` to disambiguate it from its neighbors, and our stack currently empty, so we need to push a total of three bytes onto the stack. `pushbytes.extend([0x00, 0x02, 0x87])` The first push is always needed, so we only need to add two 1 values to our push command list. `pushes.extend([1, 1, 0])`

1.3 Our stack is now `00 02 87`. That’s enough information to uniquely identify this transaction as long as the recipient of this message has that transaction in their mempool and does not have a conflicting transaction with the same prefix.

1.4 We’ll talk about the checksumming later.

2.1 We have `00 02 87` on our stack, and our next transaction begins with `00 04 37`, so we need to pop off two bytes. The first pop is automatic, so we need to tell our state machine to pop a second byte before going to the next stage. `pops.extend([1, 0])`

2.2 We now have `00` on our stack. We need `00 04 37` to disambiguate from the mempool transaction beginning with `00 04 41`, so we push two bytes: `pushbytes.extend([0x04, 0x37])`. The first push is automatic, so we only need to tell our state machine about the second push before switching to the next tx. `pushes.extend([1, 0])`

2.3 This leaves `00 04 37` on our stack to uniquely identify our transaction.

3.1 Our next tx begins with `00 04 43`. Only the last byte differs from our stack value, and that pop happens automatically, so we tell our state machine to perform no additional pops. `pops.extend([0])`

3.2 We now have `00 04` on our stack. We need one more byte `43` to disambiguate from the nearest mempool neighbor, `00 04 41`, so we only need our one automatic push for that. `pushbytes.extend([0x43])`, `pushes.extend([0])`.

3.3 This leaves `00 04 43` on our stack to uniquely identify our transaction.

And so on.

**(b) Decoding**

Our encoded data for the first three transactions from part (a) was this:

```
pops      = [0, 1, 0, 0]
pushes    = [1, 1, 0, 1, 0, 0]
pushbytes = [0x00, 0x02, 0x87, 0x04, 0x37, 0x43]
```

To decode, we run our state machine with that data.

1.1 Our stack is empty to start with. We can’t do our automatic first pop, so we skip that step. The next bit in our pop command list is 0, so we do not do any additional pops. Our stack remains empty.

1.2 We do an automatic push of `00`. Our pushes list has two `1` values followed by a `0`, so we do two additional pushes of `02 87` to finish this stage.

1.3 Our stack is now `00 02 87`. We check our mempool for transactions beginning with those bytes, and hopefully only find one such transaction, which we append to our block.

2.1 The next two values in our pops list are `1`, `0`, so we do our automatic pop plus one more, leaving us with only `00` on our stack.

2.2 Our next values in pushes are `1`, `0`, so we do our automatic push plus one more. This pushes `04 37` onto our existing `00`.

2.3 We now have `00 04 37` on our stack. We check our mempool for transactions beginning with those bytes, and hopefully only find one such transaction, which we append to our block.

3.1 The next value in our pops list is `0`, so we only do our automatic pop, leaving us with `00 04` on our stack.

3.2 The next value in our pushes list is `0`, so we only do our automatic push. Our next value in pushbytes is `43`, so we push that onto our stack.

3.3 We now have `00 04 43` on our stack. We check our mempool for transactions beginning with those bytes, and hopefully only find one such transaction, which we append to our block.


### Checksums
The Xthinner spec calls for the XthinnerBlock to have a checksum attached that can be used to detect collisions. 
However, in illium blocks come quickly and typically have few transactions. With such a small number of transactions 
collisions are less likely. In the event a collision happens the validation of the txRoot will fail and we will just 
request the full list of block txids from the relaying peer.

If checksums were included we could use them to narrow down the range in block where the collision occurred and just 
request a smaller range of txids from our peer instead of the full list. This would save bandwidth. However, for it to 
be worth it the bandwidth savings needs to exceed the extra bandwidth cost of the checksums. At small block sizes this isn't
worth it. So we omit the checksums.

### Errors
There are two possible decode failures:
1. There are no transactions in the mempool with the given prefix (missing tx).
2. There are one or more transactions in the mempool with the same prefix (collision).

In these cases the caller should request the missing transaction(s) from the remote peer before proceeding
to block validation.

The final failure case is the block's tx merkle root may fail to validate. This could
mean one of two things:
1. We had a transaction in the mempool that collided with a transaction in the block,
but the block's transaction was not in the mempool. This is very unlikely but possible.
2. The peer maliciously sent us an invalid block.

In both cases the solution is to download the full list of txids from the remote peer.