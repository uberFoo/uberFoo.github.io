---
layout: post
title: 'Modeling and Bugs'
author: Keith Star
tags: modeling
---

Just a quick note.
I am currently building a parser.
The AST walker creates instances in a model I call Lu-Dog.

I am just getting serious about the Lu-Dog model, in that I'm finally working on the model itself.
Until now, the parser has been independent of the model.
As I build the model, and work through the logic of how it all fits together, I'm finding logic bugs in the parser.

For example, I'm modeling an `Option` , similar to what Rust has.
I erroneously had a relationship between the `Some` variant and the `Type` object.
Clearly this relationship belongs between `Option` and `Type` , because the option contains a `Type` .
The `Some` variant needs a relationship to `Value` , which a `Some` contains.

I missed this when writing the parser, although I did feel weird creating `Some` variants to declare a `Option` type...
I find it super interesting that these things don't crop up for me until I'm actually formalizing my thoughts.
