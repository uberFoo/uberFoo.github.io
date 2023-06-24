---
layout: post
title: 'Passing Uuids'
author: Keith Star
tags: rust
---

I use [Uuid](https://docs.rs/uuid/latest/uuid/)s everywhere in sarzak.
Recently I accidentally passed one by value without cloning it.
So I did some digging and discovered ([here](https://docs.rs/uuid/latest/src/uuid/lib.rs.html#436) and [here](https://docs.rs/uuid/latest/src/uuid/lib.rs.html#278)) that it's nothing more than an array of bytes:

```rust
pub type Bytes = [u8; 16];
```

So that got me wondering, and I started doing some research.
I found [this article](https://www.forrestthewoods.com/blog/should-small-rust-structs-be-passed-by-copy-or-by-borrow/) where the fellow was wondering the same thing as me.
Based on his analysis it shouldn't matter much which way I do it.

Personally I prefer not typing ampersands everyplace, and I think it looks nicer without.
(Coding based on esthetics should probably be discouraged.)
Probably the place where `Uuid`s are used the most is in my `ObjectStore` table lookup macros.
Since they are macros anyway, it's easy enough to add the ampersand there.
So I get to have my cake, and eat it too!
