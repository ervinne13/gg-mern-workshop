# JavaScript Fundamentals

The instructor will only scratch through things in programming that you should already know like control structures, conditionals, etc. __The workshop will focus more on things that are usually taken for granted by a lot of developers (juniors and seniors alike).__

## Values & Types: How Variables are Stored

There are two types of variables in JavaScript; primitives and complex types. Distinction between the two because primitive types are stored as __"values"__ while complex types are stored by __"reference"__.

### Primitive Types

The following are primitive types in JavaScript:

- `string`
- `number`
- `boolean`
- `null` and `undefined`
- `object`
- `symbol` (new to ES6)

Primitive types are stored by value, this means that if you pass a variable with primitive value in a function and modified it inside, the original variable will not be affected.

#### Activity: Demonstrate passing by values:

```js
var test = "original value";

var mutate = function(test) {
    test = "new value";
    return test;
};

console.log(mutate(test));  //  new value
console.log(test);          //  original value
```

JavaScript provides a `typeof` operator that can examine a value and tell you what type it is:

```js
var a;
typeof a;				// "undefined"

a = "hello world";
typeof a;				// "string"

a = 42;
typeof a;				// "number"

a = true;
typeof a;				// "boolean"

a = null;
typeof a;				// "object" -- weird, bug

a = undefined;
typeof a;				// "undefined"

a = { b: "c" };
typeof a;				// "object"
```

The return value from the typeof operator is always one of six (seven as of ES6! - the "`symbol`" type) string values. That is, `typeof "abc"` returns `"string"`, not `string`.

Notice how in this snippet the a variable holds every different type of value, and that despite appearances, `typeof a` is not asking for the "type of `a`", but rather for the "type of the value currently in `a`." More on this later in the "Typed Values vs Typed Variables" section.

### Complex Types

Complex types can be any of the following:

- Objects
- Arrays
- Functions

... all of which are stored as reference. This means, unlike value types, mutating inside a function will result in the original variable being mutated as well.

#### Activity: Demonstrate passing by reference

```js
var test = {};

var mutate = function(test) {
    test.key = "added value"
    return test;
};

console.log(mutate(test));  //  { key: 'added value' }
console.log(test);          //  { key: 'added value' }
```

You should note that mutating and assigning are two different things. When you mutate a variable, it finds the object it's referencing and mutates that object. However, if you assigned a new object to a variable, it will change its reference effectively cutting ties with the old reference.

Consider the script below:

```js
var test = {};

var mutate = function(test) {
    test = { key: "added value" };
    return test;
};

console.log(mutate(test));  //  { key: 'added value' }
console.log(test);          //  {}
```

### Typed Values vs Typed Variables

Probably the first thing you would notice when comparing JavaScript with other languages is that JavaScript is very "dynamic".

Take the example below which is written in Java:

```java
public class HelloWorld {
    public static void main(String[] args) {
        int age = 20;
        String name = "Ervinne Sodusta"
    }
}
```

This demonstrates __"Typed Variables"__. Trying to assign a different type to `age` with `age = "twenty"` will result in an error because the types in Java reside in the variable where we put values in.

... on the other hand, JavaScript has __"Typed Values"__. Consider the script below:

```js
var age = 13;
var name = "Ervinne Sodusta";
```

... even if we change the types of the values, it will not result in an error. __A variable in JavaScript is only a container__ and does not have types. JavaScript has __"Typed Values"__ instead where the typing reside in the RHS or right hand side (of the = operator).

### Polymorphic by Default

Typed values are also the reason why you can write `arrays` with varying types (because again, typing in JS is in the values):

```js
var obj = { my: "object" };
var list = [ 1, "hello", true, obj ];
```

`Arrays` in JavaScript is polymorphic by default.

### Enforcement vs Freedom

Typed variables (like in Java) is __*"enforcing"*__ while typed values are very dynamic, which gives more __*"freedom"*__.

Generally, enforcement is good (oftentimes better). Having enforced code means that you don't have to do *defensive programming*

Consider the code below written in JavaScript:

```js
var age = 13;

if (typeof age === 'number') {
    //  ... do this
} else {
    //  throw some exception
}
```

Whereas the same thing can be achieved in strongly typed languages in 1 line right in the assignment statement.

### Type Enforcement in JavaScript

You have the option to implement your code in `TypeScript` which enables you to have the best of both worlds of dynamic and strongly typed languages.

In React, you may also use something called `PropTypes`.

### Segue: Immutability & Constants

Note that declaring your variables as `const` (es6, more on this later) does not make it immutable.

Immutability is different, immutability is not being able to "mutate" the object in question. There is no immutability support in JavaScript natively but you may use external libaries if you wanted to support Immutability (more on this later in advance JS topics).

Consider the code below:

```js
const age = 20;
age = 21;

//  BUT

const customer = { age: 20 };
customer.age = 21; // valid
```

