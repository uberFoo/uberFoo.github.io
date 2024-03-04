---
layout: post
title: 'Toasted Python / JavaScript Thrashing'
author: Keith Star
tags: rust, dwarf
---

> TLDR: dwarf is faster than Python, and (much, much) slower than JavaScript for CPU bound tasks*. 🐍🪓
>
> *A task is defined as independent work that may be performed concurrently, (presumably on a thread), with other tasks.

I've got a little programming language called [dwarf](https://www.github.com/uberFoo/dwarf) that shares syntax with, and is implemented in: [Rust](https://www.rust-lang.org).
I have spent the last two months on a VM (and associated compiler) that supports dynamic plugins as well as async/.await syntax.

I got to wondering how dwarf compares, performance-wise, with other interpreted languages.
Not being terribly creative I landed on two benchmarks: for loops, and fibonacci.

I chose to compare against Python and JavaScript because they both offer support for async functions.
A feature shared with dwarf.

## Testing Performance

See, there's no way my two month old VM and compiler is going to be able to compete with either Python, or JavaScript in terms of performance.
However, if we choose to benchmark concurrent tasks, then I might stand a chance.

Now, Python and JavaScript are single threaded, so how do we manage to run concurrent tasks?

> Yes, Python has concurrent.futures.ThreadPoolExecutor, but there is still the Global Interpreter Lock (GIL) that keeps Python from true CPU concurrency.

The answer is async functions.
That doesn't make the work getting done run any faster, but it does allow the program to do other things while waiting for the work to be done.
And it just so happens that dwarf also supports async functions, but it has an advantage over the other two languages: it's multi-threaded.

Now, I can hear some people crying out about it being sort of weird using async functions to do CPU intensive work.
Yes, I guess?
Normally when one thinks of async they think of a server bound to a socket, waiting for connections.
When a connection arrives an async task is spawned to handle the connection.
What is involved in "handling the connection"?
Well, it could be a lot of things, and they may actually do CPU intensive work.
So, maybe it's not so weird?

Anyway, while Python and Javascript are single-threaded, dwarf is multi-threaded.
This means that if you have work that can be done concurrently, dwarf can have multiple cores working on it at the same time.

> dwarf can be built with or without async support.
> Async support is multi-threaded by necessity, since it's implemented in Rust, using Rust's async/.await feature.
> With async support comes the ability to create tasks that run concurrently.
> Each task is handed off to a thread pool, and the task is run on one of its threads.
> This allows the fairly slow VM the ability to get more work done, or to get work done faster, depending on how you want to look at it.

This is how it's able to compete with Python.
Alas, when it comes to JavaScript, there simply is no competition.

