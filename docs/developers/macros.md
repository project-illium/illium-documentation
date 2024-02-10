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
!(assert-eq (cons 1 2) (cons 1 2))
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
!(param sighash)                                    
!(param txo-root)                                     
!(param fee)                                         
!(param mint-id)                                     
!(param mint-amount)                                 
!(param locktime)                                     
!(param locktime-precision)                           

;; The below macros expand using the 'nth' function from
;; the standard libary. As such this function will need
;; to be imported if you use these macros.

!(param nullifiers <index>)                           
!(param pub-out <index>)                             
!(param pub-out <index> commitment)                  
!(param pub-out <index> ciphertext)                   

!(param priv-in <index>)                              
!(param priv-in <index> amount)                    
!(param priv-in <index> asset-id)                                           
!(param priv-in <index> salt)    
!(param priv-in <index> state)           
!(param priv-in <index> commitment-index             
!(param priv-in <index> inclusion-proof) 
!(param priv-in <index> script) 
!(param priv-in <index> locking-params) 
!(param priv-in <index> unlocking-params)                

!(param priv-out <index>)                            
!(param priv-out <index> script-hash)                 
!(param priv-out <index> amount)                     
!(param priv-out <index> asset-id)                    
!(param priv-out <index> state)                       
!(param priv-out <index> salt)                      
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

Assume the `math` module defined above was inside `/deps/std/mod.lurk`, you can import the entire modules as follows:

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

Alternatively, you can just import a single function from a module:

```lisp
!(import std/math/plus-two)

(plus-two 5)
```

Macro expands to:
```lisp
(letrec ((plus-two (lambda (x) (+ x 2))))
        (plus-two 5) 
)
```
Evaluates to: `7`

Keep in mind, if a function depends on another function in the module you'll need to import the entire
module to use that function.