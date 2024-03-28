---
sidebar_position: 5
---

# Lurk

In our previous discussion of zk-snarks we hand-waved over all the complexity. Historically, zk-snarks have been
extremely difficult to work with. The `Compile()` function we mentioned earlier typically requires users to rewrite
their function (called a circuit in zk-snark parlance) in a very low level mathematical representation. 
Something that isn't easy to do for complex functions.

Lurk is a new turing-complete programming language for zk-snarks developed by Lurk Labs that is intended to make 
the process of creating zk-snarks much easier. Lurk programs are written in a Lisp-like language (called Lurk) and 
executed on a "universal circuit" which is designed to be able to create a proof for any lurk program.

An example of a basic lurk program is below:
```javascript
(letrec ((next (lambda (a b n target)
                 (if (eq n target)
                     a
                     (next b
                           (+ a b)
                           (+ 1 n)
                           target))))
         (fib (next 0 1 0)))
        (fib 1))
```

In Illium we use lurk in two ways:

- **To validate transactions**: The illium protocol defines a lurk program used to prove the validity of all transactions.
All transactions contain a single zk-snark proof that is validated using this program.
- **To create custom locking scripts**: Users can use lurk (or any higher level language that compiles into lurk) to
create a custom locking script. Remember the hash of this script is ultimately included in the user's illium address.

One final point of note, since lurk is built on top of Microsoft's Nova it does *not* require a trusted setup like 
previous generations of zk-snarks. This increases the trust and security of the protocol beyond what was possible with previous
zk-snark systems.