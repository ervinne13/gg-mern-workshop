
## Mastering the "this" Identifier

A very commonly misunderstood concept in JavaScript is how the `this` identifier works. Thoroughly familiarizing yourself with the `this` keyword will help you a lot in your later projects and prevent lots of confusion and issues most developer make (juniors and seniors alike).

Consider the code below:

```js
function foo() {
    console.log(this.bar);
}

var bar = "global";
var obj1 = {
    bar: "obj1",
    foo: foo
};

var obj2 = {
    bar: "obj2"
};

//  -----

foo();          //  global
obj1.foo();     //  "obj1"
foo.call(obj2); //  "obj2"
new foo();      //  undefined
```

If a function has a this reference inside it, that this reference usually points to an object. But which object it points to depends on how the function was called.​

It's important to realize that `this` does not refer to the function itself, as is the most common misconception.​

There are four rules for how `this` gets set, and they're shown in those last four lines of that snippet.​

- `foo()` ends up setting `this` to the global object in non-strict mode -- in strict mode, this would be undefined and you'd get an error in accessing the `bar` property -- so `"global"` is the value found for `this.bar`.​

- `obj1.foo()` sets this to the `obj1` object.​

- `foo.call(obj2)` sets this to the `obj2` object.​

- `new foo()` sets this to a brand new empty object.​

__More example for demonstrating the `this` keyword__

Like the instructure mentions, lots of frustration happen when dealing with the `this` keyword and a lot of developers tend to avoid this because of the lack of understanding. Let's examine one more example:

```js
function foo(num) {
    console.log("foo: " + num);
    //  keep track of how many times `foo` is called
    this.count++;
}

foo.count = 0;

for (let i = 0; i < 10; i ++) {
    if (i > 5) {
        foo(i);
    }
}

//  foo: 6
//  foo: 7
//  foo: 8
//  foo: 9

//  how many times was `foo` called?
console.log(foo.count); //  0
```

`foo.count` is still `0`, even though the four `console.log` statements clearly indicate `foo(..)` was in fact called four times. The frustration stems from a too literal interpretation of what `this` (in `this.count++`) means.​

When the code executes `foo.count = 0`, indeed it's adding a property count to the function object `foo`. But for the `this.count` reference inside of the function, this is not in fact pointing at all to that function object, and so even though the property names are the same, the root objects are different, and confusion ensues.​

So you might ask, does it reference the object or function in it’s lexical scope?​

​Let's look at another incorrect implementation

```js
function parent() {
    var bar;

    function foo() {
        this.bar = 'test';        
    }

    return { foo: foo };
}

console.log(parent().foo.bar);  //  undefined
```
​
We created an object using the `parent()` function returning an object literal with `foo` yet we still can't access `this.bar`'s value.

### Trying to make sense:

The `this` identifier is contextual based on the conditions of the function's invocation. this binding has nothing to do with where a function is declared, but has instead everything to do with __the manner in which the function is called.__ ​

### Call-Site

To understand it better, we need to know something about the call-site. The call-site is the location in code where a function is called and __not where it's declared__.

Finding the call-site is generally: "go locate where a function is called from", but it's not always that easy, as certain coding patterns can obscure the true call-site.​

What's important is to think about the call-stack​.

### Locating the Call-site

```js
function baz() {
    // call-stack is: `baz`
    // so, our call-site is in the global scope

    console.log( "baz" );
    bar(); // <-- call-site for `bar`
}

function bar() {
    // call-stack is: `baz` -> `bar`
    // so, our call-site is in `baz`

    console.log( "bar" );
    foo(); // <-- call-site for `foo`
}

function foo() {
    // call-stack is: `baz` -> `bar` -> `foo`
    // so, our call-site is in `bar`

    console.log( "foo" );
}

baz(); // <-- call-site for `baz`
```

Take care when analyzing code to find the actual call-site (from the call-stack), because it's the only thing that matters for this binding.

We turn our attention now to how the call-site determines where `this` will point during the execution of a function.

You must inspect the call-site and determine which of 4 rules applies. We will first explain each of these 4 rules independently, and then we will illustrate their order of precedence, if multiple rules could apply to the call-site.

### 4 Call-site Determining Rules

- Default Binding
- Implicit Binding
- Explicit Binding
- `new` Binding

#### Default Binding

