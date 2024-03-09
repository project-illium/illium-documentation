---
sidebar_position: 3
---

# Output Commitments

## Bitcoin

If you recall Bitcoin has multiple types of addresses: pay-to-pubkeyhash, pay-to-scripthash, pay-to-witness-pubkeyhash, etc.

Let's focus on the pay-to-scripthash as this one most closely relates to Illium. 

In a pay-to-scripthash address the address is a serialized hash of a custom, user-defined, locking script. 

```go
scriptHash := hash160(lockingScript)
address := serialize(scriptHash)
```

You may also recall that Bitcoin transactions roughly look like the following (in JSON):

```json
{
  "inputs": [
    {
      "prev_hash": "4dd8bc776abd45aa9df7186966fa0733ad28aeab1bac0860d2316a051e65c6d2",
      "output_index": 1,
      "signatue_script": "47304402203b39d75ef932b9192b89dc2ba74e76611f552ef7167e74d55ef5e6822740a8140220063231351174d6c31ca15b7da1d8d60cc8f8a764fd578a9a11c1b564522c512b01210391adc032a6cd78870d5ec400bdecc031344e96364654f1cfedb34fdbd6afaea5",
    }
  ],
  "outputs": [
    {
      "amount": 378288,
      "script": "a914746558be018cbbedf9d46c6df960308d3e40541687"
    },
    {
      "amount": 3561267,
      "script": "a91492b2912c8931f36bc14bfc155450ab052bcef11887"
    }
  ]
}
```

Transactions can have multiple `inputs` and `outputs`. Each `input` points to an unspent transaction output (UTXO) from
some prior transaction in the chain. In this sense inputs could be said to *spend* outputs. Once an output has been spent
Bitcoin nodes mark it as spent and prevent future transactions from spending the *same* output.

Notice that in the `outputs` section each output declares the `script` the coins are being sent to. This is the same 
`scriptHash` we talked about above. Outputs also declare the `amount` of coins sent to this scriptHash. 
In Bitcoin these fields are unencrypted and are publicly visible to everyone.

## Illium

In Illium transactions also have outputs, but we hash the output data to prevent it from being publicly visible to anyone. 

For example, Illium transactions look like:

```json
{
  "outputs": [
    {
      "commitment": "2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892"
    },
    {
      "commitment": "0ed3599b1d2f6f03586491cfde627e77ffe1acab0d89ac9c35d738369e4f527d"
    }
  ]
}
```

The commitment hash is calculated as:

```go
commitment := hash(scriptHash, amount)
```

If you're quick on your feet you might notice a potential attack here. If you know someone's scriptHash you can try brute
forcing the scriptHash with every possible amount and checking to see if the corresponding hash exists in the chain. This
would de-anonymize the output. 

To combat this the sender of transaction generates a random number, which we call a `salt`, and concatenates the `salt` 
to the `scriptHash` and `amount`. This effectively randomizes the commitment and prevents the brute force attack.

```go
commitment := hash(scriptHash, amount, salt)
```

But if the outputs are hashed with a random salt, how does the recipient know the transaction is intended for them? 

## Illium Addresses

Like pay-to-scripthash Bitcoin addresses, Illium addresses also include a hash of a custom, user-defined locking script.
As we'll see later the "locking script" is actually a custom zk-snark function. The address also includes the user's 
"view" public key.

```go
scriptHash := hash(lockingScript)
address := serialize(scriptHash, viewPublicKey)
```

To answer the question about how does the recipient know if a transaction belongs to him, the sender of the transaction 
encrypts the output commitment preimage with the recipient's `viewPublicKey` found in the recipient's address and includes the ciphertext in the output.

```json
{
  "outputs": [
    {
      "commitment": "2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892",
      "ciphertext": "0d0f658174373e1ac6771ffc80864cfa8e31624d366aa5df1e55346ebc0bcd64eb44e9272f741a80e041e58dcc7b2bf45ba6847ebc3fbb29f0b6d659c4ed8aa46ea1a3fb0f3dd9d540b79c8e607cf79386e7541669aff59d8965339af31afb0c37013ade50fa8f4bb7192fabf91b86a38103f1930ea8635c6f8011646b4faa41"
    },
    {
      "commitment": "0ed3599b1d2f6f03586491cfde627e77ffe1acab0d89ac9c35d738369e4f527d",
      "ciphertext": "af57fa9e01ce6febc163309be1f30b437a2ab25adfa68d664412ef5e1b4897a1c50c4c5136446f5b53b038e7ee150385878c7ac2fd0c18ae657a3e387deaf36c630930c28aa50e0852009b99cded71e3e981112e4965e7f058bab4edd45901ef664c520611137944379dbf751d336582a0498b6fba77768bddad1c96f2f69261"
    }
  ]
}
```

The recipient can then try to decrypt each output ciphertext in the blockchain using his `viewPrivateKey` and if the ciphertext decrypts
successfully, the transaction is his. 
