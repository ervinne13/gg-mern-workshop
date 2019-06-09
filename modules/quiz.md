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
