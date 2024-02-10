---
sidebar_position: 8
description: Lurk language overview
---

# Lurk

All scripts are written in a language called Lurk. For a full technical documentation we'll point you some external
resources:

- [The Lurk Circuit Specification](https://blog.lurk-lang.org/posts/circuit-spec/)
- [The Lurk User Manual](https://github.com/lurk-lab/user-manual)

## Lurk is Lisp
Lurk is a dialect of Lisp and has a lot of commonalities with other Lisp dialects. Here we're going to cover everything
you need to write illium scripts in Lurk.

### Literals

Literals are self-evaluating expressions. They include:

- `num`: a signed integer. Ex) 1 2 3, etc
- `u64`: 64 bit unsigned integers
- `char`: A character
- `comm`: Represents a cryptographic commitment
- `nil`: Represents a nil value or false
- `t`: Represents true

### Finite Fields

The underlying cryptography of Lurk makes use of finite fields. As such the largest number that can be represented by a `num`
is 

```
0x40000000000000000000000000000000224698fc0994a8dd8c46eb2100000001
```

All arithmetic operations are conducted modulo this number. If your script relies on arithmetic operation performed on
large numbers you'll need to take this into account. 

The range of possible values for num looks like:

```
|-------------------------||--------------------------|
0            most-positive┘└most-negative      largest-unsigned
```

### Expressions

Expressions represent a piece of code or computation and usually (though not always) evaluate to a literal. 

### Arithmetic Expressions

#### Addition
```lisp
(+ 3 5)
```
Evaluates to: `8`

#### Subtraction
```lisp
(- 3 5)
```
Evaluates to: `-2`

#### Multiplication
```lisp
(* 3 5)
```
Evaluates to: `15`

#### Division
```lisp
(/ 15 5)
```
Evaluates to: `3`

#### Equals
```lisp
(= 7 7)
```
Evaluates to: `t`

#### Less than
```lisp
(< 8 7)
```
Evaluates to: `nil`

#### Greater than
```lisp
(> 8 7)
```
Evaluates to: `t`

#### Less than or equals
```lisp
(<= 8 7)
```
Evaluates to: `nil`

#### Greater than or equals
```lisp
(>= 8 7)
```
Evaluates to: `t`

### Creating Variables

To create and assign variables you need to do so inside of a let expression. The let expression takes the form:

```
(let <list of bindings> <expression>)
```

Let's see what this looks like:
```lisp
(let ((x 3) (y 5)) (+ x y))
```
Evaluates to: `8`

Take note of a couple things. First, the first argument is a `list` of multiple variable assignments. Even if you 
only intend to assign one variable, you still need to wrap the bindings in an extra parentheses. 

```lisp
(let ((x 3)) x)
```
Evaluates to: `3`

Second, the last argument to the let expression is an expression which makes use of the variables. The variables defined
inside a let expression are only in scope for that expression and cannot be used outside of it. So typically you will
make use of the variables in the inner expression. 

Let expressions can be nested and the variables in the outer expression are in scope for the inner expression:
```lisp
(let ((x 3) (y 5))
     (let ((z 10))
          (* x z)))
```
Evaluates to: `30`

When assigning new variables we can make use of variables defined earlier in the same let expression:
```lisp
(let ((x 3) 
      (y (+ x 20)))
      y)
```
Evaluates to: `23`

Later variables can shadow earlier ones:
```lisp
(let ((a 1)
      (a 2))
  a)
```
Evaluates to: `2`

And inner variables can shadow outer ones:
```lisp
(let ((a 1))
  (let ((a 2)) a))
```
Evaluates to: `2`

### Functions

Functions in lurk take the form of:
```
(lambda <list of arguments> <body>)
```

Example:
```lisp
(lambda (x) (+ x 1))
```
Evaluates to: `function`

To call a function you need to create a `list` (more on lists later) where the first element in the list is a function
and the remaining elements are the function parameters.

```lisp
((lambda (x) (+ x 1)) 5)
```
Evaluates to: `6`

Typically, you'll want to assign the function to a variable:
```lisp
(let ((my-func (lambda (x) 
                    (+ x 1))))
     (my-func 10))    
```
Evaluates to: `11`

Functions can have multiple arguments:
```lisp 
((lambda (x y) (+ x y)) 3 5)
```
Evaluates to: `8`

We can define recursive functions to execute loops but to do so we need to define them inside a `letrec` expression
instead of a regular `let` expression:
```lisp
(letrec ((sum-upto (lambda (n) (if (= n 0)
                                   0
                                   (+ n (sum-upto (- n 1)))))))
  (sum-upto 5))
```
Evaluates to: `15`

Functions can receive other functions as inputs or emit functions as outputs:
```lisp
(letrec ((map (lambda (f list)
                (if (eq list nil)
                    nil
                    (cons (f (car list))
                          (map f (cdr list))))))
         (square (lambda (x) (* x x))))
  (map square '(1 2 3 4 5)))
```
Evaluates to: `(1 4 9 16 25)`

### Cons

Cons cells are containers that hold two variables. They are created as follows:

```lisp
(cons 1 2)
```
Evaluates to: `(1 . 2)`

(Note the . above is just notation to show this is a cons cell)

Variables inside a cons cell can be accessed using the built-in `car` and `cdr` functions. 

- `car`: returns the first element of the cons cell (The cons cell remains unchanged; This is not a "pop" operation).
- `cdr`: returns the last element of a cons cell.

```lisp
(let ((x (cons 1 2)))
     (car x))
```
Evaluates to: `1`

```lisp
(let ((x (cons 1 2)))
     (cdr x))
```
Evaluates to: `2`

Cons cells can be nested:

```lisp
(cons 1 (cons 2 (cons 3 4)))
```
Evaluates to: `(1 2 3 . 4)`

When you have a nested cons data structure, the `cdr` function returns a `list` of all the remaining nested elements.

```lisp
(let ((x (cons 1 (cons 2 (cons 3 4)))))
     (cdr x))
```
Evaluates to: `(2 3 . 4)`

### Lists

We've already seen above that lists look like this:

```
(x y z)
```

However, we also mentioned above that lurk treats the first element in a list as a `function` and tries to execute it.
In the above list, lurk would try to execute `x` as a function. If it was not a function, the script would error.

So how can we create a list in which the first element is not treated as a function?

We create a nested cons structure, where the *last* element of the last cons cell is `nil`. 

For example:

```lisp
(cons 1 (cons 2 (cons 3 nil)))
```
Evaluates to: `(1 2 3)`

Note there is a shorthand way of creating a list using the `quote` operator.

```lisp
(quote (1 2 3))
```
Evaluates to: `(1 2 3)`

Or, even shorter:

```lisp
'(1 2 3)
```
Evaluates to: `(1 2 3)`

However, be careful to avoid a pitfall here. The `quote` operation will **not** evaluate any expression contained 
within the list.

Notice the following does *not* evaluate to `(1 2 7)`.
```lisp
'(1 2 (+ 3 4))
```
Evaluates to: `(1 2 (+ 3 4))` (essentially the raw data)

If you want to make it evaluate the inner expression you can do:

```lisp
(eval (car (cdr (cdr '(1 2 (+ 3 4))))))
```
Evaluates to: `7`

Or just build out the list using the cons/nil format defined above.

### Strings

```lisp
(let ((x "hello"))
      x)
```
Evaluates to `"hello"`

The `car` of a string returns a `char`:
```lisp
(let ((x "hello"))
      (car x))
```
Evaluates to `'h'`

A char can be prepended to a string with `strcons`:
```lisp
(strcons 'h' "ello")
```
Evaluates to `"hello"`

Notice the single quotes for a char and double quotes for a string.

A list of `chars` built with `strcons` returns a string:
```list
(strcons 'h' (strcons 'e' (strcons 'l' (strcons 'l' (strcons 'o' "")))))
```
Evaluates to `"hello"`

### If, Then, Else

If expressions take the form:

```lisp
(if <condition> <then_expression> <else_expression>)
```

Example:
```lisp
(if (= 4 (+ 2 2))
    t
    (+ 9 7))
```
Evaluates to: `t`

Non-nil expressions are treated as True in the conditional

```lisp
(let ((x 3))
     (if x
         t
         nil
     )
)
```
Evaluates to: `t`

Finally, where `=` tests the equality between integers, the `eq` function tests the equality between expressions:
```lisp
(if (eq (cons 1 2) (cons 1 2))
    t
    (+ 9 7))
```
Evaluates to: `t`

### Hashing

Lurk has a builtin hash function which can hash any expression. This function uses the poseidon hashing algorithm.

```lisp
(commit 5)
```
Evaluates to `(comm 0x06332145e67677b767270ae6f73dd9c104cb50d70452f65e78081113ccff1b8e)`

Notice the output is type `comm` not `num`.

If you want to check the equality you'll need to cast the output to a `num` or cast your `num`
to a type `comm`

```lisp
(= (num (commit 5)) 0x06332145e67677b767270ae6f73dd9c104cb50d70452f65e78081113ccff1b8e)
```
Evaluates to `t`

You can hash any expression:
```lisp
(commit (cons 1 (cons 2 (cons 3 nil))))
```
Evaluates to `(comm 0x2b86ff9e0f5845c44096867b82bc9ceb92572b978e62905181d644da4402fba5)`

### Illium Locking Functions

As we've already seen illium unlocking functions are `lambda` expressions. The entire expression must evaluate
to a `function` and the body of the function **must** evaluate to either True or False (t or nil). Remember that *any*
non-nil return value will be treated at True.

Returns True
```lisp
(lambda (locking-params unlocking-params input-index private-params public-params)
    t
)
```

Also is True
```lisp
(lambda (locking-params unlocking-params input-index private-params public-params)
    7
)
```

Also is True
```lisp
(lambda (locking-params unlocking-params input-index private-params public-params)
    (cons 1 2)
)
```

Returns False
```lisp
(lambda (locking-params unlocking-params input-index private-params public-params)
    nil
)
```