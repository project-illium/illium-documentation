---
sidebar_position: 9
description: Marco extensions
---

# Macros

Lurk syntax can be difficult for read and write at times. Especially inside a lambda function where complex code often
requires many levels of nested expression. 

For this reason it's common for Lisp dialects to define a number of `macros` that simplify the syntax and improve readability.

Ilxd offers a list of macros for this purpose. It should be noted that the following macros are **NOT** part of the
Lurk language. Rather ilxd has a `PreProcessor` class that parses lurk code and expands the macros into pure lurk code.

When you commit to an unlocking function in illium, that function will always be pure lurk. If your code contains macros
it will essentially be compiled into pure lurk before the commitment is made.

## Nesting

The macros defined here make it so that you can avoid the pattern of using many levels of nested expressions. Instead, the
macro preprocessor will handle the nesting when the macros are expanded into pure lurk. This is true even when multiple
macros are used  in succession and there are a number of levels of nesting.

For example:
```lisp
!(def x 3)
!(def y 4)

(+ x y)
```

Macro expands into:
```lisp
(let ((x 3))
     (let ((y 4))
          (+ x y)
     )
)
```
Evaluates to: `7`

You just need to make sure your unlocking function still returns `t` or `nil` as the last expression. 

## Macro Definitions

### Def

```lisp
!(def x 3)
<expression>
```

Macro expands to:
```lisp
(let ((x 3))
    <expression>
)
```

### Defrec

```lisp
!(defrec x 3)
<expression>
```

Macro expands to:
```lisp
(letrec ((x 3))
    <expression>
)
```

### Defun

```lisp
!(defun foo (x) (+ x 3))
<expression>
```

Macro expands to:
```lisp
(letrec ((foo (lambda (x) (+ x 3))))
        <expression>
)
```

### Assert
```lisp
!(assert (= 5 5))
<expression>
```
Macro expands to:
```lisp
(if (eq (= 5 5) nil)
     nil
     <expression>
)
```

### Assert-eq
```lisp
!(assert (cons 1 2) (cons 1 2))
<expression>
```
Macro expands to:
```lisp
(if (eq (eq (cons 1 2) (cons 1 2)) nil)
     nil
     <expression>
)
```

### List

```lisp
!(list 1 2 3 4)
```

Macro expands to:
```lisp
(cons 1 (cons 2 (cons 3 (cons 4 nil))))
```

### Param

The param macro serves as a helpful shortcut for accessing the parameters of the unlocking function. It has multiple 
forms:

```lisp
!(param txo-root)                                     ;;expands to: (nth 1 public-params)
!(param fee)                                          ;;expands to: (nth 2 public-params)
!(param coinbase)                                     ;;expands to: (nth 3 public-params)
!(param mint-id)                                      ;;expands to: (nth 4 public-params)
!(param mint-amount)                                  ;;expands to: (nth 5 public-params)
!(param sighash)                                      ;;expands to: (nth 7 public-params)
!(param locktime)                                     ;; expands to: (nth 8 public-params)
!(param locktime-precision)                           ;; expands to: (nth 9 public-params)

!(param nullifiers <index>)                           ;; expands to: (nth <index> (nth 0 public-params))
!(param pub-out <index>)                              ;; expands to: (nth <index> (nth 6 public-params))
!(param pub-out <index> commitment)                   ;; expands to: (nth 0 (nth <index> (nth 6 public-params)))
!(param pub-out <index> ciphertext)                   ;; expands to: (nth 1 (nth <index> (nth 6 public-params)))

!(param priv-in <index>)                              ;; expands to: (nth <index> (car private-params))
!(param priv-in <index> scirpt-commitment)            ;; expands to: (nth 0 (nth <index> (car private-params)))
!(param priv-in <index> amount)                       ;; expands to: (nth 1 (nth <index> (car private-params)))
!(param priv-in <index> asset-id)                     ;; expands to: (nth 2 (nth <index> (car private-params)))
!(param priv-in <index> script-params)                ;; expands to: (nth 3 (nth <index> (car private-params)))
!(param priv-in <index> commitment-index              ;; expands to: (nth 4 (nth <index> (car private-params)))
!(param priv-in <index> state)                        ;; expands to: (nth 5 (nth <index> (car private-params)))
!(param priv-in <index> salt)                         ;; expands to: (nth 6 (nth <index> (car private-params)))
!(param priv-in <index> unlocking-params)             ;; expands to: (nth 7 (nth <index> (car private-params)))
!(param priv-in <index> inclusion-proof-hashes)       ;; expands to: (nth 8 (nth <index> (car private-params)))
!(param priv-in <index> inclusion-proof-accumulator)  ;; expands to: (nth 9 (nth <index> (car private-params)))
!(param priv-in <index> script-hash)                  ;; expands to: (hash (cons ((car (nth <index> (car private-params))) (cons (nth 3 (nth <index> (car private-params))) nil)))

!(param priv-out <index>)                             ;; expands to: (nth <index> (car (cdr private-params)))
!(param priv-out <index> script-hash)                 ;; expands to: (nth 0 (nth <index> (car (cdr private-params))))
!(param priv-out <index> amount)                      ;; expands to: (nth 1 (nth <index> (car (cdr private-params))))
!(param priv-out <index> asset-id)                    ;; expands to: (nth 2 (nth <index> (car (cdr private-params))))
!(param priv-out <index> state)                       ;; expands to: (nth 3 (nth <index> (car (cdr private-params))))
!(param priv-out <index> salt)                        ;; expands to: (nth 4 (nth <index> (car (cdr private-params))))
```

## Import

The preprocessor offers some limited package management facilities. Library files can be created with the form:

```lisp 
!(module math (
        !(defun plus-two (x) (+ x 2))
        !(defun plus-three (x) (+ x 3))
))
```

- Library files must use the `.lurk` file extension.
- Library files may contain more than one module.
- Modules must only make use of macros.
- Modules may import other modules, but cannot do circular imports.
- All top level functions and variables defined in the module are exported.

The preprocessor takes in a dependency directory as an argument. The dependency directory may have sub-directories.

```
/deps
  |-- /std
  |   |-- mod.lurk
  |-- /utils
  |   |-- mod.lurk
```

Assume the `math` module defined above was inside `/deps/std/mod.lurk`, you would import it as follows:

```lisp
!(import std/math)

(plus-two (plus-three 5))
```

Macro expands to:
```lisp
(letrec ((plus-two (lambda (x) (+ x 2))))
        (letrec ((plus-three (lambda (x) (+ x 3))))
                (plus-two (plus-three 5)) 
        )
)
```
Evaluates to: `10`