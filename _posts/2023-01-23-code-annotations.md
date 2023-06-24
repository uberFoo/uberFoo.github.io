---
layout: post
title: 'Code Annotations'
author: Keith Star
tags: codegen, rust
---

One of the promises of code generation is that you shouldn't have to touch the code.
When you change the model, you run the model compiler (I think that's what I'm calling sarzak), new code spews forth.
No user intervention required.

I've recently tested this out.
I'm working on extruding models from using the handwritten code to using the generated code.
Remember, the generated code comes from the sarzak model/domain.
The extrusion process isn't really something that I can automate, so I need to write that by hand.
I'm generating the skeleton, and then I fill in the blanks.

I hit a snag where the generated code didn't make sense.
I needed a place to store a list of id's, and I didn't have such a place in the generated code.
It turns out there are really two problems, because you can't really store a list, but that's getting off topic.

I needed to change the model and regenerate the code.
The code would be changing pretty significantly.
An enum was getting replaced with a struct.
One relationship replaced with two.
The erstwhile enum was also involved in another relationship that would need to change.

How did it turn out?
Very well.
My `ObjectStore` implementation wasn't correctly updated, and that's my fault.
I need to output some metadata in that code -- I just spaced it because it hasn't changed in ages.

Here's an example of how an entire function implementation changed because the type changed from an enum to a struct.
The `IgnoreBlock`s are there to keep the silly variable names and values from changing all the time.
This makes `git` happy.

```Rust
// {"magic":"","kind":{"CriticalBlockBegin":{"tag":"relationship-test_default"}}}
impl Relationship {
    pub fn test_default(store: &mut ObjectStore) -> Self {
        //         let test = Self::Isa(Isa::test_default(store).get_id()); //⚡️
        // {"magic":"","kind":"IgnoreBlockBegin"}
        let zany_iron = "tan_plot".to_owned();
        let nutritious_porter = "deafening_nose".to_owned();
        let object_gui = Object::new(store, zany_iron, nutritious_porter);
        let supertype_lpu = Supertype::new(store, &object_gui);
        let test = Self::Isa(Isa::new(store, &supertype_lpu, 42).id);
        // {"magic":"","kind":"IgnoreBlockEnd"}

        store.inter_relationship(test.clone());

        test
    }
}
// {"magic":"","kind":{"CriticalBlockEnd":{"tag":"relationship-test_default"}}}
```

Below changes because `Subtype` now contains a pointer to `Isa`, and gets a new constructor and `id`.

```Rust
impl Subtype {
    //     pub fn new(store: &mut ObjectStore, obj_id: &Object) -> Self { //⚡️
    //         let id = Uuid::new_v5(&UUID_NS, format!("{:?}::", obj_id,).as_bytes()); //⚡️
    pub fn new(store: &mut ObjectStore, isa: &Isa, obj_id: &Object) -> Self {
        let id = Uuid::new_v5(&UUID_NS, format!("{:?}::{:?}::", isa, obj_id,).as_bytes());
```

The code that writes the generated code also comments my code out if it is in a critical section.
That's a section where not updating it is going to break things.
There's an override, of course, and in that case it'll insert the new code commented out.

I really wanted something that would let me intermingle generated and hand written code.
I also wanted it to be smart enough to insert and remove code sections, based on compiler options.
So far, it's living up to expectations.
The metadata is distracting, but it's not the worst.
Oh, and the empty boxes in the code are tiny little rust logos in nerd fonts!

![Nerd Font](/assets/images/nerd.png)