The first rule we will examine comes from the most common case of function calls: standalone function invocation. Think of this `this` rule as the default catch-all rule when none of the other rules apply.

```js
function foo() {
	console.log( this.a );
}

var a = 2;

foo(); // 2
```

When `foo()` is called, `this.a` resolves to our global variable `a`. Why? Because in this case, the default binding for `this` applies to the function call, and so points `this` at the global object.

__HOWEVER!__

If `strict mode` is in effect, the global object is not eligible for the default binding, so the `this` is instead set to undefined.

```js
function foo() {
	"use strict";

	console.log( this.a );
}

var a = 2;

foo(); // TypeError: `this` is `undefined`
```

#### Implicit Binding

Another rule to consider is: does the call-site have a context object, also referred to as an owning or containing object, though these alternate terms could be slightly misleading.

```js
function foo() {
    console.log( this.a );
}

var obj = {
    a: 2,
    foo: foo
};

obj.foo(); // 2
```

Firstly, notice the manner in which `foo()` is declared and then later added as a reference property onto `obj`. Regardless of whether `foo()` is initially declared on `obj`, or is added as a reference later (as this snippet shows), in neither case is the __function__ really "owned" or "contained" by the `obj` object.

Also remember that only the __top/last level of an object property reference chain matters to the call-site__. For instance:

```js
function foo() {
    console.log( this.a );
}

var obj2 = {
    a: 42,
    foo: foo
};

var obj1 = {
    a: 2,
    obj2: obj2
};

obj1.obj2.foo(); // 42
```

##### Implicitly Lost

One of the most common frustrations that `this` binding creates is when an *implicitly bound* function loses that binding, which usually means it falls back to the default binding, of either the global object or `undefined`, depending on strict mode.

```js
function foo() {
    console.log( this.a );
}

var obj = {
    a: 2,
    foo: foo
};

var bar = obj.foo; // function reference/alias!

var a = "oops, global"; // `a` also property on global object

obj.foo();  //  2
bar();      // "oops, global" or undefined (in node) | we lost `this` :(
```

Even though `bar` appears to be a reference to `obj.foo`, in fact, it's really just another reference to foo itself. Moreover, the call-site is what matters, and the call-site is bar(), which is a plain, un-decorated call and thus the default binding applies.

The more subtle, more common, and more unexpected way this occurs is when we consider passing a callback function:

```js
function foo() {
    console.log( this.a );
}

function doFoo(fn) {
    //  ... do some things here, usually asynchronous stuff
    // `fn` is just another reference to `foo`
    fn(); // <-- call-site!
}

var obj = {
    a: 2,
    foo: foo
};

var a = "oops, global"; // `a` also property on global object

doFoo( obj.foo ); // "oops, global" or undefined (in node)
```

How to resolve it and still maintain a "context"?

One way you can go about this is to modify the context as we learned earlier. Consider the same code earlier, but this time, we explicitly `bind` the `obj` to the function.

```js
function foo() {
    console.log( this.a );
}

function doFoo(fn) {
    //  ... do some things here, usually asynchronous stuff
    // `fn` is just another reference to `foo`
    fn(); // <-- call-site!
}

var obj = {
    a: 2,
    foo: foo
};

var a = "oops, global"; // `a` also property on global object

doFoo( foo.bind(obj) ); // 2 | yey
```

What we just did, is what we call __"Explicit Binding"__.

#### Explicit Binding

This is if you want to force a function call to use a particular object for the this binding, without putting a property function reference on the object (like what we do in implicit binding).


```js
function foo() {
    console.log(this.bar);
}

foo.call({ bar: 'using call' });
foo.apply({ bar: 'using apply' });
foo.bind({ bar: 'using bind' })();  //  notice that we have to call foo first by adding ()
```

### __Note: `apply()` vs `call()`__

While the syntax of `call()` function is almost identical to that of `apply()`, the fundamental difference is that `call()` accepts an __argument list__, while `apply()` accepts a __single array of arguments__.

Example using `call()`:

```js
function Product(name, price) {
    this.name = name;
    this.price = price;
}

function Food(name, price) {
    Product.call(this, name, price);
    this.category = 'food';
}

console.log(new Food('cheese', 5).name);
```

Example using `apply()`:

