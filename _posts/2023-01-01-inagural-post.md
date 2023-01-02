---
layout: post
title: 'My current project: Sarzak'
author: Keith Star
tags: sarzak, cuckoo, nut, nutter, codegen, rust, modeling
---

I'm building a tool for myself. I call it _Sarzak_, after a dog. The dog was owned by the people
I worked for at a company called Project Technology, another lifetime ago. Sarzak is a suite of
tools that allow for generating code from models. I started working on this ages ago, and never
really had the time to finish it. Now that I've got oodles of time, I picked it up again.

### Cuckoo

Thus far I have a front end tool for drawing models called _Cuckoo_. Cuckoo (actually _Cuckoo2_,
because it's the second time I've build Cuckoo) is browser based, here's what it looks like:

![Cuckoo2 showing sarzak model](/assets/images/cuckoo2_sarzak.png)

I use [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG) to render the boxen and lines. The
_meaning_ of the boxen and lines comes partly from [Shlaer-Mellor](https://en.wikipedia.org/wiki/Shlaer–Mellor_method)
and some I just make up to suit myself. The tool was built using React and Redux. Redux is cool, React was the
wrong choice. It provides way more than I need, and I just don't like working with it.

The tool uses [Tauri](https://tauri.app) as the backend. Tauri works well enough, but it doesn't
let you start any threads in the backend. You are basically a slave to whatever the front end wants.
I didn't like this so much.

### Nut

I'm also working on a translation engine that converts Cuckoo models (JSON) into Rust code. It's still
nascent, but I did recently use it to generate some code for itself. That was tricky, and I may write
about it here.

I'll get more into nut in the future.

### Nutter

This is the successor to Cuckoo. There was no way that I was going to continue to hack on Cuckoo.
I got it working well enough to output JSON for input to nut, and that was more than enough. I came
to this decision after trying to add a new type of relationship. I still haven't gotten it working.

Nutter is a completely different experiment from Cuckoo. For one, I'm hoping to generate large
swaths of nutter. I'm also going away from Tauri (using Electron), and I don't want to use a web framework.
So, nutter is raw JavaScript in the browser, and Node for the backend. I'm cheating though. I'm
creating a native Node module in Rust using [Neon](https://neon-bindings.com).

Mouse events are piped through Electron to my node module (called _cocoa-puffs_) and the UI is
updated as necessary. Right now, this is all very experimental. I've got it working well enough
that I can render SVG, and animate it based on mouse input. I haven't quite thought through how
I'll make things like forms work, but that's half the fun.

## Conclusion

I hope to make a habit of writing these. I tend to put all sorts of ramblings in my code: comments,
commit messages, even READMEs. Doing so helps me think through problems, and take account of time.
But having all my thoughts sprinkled throughout different repositories isn't conducive to random
access. So here I am.
