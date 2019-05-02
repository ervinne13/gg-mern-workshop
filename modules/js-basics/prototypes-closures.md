# Prototypes & Closures

## Prototypes

The prototype mechanism in JavaScript is quite complicated. ​

When you reference a property on an object, if that property doesn't exist, JavaScript will automatically use that object's internal prototype reference to find another object to look for the property on. You could think of this almost as a fallback if the property is missing.

```js
var foo = {
    a: 42
};

//  create `bar` and link it to `foo`
var bar = Object.create( foo );

bar.b = "hello world";

console.log(bar.b)       //  "hello world"
console.log(bar.a)       //  42 <-- delegated to `foo`
```

The a property doesn't actually exist on the bar object, but because bar is prototype-linked to foo, JavaScript automatically falls back to looking for a on the foo object, where it's found.​

This linkage may seem like a strange feature of the language. The most common way this feature is used -- and I would argue, abused -- is to try to emulate/fake a "class" mechanism with "inheritance."​

To demonstrate, consider the updated code below where we modify the property a:

```js
var foo = {
    a: 42
};

//  create `bar` and link it to `foo`
var bar = Object.create( foo );

bar.a = 43;

console.log(bar.a)  //  43
console.log(foo.a)  //  42
```

Remember one of the first lessons? Assigning complex types means passing references instead of values. This means that modifying `bar.a` should've changed `foo.a` as well. But since we used `Object.create` to use prototypical inheritance instead, it does not affect the original object.

---

A more natural way of applying prototypes is a pattern called "behavior delegation," where you intentionally design your linked objects to be able to delegate from one to the other for parts of the needed behavior.

This is quite the complex topic though and we may revisit this later instead. We will just be touching the surface here. If you want to learn more about behavior delegation, [click here](https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch6.md).

## Closure

To appreciate closures, let's first think about how JavaScript variable data gets cleaned up. Consider:

```js
function add(x, y) {
    return x + y;
}

add(2, 5);  //  7
//  at this point, x and y are both removed from the memory 
//  and are "garbage collected
```

You may think of closures as basically a way to "remember" variables even if the enclosing scope goes away.

Example:

```js
function makeAdder(x) {
    //  parameter `x` is an inner variable

    //  inner function `add()` uses `x`, so
    //  it has a "closure" over it
    function add(y) {
        return x + y;
    }

    return add;
}
```

Then:

```js
var plusOne = makeAdder(1);

var plusTen = makeAdder(10);

plusOne(3);     //  4
plusOne(41);    //  42

plusTen(13);    //  23
```

Closure is when a function is able to remember and access its lexical scope even when that function is executing outside its lexical scope.​

### Closure with Delays

Consider the code:

```js

function displayNumbers(from, to) {
    for (; from <= to; from ++) {
        setTimeout(function timer() {
            console.log( from );
        }, from * 1000);
    }
}

displayNumbers(1, 5);

```

What happened?

The timeout function callbacks are all running well after the completion of the loop.​

The function defined inside each setTimeout are all closed over the same shared upper scope (displayNumbers)​

That’s why all functions have the same output: 6, because they’re referencing the same variable ​

So what can we do if we want to prevent closure in this case? One solution is to make use of `let` to declare a variable that can only exist in the enclosing scope:

```js

function displayNumbers(from, to) {
    for (let current = from; current <= to; current ++) {
        setTimeout(function timer() {
            console.log( current );
        }, current * 1000);
    }
}

displayNumbers(1, 5);

```

### Modules using Closures

There are other code patterns which leverage the power of closure but which do not on the surface appear to be about callbacks. Let's examine the most powerful of them: the module.​


```js
function foo() {
    var something = "cool";
    var another = [1, 2, 3];

    function doSomething() {
        console.log(something);
    }

    function doAnother() {
        console.log(another.join(" ! "));
    }
}
```

As this code stands right now, there's no observable closure going on. We simply have some private data variables something and another, and a couple of inner functions doSomething() and doAnother(), which both have lexical scope (and thus closure!) over the inner scope of foo().

However, if we return and expose the functions `doSomething` and `doAnother`, we can do something like:

```js
function CoolModule() {
    var something = "cool";
    var another = [1, 2, 3];

    function doSomething() {
        console.log(something);
    }

    function doAnother() {
        console.log(another.join(" ! "));
    }

    return {
        doSomething: doSomething,
        doAnother: doAnother
    };
}

// Module Usage:
var foo = CoolModule();

foo.doSomething();  //  cool
foo.doAnother();    //  1 ! 2 ! 3
```

Because of closure, we can now access doSomething and doAnother outside of its lexical scope, while also being able to remember the variables inside the original scope.​
​
### Immediately Invoked Function Expressions

Immediately Invoked Function Expressions or IIFE is literally what it sounds like. You create a function and immediately invoke it. When you're in NodeJS's environment, every file is automatically wrapped in IIFE. This is because IIFE is used to simulate modules and ability to create private members!

```js
void function() {
    //  ...
}()

// or better expressed like:
(function() {
    // ...
})();
```

In effect, IIFE will:

- Protect against polluting the global or upper scope(s)​
- Allow pseudo private access in JavaScript (we’ll learn this later in closures)

Because an IIFE is just a function, and functions create variable scope, using an IIFE in this fashion is often used to declare variables that won't affect the surrounding code outside the IIFE:​

```js
var a = 42;

(function IIFE() {
    var a = 10;
    console.log(a); //  10;
})();

console.log(a); // 42;
```

Follow along the instructore as he shows more examples on how useful IIFE is.

### Combining Closure Modules & IIFE

We can combine IIFE and Modules like so:

```js
var AwesomeModule = (function() {
    var a = 10;

    function getPrivateA() {
        return a;
    }

    return {
        getPrivateA: getPrivateA
    };
})();

console.log(AwesomeModule.getPrivateA());   // 10
```