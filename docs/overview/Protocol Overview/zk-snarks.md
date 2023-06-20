---
sidebar_position: 2
---

# zk-snarks

Before we can dive into the Illium protocol we need to get our heads around zk-snarks. Don't worry, while the math
behind zk-snarks is super difficult to understand, you don't need to know any math to get a high level overview of
what they are and what they do. 

In a nutshell zk-snarks are programmatic cryptographic proofs that allow us to prove just about any statement we desire. 

Consider something you're likely already familiar with:

## Digital Signatures

Digital signatures and zero-knowledge proofs are fundamental concepts in cryptography. In a digital signature scheme, a signer uses their private key to sign a message. Anyone can verify the signature against the signer's public key, ensuring the authenticity and integrity of the message.

On the other hand, a zero-knowledge proof allows a prover to demonstrate knowledge of a secret to a verifier, without revealing the secret itself.

Both of these concepts are critical for secure communication and transaction verification in a variety of applications.

In code we might make use of digital signatures as follows:

```go
privateKey, publicKey := GenerateKeyPair()

message := "hello world"

signature := Sign(privateKey, message)

valid := Verify(publicKey, message, signature)
```

Here the `Sign()` and `Verify()` functions are hiding all the complexity of the elliptic curve math behind the digital
signature but all you really need to know is what they do. 

Zk-snarks are just as easy to understand from this high level.

## Back to zk-snarks

Consider a function in code that looks like the following:

```go
func foobar(privateParams, publicParams) bool {
	// Some code here
}
```

In the above code block we have a function, which we're calling `foobar`, that takes in two sets of parameters, one
private and one public, and returns a boolean (either true or false). The body of our function could be anything we want
it to be. 

Once we define the function body, zk-snarks allow us
to prove that we know some combination of private and public parameters that make the function return `True` *without*
revealing the private parameters (we will reveal the public parameters).

In this sense we can create a zero-knowledge proof for just about any statement we can write in code. 

Let's see what this might look like in code:

```go
provingKey, verifyingKey := Compile(foobar)

proof := Prove(provingKey, privateParams, publicParams)

valid := Verify(verifyingKey, publicParams, proof)
```

In the first line we "compile" the `foobar` function and produce a keypair which is cryptographically linked to our
`foobar` function. When used in production both the prover and verifier would have prior agreement on the body of the
`foobar` function and could independently calculate the keypair.

In the second line the prover creates a proof using the `provingKey` and the private and public parameters. 

At this point the prover would share the `proof` and `publicParams` with the verifier. 

And finally, on line 3 the verifier would verify the proof using the `verifyingKey` and the `publicParams`.

That's all there is to it. See that wasn't so bad!

