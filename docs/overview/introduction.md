---
slug: /
sidebar_position: 1
description: Welcome to the illium protocol overview!
---

# Introduction

In this guide we will provide a comprehensive overview of the Illium protocol. Trying to understand
protocols built on top of zk-snarks may seem like a daunting task, but we're going to make it dirt simple. 
If you have a decent understanding of the Bitcoin protocol there's no reason you can't also understand Illium.

In fact,  in this guide we're going to reference Bitcoin quite a bit to as many of the concepts are similar. Where
they are different we will make sure to point it out. 

But first...

## What is Illium?

Illium is a new cryptocurrency that makes use of bleeding edge cryptography to enable zero-knowledge coin transfers,
tokens, and smart contracts. In practical terms this means that all transactions are encrypted in such a way that only
the sender and recipient can decrypt the transaction and view the contents. Not only are the transactions encrypted, but 
it's not possible to distinguish between ordinary transfers, token transfers, and more complex smart contracts as all transactions look the same on the blockchain.

Consider the history of major breakthroughs in cryptocurrencies:

- Bitcoin proved that it's possible to build a fully decentralized currency. Unfortunately transactions are fully
public and trivial to trace. It also offered limited ability to create programmable contracts.
- Ethereum one upped Bitcoin by introducing fully programmable smart contracts. 
- Zcash improved on both by making use of zk-snarks to encrypt tranasctions and improve privacy. Unfortunately Zcash's shielded transactions only work for basic transfers. 
- Illium extends the use of zk-snarks to full blown smart contracts making all transactions fully private.

It should be noted that while transactions are completely private, users can still choose to share private data with third parties if they have a need to. And the sharing of private 
data need not be an all-or-nothing proposition whereby the person you share the data with necessarily sees everything. Instead it's possible to
make use of the Illium's zk-snark functionality to selectively share only the parts of a transaction or 
contract that are relevant, while keeping everything else private. 

Additionally, Illium makes use of novel improvements to the avalanche consensus algorithm to offer nearly instantaneous transaction finalization. 
