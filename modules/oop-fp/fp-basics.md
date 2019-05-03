# Functional Programming, Immutability, & Pure Functions

Functional programming is a more common approach in developing React based applications especially if you also do Redux (since it pretty much requires you to do pure functions).

FP is a programming paradigm like OOP is, but this time, focused on functions instead of objects.

The biggest difference the instructor would want you to remember though is that __Functional programming is a paradigm that treats computation as the manipulation of value, and avoids changing state and mutable data.__

## Mutable and Immutable

Immutable means state cannot be modified after it is created. Mutable means state can be modified after it is created. In Javascript, primitive data types are immutable. Any object (key-value pairs, arrays, functions, objects created with the ‘new’ keyword) is mutable in Javascript, and can be modified after it is created.

Consider the code below:

```js

const num = 13; // immutable
const obj = { num: 14 };    // not immutable

//  despite being a constant, `obj` is not mutable because we can
//  mutate its members:
obj.num = 15;   //  bad for FP!

```

## Pure Functions

Pure functions are functions that do not generate side effects. For us to fully understand what these are, let's look at an impure function:

```js
//  or just someGlobalObject in NodeJS as there's no `window` there
window.someGlobalObject = { foo: 'bar' };

const impureProcess = () => {
    someGlobalObject.foo = 'baz';   //  impure | side effect
};

impureProcess();

```

### Conveyor Belt Mentality

![conveyor belt](https://cdn-images-1.medium.com/max/1600/1*HY-IGYUUf6p2nZTO6X38Rw.gif)

When building pure functions, think of these functions as parts of a conveyor belt. You take in something (the input), process it, then pass it to the next process (output).

So to fix the earlier code, we'll have something like:

```js
//  or just someGlobalObject in NodeJS as there's no `window` there
window.someGlobalObject = { foo: 'bar' };

const impureProcess = notGlobalObjectAnymore => {
    let localObj = { ...notGlobalObjectAnymore };
    localObj.foo = 'baz';
    return localObj;
};

impureProcess(someGlobalObject);
```

In this scenario, we first created a copy of the `someGlobalObject` (no represented by `notGlobalObjectAnymore` in the function). Any mutation that can happen will then only happen on the `localObj` (the copy) and the mutated object is now the output of the process.