Again, note that objects in JavaScript are not immutable so __unless you really have a good reason, don't declare complex types as constants as it will confuse you.__

![](https://cdn-images-1.medium.com/max/600/1*DgkLOiPBH95QmZiHDx47Tw.png)

"JavaScript is very flexible, it means that any object can be transformed on the fly into something really different.

In one line it can be an object representing a dog, and in the next line the dog can be mutated into a chicken. Such situation enhances fears about state shape and code predictability."

- [The state of Immutability (in JavaScript)](https://medium.com/dailyjs/the-state-of-immutability-169d2cd11310)

__"Mutability and lack of type assurance instills fear about state
shape and code predictability"__

__You need to have double the effort to make the code predictable,
side effect free, and less prone to defect.__

(That’s why we’re learning these now today)

### Built-in Type Methods

Types in JavaScript are internally wrapped in objects behind the scenes, this is why JavaScript values have their own "built-in type methods"

Consider the code below:

```js
var a = "hello world";
var b = 3.14159;

a.length;           // 11
a.toUpperCase();    // "HELLO WORLD"
b.toFixed(4);       // "3.1416"
```

Under the hood, JavaScript does something like:

```js
String(a).length;
String(a).toUpperCase();
Number(b).toFixed(4);
```

That's why such methods/functions are available even if the types are primitive.

__WARNING!!__

Again, due to the __lack of type enforcement__, you'll be forced to do defensive programming for built in methods. Otherwise, you're prone to errors like `toFixed is not a function`.

```js
var a = 3.14159;
//  ... some other code here that can span several lines
a = "hello world";  // suddently, type changed!

//  Uncaught TypeError: a.toFixed is not a function
a.toFixed(4);
```

## Javascript Quirks

Before we discuss type coercion and similar features, watch Brian Leroux talk in WTFJS on: [Youtube Link](https://www.youtube.com/watch?v=et8xNAc2ic8&t=974s).

JavaScript can be confusing (but it shouldn't be), many of the confusion comes from coersion, watch this video to know what are the things you should avoid. The next portions of this workshop will try to cover these quirks.

## Type Coercion

Coercion comes in two forms in JavaScript: *explicit* and *implicit*. Explicit coercion is simply that you can see obviously from the code that a conversion from one type to another will occur, whereas implicit coercion is when the type conversion can happen as more of a non-obvious side effect of some other operation.

You've probably heard sentiments like "coercion is evil" drawn from the fact that there are clearly places where coercion can produce some surprising results. Perhaps nothing evokes frustration from developers more than when the language surprises them.

Coercion is not evil, nor does it have to be surprising. In fact, the majority of cases you can construct with type coercion are quite sensible and understandable, and can even be used to improve the readability of your code. But we won't go much further into that debate.

Here's an example of explicit coercion:

```js
var a = "42";

var b = Number( a );

a; // "42"
b; // 42 -- the number!
```

And here's an example of implicit coercion:

```js
var a = "42";
var b = a * 1;	// "42" implicitly coerced to 42 here

a; // "42"
b; // 42 -- the number!
```

__Testing for Equality__

```js
var a = "42";
var b = 42;

a == b;     // true
a === b;    // false
```

### Loose and Strict Equality

With loose equality `==` or non-equality `!=` JS notices that the types do not match, so it goes through an ordered series
of steps to coerce one or both values to a different type until the types
match, where then a simple value equality can be checked.

Use the following points as your guideline on when to use loose or strict equality:

- If either value (aka side) in a comparison could be
the true or false value, avoid == and use ===.

- If either value in a comparison could be one of these specific values
(0, "", or [] -- empty array), avoid == and use ===.

- In all other cases, you're safe to use ==. Not only is it safe, but in many
cases it simplifies your code in a way that improves readability.


### Truthy & Falsy

Values can be "truthy" or "falsy" by nature: when a non-`boolean` value is coerced to a `boolean`, does it become `true` or `false`, respectively?

The specific list of "falsy" values in JavaScript is as follows:

- `""` (empty string)
- `0`, `-0`, `NaN` (invalid `number`)
- `null`, `undefined`
- `false`

Any value that's not on this "falsy" list is "truthy." Here are some examples of those:

- `"hello"`
- `42`
- `true`
- `[ ]`, `[ 1, "2", 3 ]` (arrays)
- `{ }`, `{ a: 42 }` (objects)
- `function foo() { .. }` (functions)

It's important to remember that a non-`boolean` value only follows this "truthy"/"falsy" coercion if it's actually coerced to a `boolean`. It's not all that difficult to confuse yourself with a situation that seems like it's coercing a value to a `boolean` when it's not.

### Complex Types & Equality

Complex types are checked for equality in reference, not the actual values;

__Comparing values:__
```js
var a = [ 1, 2, 3 ];
var b = [ 1, 2, 3 ];

a == b; //  false
```

__Comparing references:__

```js
var a = [ 1, 2, 3 ];
var b = a;

a == b; // true
```

__BUT!__ Arrays are quite different when they are coerced.

For example:

```js
var a = [ 1, 2, 3 ];
var b = [ 1, 2, 3 ];
var c = "1,2,3";

a == b; //  false

a == c; //  true
b == c; //  true
```

This happens because the value/array `[ 1, 2, 3 ]` is being coerced into a comma separated string `"1,2,3"` before performing the non strict equality test.

### Inequality 

The <, >, <=, and >= operators are used for inequality, referred to in the
specification as "relational comparison".

```js
var a = 41;
var b = "42";
var c = "43";

a < b;  // true
b < c;  // true
//  >= and <= can also be used
```

What happens here? In section 11.8.5 of the ES5 specification, it says that if both values in the `<` comparison are strings, as it is with `b < c`, the comparison is made lexicographically (aka alphabetically like a dictionary). But if one or both is not a string, as it is with `a < b`, then both values are coerced to be numbers, and a typical numeric comparison occurs.

Notably, there are no "strict inquality" operators that would disallow coercion the same way `===` strict equality does.

### Lexicographical Comparison

Lexicographical order is alphabetical order preceded by a length comparison.
That is to say, a string `a` is lexicographically smaller than a string `b`

- if the length of `a` is smaller than the length of `b`, or
- else they are of the same length and `a` is alphabetically smaller than `b`.

```js
var a = "ab";
var b = "ac";

a < b;  // true
a > b;  // false
a == b; // false
```

Question: what do you think happens in the following code?:

```js
var a = 42;
var b = "foo";

a < b;      // false
a > b;      // false
a == b;     // false
```

You should notice that `a < b` is false, but what's weird is that `a > b` is also false!
This is because the string `"foo"` is being coerced into `NaN` where JavaScript now cannot really determine whether 42 is greater than or less than `NaN` because `NaN` can be anything but a number.

## Variables

In JavaScript, variable names (including function names) must be valid identifiers. The strict and complete rules for valid characters in identifiers are a little complex when you consider nontraditional characters such as Unicode. If you only consider typical ASCII alphanumeric characters though, the rules are simple.

### Variables in Different Scopes

There can be two types of `scope`, a function scope or a block scope. Variables' accessibility can behave differently depending on the current scope it's in.

```js
function foo() {
    //  function scope
}

{
    //  block scope
}
```

A variable declared inside a scope can only be accessed inside that scope or the scopes below. An exception would be if that variable is declared using `var` in block scopes (more on this later).

For example

```js
var a = "hello";

function foo() {
    console.log(a); //  hello
}
```

... but

```js
function foo() {
    var a = "hello";    
}

a; // ReferenceError: a is not defined
```

### Variables in Block Scopes

We've mentioned earlier that `var` declarations can "leak" outside of 

```js
for (var i = 0; i < 10; i ++) {
    var b = 1;
}

console.log(i); //  10
console.log(b); //  1
```

Notice that both `i` and `b` are already outside of their scope (block) yet they are still accessible. To "resolve" this simply replacing the declaration with `let` would do.

```js
for (let i = 0; i < 10; i ++) {
    let b = 1;
}

console.log(i); //  ReferenceError: i is not defined
console.log(b); //  Same here if you comment out above
```

In retrospect: __always prefer `let` over `var`__ You should only really use variables that are defined in your current scope. Doing otherwise will create confusion and risk mistakes.

For your reference, nesting of scopes goes like this:

![nested scopes](https://www.datchley.name/content/images/2015/08/js-es5-scope-2.png)

### Hoisting

Think of hoisting as basically putting declarations to the top of the current scope regardless of where they are declared inside that scope. Note that in ES6, some syntax of declaration will prevent hoisting.

```js
var a = 2;

foo();  // works because `foo()` declaration is "hoisted"

function foo() {
    b = 3;
    console.log(b); //  3
    var b;  // declaration is "hoisted" to the top of `foo()` but still inside
}

console.log(a); //  2
console.log(b); // ReferenceError: b is not defined
                //  This is because b is only hoisted inside the scope of `foo()`
```

__Warning!__ It's not common or a good idea to rely on variable hoisting to use a variable earlier in its scope than its var declaration appears; it can be quite confusing. ​

It's much more common and accepted to use hoisted function declarations, as we do with the foo() call appearing before its formal declaration. ​

(Later on though, we'll be defying this warning when we do an activity. More explanation later.)

Before moving on to the next topic, you might want to take a short break as we will now tackle one of the most problematic and often misunderstood areas in JavaScript. The `this` keyword.

[Click here](/modules/js-basics/mastering-this-keyword.md) when you're ready
