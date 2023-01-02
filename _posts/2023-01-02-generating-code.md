---
layout: post
title: '~~Live code generation~~ Code vs. Model'
author: Keith Star
tags: codegen, modeling
---

I was going to write something about the difficulty I've had with code generation.
The problems I had running a program.
A program that injects source code into the a crate.
That very same crate that compiled the program generating the source code!
It's sort of deeper that I thought once I started to write about it.

On that topic, writing a short, succinct, self-contained missive is difficult.
More so than I would have imagined, never having done this before.
I believe it's especially difficult given the scope of what I'm writing about.

> Having just finished writing this, I have proven just how difficult!

-   Having just proofread this...
    > OMG, this is terrible.
    > I don't think it's readable by other human beings.
    > I'm going to post it anyway.
    > This is really for me, and this is good practice writing.

So, I was thinking about where I'm at with the project.
Thinking about what I'm working on, and why I'm working on it.
For me it's easy to run down a rabbit hole, and forget why I'm there to begin with!
I realized that what I'm doing is writing code that generates some other code.
That other code, when executed with an associated model, will generate some code of it's own.
That generated code will also include Rust macros that themselves generate code.
So I'm writing code that will have three descendants!

To give myself some input, I'm also making some changes to a model I use.
The model domain is called `Drawing`.
This domain captures the location and size information of the boxen and lines in Cuckoo.
`Drawing` looks thusly,

![Drawing Domain](/assets/images/drawing.png)

Here's a [larger version](/assets/images/drawing_reasonable.png) of the domain.

You'll notice that It's got a Point "class", etc.
Notice that on the left `Object` and `ObjectUI` are related across `R1`.
The former comes from another model.
That model is a model of the modeling abstraction itself.
So, it's got a "class" called `Object` that is an abstraction for an object.

-   About Classes and Objects
    > I misuse the OO notation.
    > I know what a `class` is, and that usually an `object` is an instance of a `class`.
    > I however grew up calling `class`s `object`s.
    > Instances were just instances.
    > So above, `Object` is analogous to `class`.

The entire point of the `Drawing` domain is to separate concerns.
I don't want geometric information cluttering up my modeling abstraction.
So I stuff it in another domain and setup some pointers via `R1` and `R11`.
That's what `Drawing` is all about.

In parallel to this, and really the reason I'm doing this at all, I'm hacking on some code to generate code to be used in `nutter`.
`nutter` is the next iteration of the modeling tool.
I have `nutter` working to the extent that I can use a Cuckoo model to generate code that is used to draw rectangles on the screen.
When I run `nutter` I get empty boxen, all placed and sized just like they are in the Cuckoo model.
I can drag the boxen around, and it's all good fun.

I want to draw the lines.

-   Boxen and Lines
    > In case I haven't mentioned it, `boxen` is the obvious plural of box.
    > The yellow `boxen` in the image above are instances of objects.
    > (Remember, I have my own vocabulary, and this is my blog. 😉)
    >
    > `Object` will eventually be translated into some code.
    > That code, whatever the language, will have the concept of owning an `id` and a `name`.
    > Where `id` is a `Uuid`, and `name` is a `String`.
    > Whatever `Uuid` and `String` are.
    >
    > The `Sarzak` domain, where `Object` comes from has a host of other things I'll share eventually.
    > Suffice to say, it'ts enough to specify the `boxen` and `lines` you see above.
    >
    > The `lines` are relationship between objects.
    > I'm not going to bother to define relationship right now.
    > It could be generated into a pointer from one object to another, if that helps.

Wanting to draw lines, I thought about what a pain in the ass it is keeping the arrow heads attached to the box when you drag it around.
Serious P.I.T.A.
It involves looking up everything related to you, and then selecting their SVG elements and updating their coordinates.
What's worse is that the line connecting the arrow heads (which are [&lt;g&gt;](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/g) elements, so at least their lines move as a group) isn't logically connected to either end point.
That sentence is terrible.
Bottom line is that for every relationship, you need to search for two other things to update.
Doing the searching is painful, as it's all by element ID.
(I may have been able to use [`data-*`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*), but honestly I'd forgotten about it.)
There are other painful edges to Cuckoo related to how everything is wired up.
It's pretty fragile, thus the rewrite.

I'm doing everything in the backend of `nutter` with generated Rust code.
The Rust sends JavaScript objects across to the code running in the browser, and that code renders the SVG.
(I'm going to hack a version where I send JavaScript code over as strings and [`eval`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) it.)
I want to be sure that `ObjectUI` knows about attached relationships.
That way when it's translated by a [`mousemove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event) event, it can easily have the relationship do the same.

None of that was in the original `Drawing` domain (which contains code generated (in the `nut::drawing` module) from the model).
Thus I found myself using Cuckoo to add some abstraction, shown above.
There is a new relationship there to maintain the side of the box the line is attached to, as well as some other details.

Now I need to generate the code again.
However this time I want to generate all of the code for the Rust module.
It'll wind up in `nut::domain::version2` or something.
This is already long, and so I'll try to get to the point.

There are details missing from the abstraction in the `Drawing` domain.
We do have a new relationship between the arrow head and a particular side of a box.
That's great, but what about it's position on that line that comprises a side?
That's not captured in the model.
I can (and will probably) add a relationship between `Anchor` and `Point` so that it at least has global coordinates.
And honestly, that's really good enough.
It's enough information that I can have the relationship re-render itself when prompted by `ObjectUI`.
Or the `ObjectUI` code could just reach into `RelationshipUI` and do it that way.
Not a pretty solution, but you could do it.

The point, is that there is a line that is drawn between elaborating the model more, and doing it in code.
I suppose it's pretty obvious by the end of this post, but it was an interesting insight I had earlier.
