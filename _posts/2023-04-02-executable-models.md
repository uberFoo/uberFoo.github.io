---
layout: post
title: 'Executable Models'
author: Keith Star
tags: modeling
---

I've really had my head down for the last few months, working on code generation.
Two or three model compilers later, I've finally got an idea of what it is I'm doing.
That sounds funny, but I guess that's the way my brain works.
I start out on a project, with a goal in mind, but not necessarily any idea what I'm doing.
As the project progresses, my brain builds abstractions -- basically models the problem.
Eventually I gain a clear picture of what the project is really about.
That's where I've landed with executable models, which is really what I've been working on for the last six months.

## What's a Model?

There are a lot of different definitions of the word "model".
For this discussion it is a collection of objects and relationships between objects.
An object is just a container for data.
Each datum in in object is given a name, we call this an attribute.
Each attribute has a type.
Examples of types are `String`, `bool`, `integer`, etc.
A relationship is a connection between two, related, objects.

For example, if one were building a banking application, one might have a `Customer` object.
This object would likely have attributes like `name`, `address`, `phone`, etc.

```mermaid
class Customer {
    +string name
    +string address
    +string phone
}
```

You'd also likely want an `Account` object.
It would need attributes like `balance`, `interest_rate`, `number`, etc.
There would be a relationship between `Customer` and `Account`.
It would state that a `Customer` can have many `Account`s.
The hallmark of a model is that it is conceptually simple enough that anyone can be taught to build one.




## What's an Executable Model?

So, you've gone