```js
var numbers = [5, 6, 2, 3, 7];

var max = Math.max.apply(null, numbers);

console.log(max);
// expected output: 7

var min = Math.min.apply(null, numbers);

console.log(min);
// expected output: 2
```

Note: if you ever did jQuery and wondered how the `this` keyword is pointing to the button or element when an `onClick` event is set to it, this is what jQuery does under the hood. Manually setting the context to replace what the `this` keyword represents.

#### `new` Binding

The fourth and final rule for `this` binding requires us to re-think a very common misconception about functions and objects in JavaScript.

In traditional class-oriented languages, "constructors" are special methods attached to classes, that when the class is instantiated with a `new` operator, the constructor of that class is called. This usually looks something like:

```js
something = new MyClass(..);
```

JavaScript has a `new` operator, and the code pattern to use it looks basically identical to what we see in those class-oriented languages; most developers assume that JavaScript's mechanism is doing something similar. However, there really is no connection to class-oriented functionality implied by `new` usage in JS.

First, let's re-define what a "constructor" in JavaScript is. In JS, constructors are __just functions__ that happen to be called with the `new` operator in front of them. They are not attached to classes, nor are they instantiating a class. They are not even special types of functions. They're just regular functions that are, in essence, hijacked by the use of `new` in their invocation.

Consider this code:

```js
function foo(a) {
    this.a = a;
}

var bar = new foo( 2 );
console.log( bar.a ); // 2
```

By calling `foo(..)` with new in front of it, we've constructed a new object and set that new object as the `this` for the call of `foo(..)`. __So `new` is the final way that a function call's `this` can be bound.__ We'll call this `new` binding.

### Order of Precedence

So, now we've uncovered the 4 rules for binding `this` in function calls. All you need to do is find the call-site and inspect it to see which rule applies. But, what if the call-site has multiple eligible rules? There must be an order of precedence to these rules, and so we will next demonstrate what order to apply the rules.

We can summarize the rules for determining `this` from a function call's call-site, in their order of precedence. Ask these questions in this order, and stop when the first rule applies.

1. Is the function called with new (new binding)? If so, this is the newly constructed object.

```js
    var bar = new foo()
```

2. Is the function called with call or apply (explicit binding), even hidden inside a bind hard binding? If so, this is the explicitly specified object.

```js
    var bar = foo.call( obj2 )
```

3. Is the function called with a context (implicit binding), otherwise known as an owning or containing object? If so, this is that context object.

```js
    var bar = obj1.foo()
```

4. Otherwise, default the this (default binding). If in strict mode, pick undefined, otherwise pick the global object.

```js
    var bar = foo()
```

### Binding Exceptions

As usual, there are some exceptions to the "rules".

The `this`-binding behavior can in some scenarios be surprising, where you intended a different binding but you end up with binding behavior from the default binding rule (see previous).

#### Ignored `this`

If you pass null or undefined as a this binding parameter to call apply, or bind, those values are effectively ignored, and instead the default binding rule applies to the invocation.

```js
function foo() {
    console.log( this.a );
}

var a = 2;

foo.call( null ); // 2
```

Why would you intentionally pass something like `null` for a `this` binding?

It's quite common to use `apply(..)` for spreading out arrays of values as parameters to a function call. Similarly, `bind(..)` can curry parameters (pre-set values), which can be very helpful.

```js
function foo(a, b) {
    console.log( "a:" + a + ", b:" + b );
}

// spreading out array as parameters
foo.apply( null, [2, 3] ); // a:2, b:3

// currying with `bind(..)`
var bar = foo.bind( null, 2 );
bar( 3 ); // a:2, b:3
```

In otherwords, you may encounter code like this in legacy systems (pre-ES6) because in ES6, there's a better way to do this which is to use the spread operator `...` (more on this on ES5 section). Or in `bind`'s case, do currying (higher order functions).

## Review

Determining the this binding for an executing function requires finding the direct call-site of that function. Once examined, four rules can be applied to the call-site, in this order of precedence:

1. Called with `new`? Use the newly constructed object.
2. Called with `call` or `apply` (or `bind`)? Use the specified object.
3. Called with a context object owning the call? Use that context object.
4. Default: `undefined` in `strict mode`, global object otherwise.

Now move on to the next topic [Prototypes & Closures](/modules/js-basics/prototypes-closures.md)