For all the tests performed, I used Python 3.11.6 and node v21.5.0.
All timing information was obtained by using [hyperfine](https://github.com/sharkdp/hyperfine).
Tests were run on a 2023 MacBook Pro with an M2 Max with 12 Cores and 64GB of RAM.
The OS was macOS Sonoma 14.2.1.

## Benchmarks

### For Loops

The first "benchmark" we'll discuss is for loops.
The main purpose of this test is to waste time in a loop while the async system is put through its paces.
It also lets us look at just how fast loops are implemented in each language.

#### Code

For the for loops I did the dead simple thing (dwarf source):

```rust
fn do_work(n: int) {
    for _ in 0..n {}
}
```

For Python:

```python
def do_work(n):
    for _ in range(n):
        pass
```

And, the same thing in JavaScript:

```javascript
function doWork(n) {
    for (let i = 0; i < n; i++) {}
}
```

#### Results

The charts contained herein, with one exception, have time as the y-axis and the number of iterations as the x-axis.
I've conveniently made the iterations increase exponentially from one (radix 10).
Each line corresponds to some amount of work being done, at some number of iterations.
The exception, which will be apparent, uses a logarithmic scale for the y-axis (time).

In all cases, lower is better.

##### dwarf vs. JavaScript

Ok -- first off is dwarf vs. JavaScript.

![dwarf vs. JavaScript: for loop](/assets/images/dwarf-vs/dwarf-v-js-for-loop.png)

As you can see, JavaScript confidently trounces dwarf.
I think that the big takeaway is that dwarf is two orders of magnitude slower than JavaScript.

JavaScript at 1 million iterations is still faster that dwarf at 1 hundred-thousand.
There's one order of magnitude.
The other one comes from dwarf using 12 cores to do the work.

Concretely, at the extreme amounts of work, JavaScript is 12 times faster than dwarf.
And dwarf is running on 12 cores.
Given that 12 ⨉ 12 is 144, dwarf is about 144 times slower than JavaScript.

> It may not be quite this bad.
>The test machine has 4 "efficiency" cores, which are presumably slower than the 8 "performance" cores.

The time difference in JavaScript from 100,000 iterations to 1,000,000 is interesting.
I'd be curious to know what's going on there.

##### dwarf vs. Python


Below is dwarf vs Python.
This is a very different story from above.

![dwarf vs. Python: for loop](/assets/images/dwarf-vs/dwarf-v-python-for-loop.png)

First, the most obvious thing is that dwarf is faster in nearly all cases.
The exception being when there is only one task, and the work is above the startup threshold.
This is easy to see for one task doing 10 million iterations.
This makes sense, given that Python is a lot faster than dwarf.

> At a minimum, dwarf performa work 1.4 times faster than Python.*

Python starts up really slowly, so it's speed advantage only comes into play at 1 million iterations with *one* task, where it's got a 5% advantage.
At 10 million iterations, Python is 5 times faster than dwarf.
However, beyond one iteration, dwarf is up to 10 times faster.
dwarf however acheives this with 12 cores, while Python runs on only one.
At the minimum, when a large enough amount of work is being done, dwarf is 1.4 times faster than Python.

In both graphs it's interesting to see the symmetry across work and task count.
This is perhaps not surprising, given that work ⨉ task count is linear, and we are increasing both axes by decades.

### Fibonacci

For fib, I used the naive recursive implementation to burn some CPU cycles.
Perhaps more importantly we gain an insight into how long it takes to call a function in each language.

#### Code

This is the dwarf implementation; it is not surprising.

```rust
fn fib(n: int) -> int {
    if n <= 1 {
        n
    } else {
        let a = fib(n - 1);
        let b = fib(n - 2);
        
        a + b
    }
}
```

The same can be said about Python's implementation.

```python
def fib(n):
    if n <= 1:
        return n
    else:
        a = fib(n-1)
        b = fib(n-2)
        return a + b
```

Javascript is no different. 

```javascript
function fibonacci(n) {
    if (n <= 1) {
        return n;
    }

    const fib1 = fibonacci(n - 1);
    const fib2 = fibonacci(n - 2);

    return fib1 + fib2;
```

#### Results

##### dwarf vs JavaScript vs Python -- fib(28)

![dwarf vs. All: fib(28)](/assets/images/dwarf-vs/dwarf-v-all-fib-28.png)

##### dwarf vs JavaScript vs Python -- fib(17)

![dwarf vs. All: fib(17)](/assets/images/dwarf-vs/dwarf-v-all-fib-17.png)

This chart is the same data as the one above, but it's plotted on a log scale.

##### dwarf vs JavaScript vs Python -- fib(17)

![dwarf vs. All Log Time: fib(17)](/assets/images/dwarf-vs/dwarf-v-all-fib-17-log.png)

This image does a good job illustrating the startup overhead of each language.
Calculating the 17th Fibonacci number is a trivial task, and it's faster than the time it takes to compile and run the code.
Clearly dwarf starts up much more quickly than either other language.
Javascript has a slight edge (~12%) over Python.

By 1000 iterations Javascript is the clear winner.
And that's around where Javascript finally budges from it's horizontal trek.
To me this implies that node has a lot more startup overhead than either Python or dwarf.
dwarf's time increases pretty quickly, which again implies very small overhead.

## Conclusion

Both Python and JavaScript have had a lot of work put into them, and it shows.
Both are really fast, with JavaScript being really, really fast.
dwarf is pretty slow, but it's multi-threaded, and it can get more work done per unit time than Python.

dwarf is only going to get faster as time goes on.
The compiler still needs optimizations applied to it's output.
The VM likely as not has a few tweaks that can be made.
And for a two month old implementation, I'm quite pleased with the results.

## Full Program Source

Below is the full source of the benchmarks.
For the Python and JavaScript programs, I used GitHub Copilot to write the code.
I did this because I haven't written much of either language in several years.
I was hoping that what came out of Copilot would be more or less idiomatic.

### For Loops

#### dwarf

```rust
fn waste_time(n: int) {
    for _ in 0..n {}
}

async fn cpu_heavy() -> Future<()> {
    let workload = 10000;
    let task_count = 1000;

    let tasks: [Future<()>] = [];
    for _ in 0..task_count {
        tasks.push(chacha::spawn(|| -> () { waste_time(workload) }));
    }

    for i in tasks {
        let _ = i.await;
    }
}

async fn main() -> Future<()> {
    let _ = cpu_heavy().await;
}
```

#### Python

```python
import asyncio

async def waste_time(id, n):
    for i in range(n):
        pass

async def main():
    work = 10000000
    task_count = 100

    tasks = []
    for i in range(task_count):
        tasks.append(waste_time(i, work))

    for f in tasks:
        await f

asyncio.run(main())
```

#### JavaScript

```javascript
// This function represents an asynchronous task that executes a for loop.
async function asyncTask(iterations) {
    for (let i = 0; i < iterations; i++) {}
}

// This function starts a number of asynchronous tasks.
async function startAsyncTasks(numTasks, iterationsPerTask) {
    let tasks = [];
    for (let i = 0; i < numTasks; i++) {
        tasks.push(asyncTask(iterationsPerTask));
    }
    await Promise.all(tasks);
}

startAsyncTasks(1000000, 10000).then(() => console.log('All tasks completed'));
```

### Fibonacci

#### dwarf

```rust
fn fib(n: int) -> int {
    if n <= 1 {
        n
    } else {
        let a = fib(n - 1);
        let b = fib(n - 2);
        
        a + b
    }
}

async fn cpu_heavy() -> Future<()> {
    let n = 17;
    let task_count = 1;

    let tasks: [Future<int>] = [];
    for i in 0..task_count {
        tasks.push(chacha::spawn(|| -> int { fib(n) }));
    }

    for i in tasks {
        let _ = i.await;
    }
}

async fn main() -> Future<()> {
    let _ = cpu_heavy().await;
}
```

#### Python

```python
import asyncio
import concurrent.futures

def fib(n):
    if n <= 1:
        return n
    else:
        a = fib(n-1)
        b = fib(n-2)
        return a + b

async def main():
    j = 28
    k = 100

    with concurrent.futures.ThreadPoolExecutor() as pool:
        for i in range(k):
            print(await asyncio.get_event_loop().run_in_executor(pool, fib, j))

loop = asyncio.get_event_loop()
loop.run_until_complete(main())
loop.close()
```

#### JavaScript

```javascript
function fibonacci(n) {
    if (n <= 1) {
        return n;
    }

    const fib1 = fibonacci(n - 1);
    const fib2 = fibonacci(n - 2);

    return fib1 + fib2;
}

async function runFibonacciFunctions(times) {
    const numbers = Array(times).fill(28);

    const results = await Promise.all(numbers.map(async (n) => {
        const result = await fibonacci(n);
        console.log(`Fibonacci(${n}) = ${result}`);
        return result;
    }));

    console.log("All Fibonacci functions completed:", results);
}

runFibonacciFunctions(1000);
```
