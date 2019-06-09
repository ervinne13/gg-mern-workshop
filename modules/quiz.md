# Short Quiz


1. When "this" is used in a function, it refers to that function's scope.

- a. True
- b. False

---

2. Why is this helpful?

- a. "this" mechanism provides an elegant way of implicitly "passing along" an object reference, leading to clean API design and easy re-use.
- b. It is generally regarded as bad practice and should not be used
- c. It allows you to do things in JavaScript that you can't do without it
- d. It helps filter out less experienced JavaScript developers

---

3. What is logged to the console in the code below:

```js
function foo() {
  var a = 2;
  this.bar();
}

function bar() {
  var a = 1
  console.log( this.a );
}

foo();
```

- a. `undefined`
- b. `null`
- c. `1`
- d. `2`
---
4. What is typeof []?

- a. "array"
- b. "object"
- c. Syntax Error
- d. NaN

---

5. What is `String` in JavaScript?

- a. A class for constructing strings
- b. One of the 5 simple primitive types in JavaScript
- c. A callable object that has many properties/methods
- d. None of the above

---

6 - 10 (5. Points)

Create a simple web page created in react that showcases your profile skills, and some of your work. Upload it in `github.io`.

# Answers

1. b

Explanation
"this" can refer to many different elements depending on how the function is called.

2. a

Explanation:
The more complex your usage pattern is, the more clearly you'll see that passing context around as an explicit parameter is often messier than passing around a this context.

3. a

Explanation:
In both uses of the keyword `this`, it refers to the global object. Because there is no a in the global object, it is undefined.

4. b

Explanation:
Arrays are also a form of objects, with extra behavior. The organization of contents in arrays is slightly more structured than for general objects.

5. c

Explanation:
`strings` in JavaScript are immutable and have no properties/methods. When you run `str.length` or  `str.charAt(3)`, `str` is coerced into the object `String` which has properties `length` and method  `charAt`.

