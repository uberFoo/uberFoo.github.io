---
layout: post
title: 'Sarzak 1.0'
author: Keith Star
tags: sarzak, modeling, codegen
---

I'm closing in on 1.0.🎉
For all intents and purposes I'm there.
But what is 1.0, and what is Sarzak exactly?
Hopefully this will clarify things.

## Sarzak

First off, sarzak is confusing.
On one hand it's an overarching name I've given this experiment in code generation.
On the other hand it's a specific Rust crate for doing code generation.
A rust crate that is 100% [generated code](/assets/docs/sarzak/sarzak/index.html).

## Nut

But I'm getting ahead of myself.
Sarzak the crate is brand new, and doesn't do anything but test itself.
My first code generator is a crate called _nut_.
I don't know why. 🤷‍♂️
So nut is the first iteration of sarzak.
Nut turns models, stored as JSON, into Rust code.

We manage this by ascribing consistent semantic meaning to the model components, and how those components are assembled.
The meaning comes from [Sally & Stephen](https://en.wikipedia.org/wiki/Shlaer–Mellor_method), and whatever changes I've made in the interim.

Rather than getting into any specifics, suffice to say that if you build a model correctly you will get correct code.
If you don't build it correctly, as it stands now, the compiler will do weird things.
In the future, I think I can build a tool that tells you when you've made a modeling mistake.🤔

## Domain Generation

Getting back to code generation, given a model, and some rules, we generate code.
I've finally got the whole system (_data extrusion_[^extrude] and code generation) generating a domain.
What's that mean exactly?
Well, it means that given an input model, I am generating a Rust module that includes:

-   [structs (including doc tests), enums and constants](/assets/docs/sarzak/sarzak/sarzak/types/index.html) for all of the [`Object`](/assets/docs/sarzak/sarzak/sarzak/types/struct.Object.html)s in the input _model_
-   an [`ObjectStore`](/assets/docs/sarzak/sarzak/sarzak/store/struct.ObjectStore.html) to store instances of the above
-   and, [macro](/assets/docs/sarzak/sarzak/index.html)s to navigate relationships in the input _model_

Now, this is pretty huge.
At least, it is to me!

Consider these two input domains:
![Sarzak Domain](/assets/images/sarzak_0_small.png)
[fullsize](/assets/images/sarzak_0_smallish.png)
![Drawing Domain](/assets/images/drawing_0_small.png)
[fullsize](/assets/images/drawing_0_smallish.png)

The first is the model of _modeling_[^ooa].
It is the bare minimum necessary to capture the information in the model.
The second is a model of drawing the boxes and lines.

Together they represent the JSON input[^nb].
Or they will once I'm done with them.
The topmost diagram is in a state of transition.
I'm still modeling what an associative object/relationship looks like.
The bottom one is more complete, if lacking in some respects I think.

I've run the two models through nut.
I have **SARZAK** 🤣: a generated rust module, containing everything I need to build _another_ code generator!
Just easier, and better this time around.

Mostly because I'll be able to update the model, and get my changes automatically generated.
I've also got ideas on how to mix generated and hand written code.
I'm a long ways from a 100% generated generator, so there will be hand written code for a while.

Finally, sarzak is recursive, and I just ❤️ recursion.

### Code Generation

I expect that code generation will always be something of a slog.
Having to think about writing code in the third person can be trying.
(Doing it in the fourth person is something else...)
But it's really rewarding.
I have ideas on how to make it better.

For one, I plan on generating traits and trait impl skeletons to handle rendering.
So, I'll annotate certain objects in the model (via their description, you can see [examples in the documentation](/assets/docs/sarzak/sarzak/drawing/types/constant.LEFT.html)) to require a trait implementation.
I think it may look something like this.

```rust
pub trait Render {
    type Output;

    fn render(&self) -> Self::Output;
}
```

This will work well with code generation where my basic unit is a `Context`, which is a string with methods, e.g., `increase_indent()`.
It will also work well when I want to render to SVG for the next iteration of the tool.

I was even thinking that it could be possible stuff the implementation into a code block, just like above in the source for this document.

That last idea would be a hack until something better.
That better comes from creating a DSL composed completely from macros.
It's barely an idea now, and I discuss it some more below.

### Relationship Navigation

The third point above, may seem sort of basic.
I think that it will actually turn out to be one of the best features.
Being a macro, it's just generating some code for us.
The code being generated here does lookups in the ObjectStore when you want an instance of something across a relationship.
Pretty basic.
However, it's a macro, and we can have it generate whatever code we like.

Say you have some widget that has attributes in ROM.
When you are generating code in the default way it'll read attributes from the store.
This is great if you want to build tests, or verify your models in a simulated environment.
Now, when you want to deploy, you can replace that macro's output with code to get data from ROM.

There is a lot of hand-waving going on there.
Actually pulling that off for _only_ that one widget would be tricky.
But the idea stands in general.
It is easy to replace macro definitions at a file level.
This has great ramifications for code generation.
The details of which are still a WIP.
But I expect some really cool stuff to come out of my brain.

## Domains other than OOA^2 (Application Domains)

Using sarzak to generate code for the meta-model (the model for which it generates code) is working at a certain level of abstraction.
Let's call it _7_.
When we get an instance of [`Object`](/assets/docs/sarzak/sarzak/sarzak/types/struct.Object.html) at level _7_ we understand that it is an abstract thing the user has entered into the tool.
It has [`Attribute`](/assets/docs/sarzak/sarzak/sarzak/types/struct.Attribute.html)s, etc.
We can generate code for it.

But now let's say you run a different model through sarzak.
Basically any model that isn't sarzak itself.
Now you are operating at a different level of abstraction.
Maybe a _10_?
(For some reason, in my head, things get more abstract the closer they are to zero.)
What are instances of `Widget` good for?
How do you get them?

You still do code generation for `Widget` using things from the sarzak domain, not the domain from which `Widget` cometh!
So what good is this domain?

This is where things are still fuzzy.
What we have is the ability to create and manipulate objects in the application domain.
The `Widget` domain.

Off the top of my head this seems like a great place to test models[^tdd].
We've got the ability to create new instances, and manipulate them.

Once I've got state machines working, you'll be able to send events to instances as well.
At this point it's starting to look like a simulation environment, which is another possibility.

I've also thought about having a REPL to play with instances of your model.
Using the sarzak generated code would be a good starting place for any of these.

## In Closing

Sarzak can generate itself (once I've finished the model...).
I'm super happy about this. 😃

I'm really looking forward to working on the new code generator.
I'm calling in grace, in order to keep the dog name tradition.
It's going to be based off of the new sarzak crate.

I'll be driving development by generating the next version of the tool.
Thus, the target of grace will be a general rust runtime.
Having said that, it's hard to imagine I won't rebuilt nut using sarzak.
I guess I'll have to give that another dog name...

## Footnotes

[^extrude]:
    Extrusion is what I call it when I'm changing the underlying data structure, bringing instances alomg for the ride.

    I needed to do this because the original, hand written, model had errors.
    Neither was it ideally suited to code generation.

    There will be more extrusion as I expand upon the OOA^2.
    Mostly it's implementing the [`From`](https://doc.rust-lang.org/1.66.1/core/convert/trait.From.html) trait, as well as a trait I have called `Extrude`:

    ```rust
    pub trait Extrude<T, C> {
        fn extrude(input: T, context: &mut C) -> Self;
    }
    ```

[^ooa]:
    I don't know what to call this.
    It is a meta-model.
    We used to call it the OOA of OOA, or OOA^2.
    Where OOA := Object Oriented Analysis.

[^nb]:
    The code that reads that JSON is _not_ the model.
    It is hand written.

[^tdd]:
    I've already used this domain to develop/test the code generator, and I plan on doing more of it.
    It's a form of test driven development, but with models!
