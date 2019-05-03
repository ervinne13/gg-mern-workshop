# JavaScript Property Descriptors

## Enumerating Properties

Have you ever been told that adding a method to an object’s prototype is a bad practice, because that property will now be present in for...in loops? Or that you always need to use Object#hasOwnProperty() when enumerating properties?

Example:

```js
let badObj = { foo1: 1, foo2: 2 };
badObj.__proto__.bar = () => { console.log('soap'); }

console.log(badObj);    // prints { foo1: 1, foo2: 2 } | Good!
for (const key in badObj) {
    console.log(key); // prints all foo1, foo2, and bar | Bad!
}

//  "Fix":
for (const key in badObj) {
    if (badObj.hasOwnProperty(key)) {
        console.log(key); // prints all foo1, foo2 | Good!
    }    
}
```

The "Fix" looks bad though, we're forcing the client to do defensive programming with `hasOwnProperty` checks. Using `property descriptors` can help us with this.

Note that defining `bar` directly on `badObj` is worse as we'll now have to check if property is a function type instead of using `hasOwnProperty`.

## Property Descriptors

__*Property descriptors let you lie*__. If you think about the intuitive basics of an object, it’s that you can write a property to an object, and then read that property back, and nothing crazy should happen. Well, with property descriptors, one could modify the value when it’s being written, reply with a different value when being retrieved, or even throw an error at any point in time. The basic syntax for defining a property descriptor looks like the following:

```js
Object.defineProperty(
  obj,
  propertyName,
  descriptors
)
```

In this example, `obj` is an Object which you want to define a property on. `propertyName` is a string name of the property. Finally, `descriptors` is an object describing the property descriptors. Let’s now take a look at the different types of descriptors which can be set.

### Value and Enumerable

The most basic property descriptors are `value` and `enumerable`. `value` contains the value which will be returned when the property is being read. `enumerable` determines whether or not the property will be visible when listing the properties of the object. Here’s a code sample using these two property descriptors:

```js
const bar = () => { console.log('soap'); };
const barPropertyDescriptor = { value: bar, enumerable: false };

let goodObj = { foo1: 1, foo2: 2 }
Object.defineProperty(goodObj, 'bar', barPropertyDescriptor);

console.log(goodObj); // prints { foo1: 1, foo2: 2 } | Good!
for (const key in goodObj) {
    console.log(key); // prints all foo1, foo2 | Good!
}

goodObj.bar();  // prints soap | Good! Bar is "partially invisible" but it can still be used
```

Property descriptors are not limited to functions, they describe properties after all. With this, you could simulate partially private properties as well. Note that they can still be accessed anyway so there's not much benefit to it if used in this manner.

You may also define the descriptors after a key is set in the object like so:

```js
const obj = { foo: 1, _bar: 'soap' };
Object.defineProperty(obj, '_bar', { enumerable: false });
console.log(obj);   // { foo: 1 }
console.log(obj._bar);  // soap
```

Of course, setting the value in define property overrides the old value of the property.

```js
const obj = { foo: 1, _bar: 'soap' };
Object.defineProperty(obj, '_bar', { enumerable: false, value: 'dove' });
console.log(obj);   // { foo: 1 }
console.log(obj._bar);  // dove
```

### Cloning Non Enumerable Properties

You've probably guessed it, but if you try to clone by spreading an object, any non enumerable properties will be ignored and wont be copied to the clone object. Consider the example below:

```js
const obj = { foo: 1 };
Object.defineProperty(obj, 'bar', {
    value: 'Hello',
    enumerable: false
});

const objClone = { ...obj }; // cloning with spread wont include non enumerables

console.log(obj.foo);   // 1
console.log(obj.bar);   // Hello

console.log(objClone.foo);  // 1
console.log(objClone.bar);  // undefined
```

Aside from ability to select keys to clone, this will also affect when you stringify your json object. This means that responses from Node + Express will not include non enumerable properties.

```js
const obj = { foo: 1, _bar: 'soap' };
Object.defineProperty(obj, '_bar', { enumerable: false });
console.log(JSON.stringify(obj));   // "{\"foo\":1}"
console.log(obj._bar);  // soap
```

### Writable & Configurable

If a property has `writable` set to `false` then that property’s value cannot be reassigned another value. If a property has `configurable` set to `false` then it cannot be deleted and it cannot have its property descriptor changed again. The following code example shows these two property descriptors at work:

```js
let obj = {};
Object.defineProperty(obj, 'foo', {
    value: 'hello',
    writable: false,
    configurable: false
});

obj.foo = 'bye';
console.log(obj.foo); // hello

delete obj.foo;
console.log(obj.foo); // hello

Object.defineProperty(obj, 'foo', {
  value: 'bye'
}); // TypeError: Cannot redefine property: foo

```

The biggest benefit to this is that we now enable a `certain degree of immutability` to our objects! Which is a very valueable thing to have especially if you practice `domain driven design` or just `pure functions`.

### Getters and Setters

These allow us to call functions which we define when reading or writing to an object. These are powerful tools with security and performance considerations. The following is an example of the `get` and `set` property descriptors:

```js
let person = { _age: 0 }

Object.defineProperty(person, 'age', {
    get: function() {
        return this._age
    },
    set: function(value) {
        if (isNaN(value)) {
            throw new TypeError(`Invalid age ${value}`);
        }
        this._age = Number(value)
    }
});

console.log(person.age); // 0
person.age = '26';
console.log(person.age); // 26
person.age = 'chickenjoy'; // TypeError: Invalid age chickenjoy
```

You'll notice a very powerful implementation here, we can embed validation directly in our objects! This means we don't have to call an external validator function like:

```js
// not very desirable
let person = { age: 5 };
person.age = 'chickenjoy';

validatePerson(person); // TypeError: Invalid age chickenjoy
```

This generates a problem though. Logging `person` would result in:

```js
// oh no
console.log(person);    // { _age: 0 }
```

What you can do is define `age` as enumerable and `_age` as not.

```js
let person = { _age: 0 }

Object.defineProperty(person, '_age', { enumerable: false })
Object.defineProperty(person, 'age', {
    enumerable: true,
    get: function() {
        return this._age
    },
    set: function(value) {
        if (isNaN(value)) {
            throw new TypeError(`Invalid age ${value}`);
        }
        this._age = Number(value)
    }
});

person.age = '26';
console.log(person);                    //  { age: [Getter/Setter] }
console.log({ ...person });             //  { age: 26 }
console.log(JSON.stringify(person));    //  "{\"age\":26}"
```

You'll likely to use this a lot if you're like the instructor that prefers putting validation right in the objects. If yes, you may use the following function `applyValidatorWhenSettingPropertyOfObject` or it's `piped version` in your projects:

```js

//  ==========================================
//  Utility library

const applyValidatorWhenSettingPropertyOfObject = (validator, property, obj) => {
    const _property = `_${property}`;

    obj[_property] = null;
    Object.defineProperty(obj, _property, { enumerable: false });
    Object.defineProperty(obj, property, {
        get: function() {
            return this[_property];
        },
        set: function(value) {
            validator({ ...this });
            this[_property] = value;
        }
    });
};

//  Optional, piping for better readability when passing arguments
const applyValidator = (validator) => {
    return { 
        whenSettingProperty: (property) => { 
            return { 
                ofObject: (obj) => { applyValidatorWhenSettingPropertyOfObject(
                        validator, 
                        property, 
                        obj
                    ) }
            }
        }
    };
};

//  End of utility library
//  ==========================================

const person = { age: 0 };
const validatePersonAgeIsNumber = (person) => {
    if (isNaN(person.age)) {
        throw new TypeError(`Invalid age ${person.age}`);
    }
};

//  normal, not very readable due to long name and multiple arguments
applyValidatorWhenSettingPropertyOfObject(validatePersonAgeIsNumber, 'age', person);

//  piped, better readability (arguable)
applyValidator(validatePersonAgeIsNumber)
    .whenSettingProperty('age')
    .ofObject(person);

person.age = 26;
console.log(person.age);                //  26
console.log(person);                    //  { age: [Getter/Setter] }
console.log(JSON.stringify(person));    //  "{\"age\":26}"
```

__CAUTION!__ Of course, manually setting `_age` will bypass our validation so when you use this approach, DO NOT edit the supposedly private variable manually unless you really intend to bypass validations.

### All Object Properties have Property Descriptors

Every object property has a property descriptor, even if we don’t set one using the `Object.defineProperty()` method. We can use another method, `Object.getOwnPropertyDescriptor()`, to read a property descriptor. The different methods of adding properties to objects will result in different default values (which is why the object literal getter/setter in the previous example differs from the one before it).

Example:

```js
const obj1 = {
  a: 1
}

console.log(Object.getOwnPropertyDescriptor(obj1, 'a'))

// Prints out:
// {
//   value: 1,
//   writable: true,
//   enumerable: true,
//   configurable: true
// }
```

## Pop Quiz!

Now that you’re familiar with property descriptors, let’s take a look at a situation one might encounter once you use (abuse) this feature. This is an example of the many kinds of situations our product Intrinsic protects against:

What code could lead to this outcome?
```js
if (typeof obj.p === 'number' && obj.p > 10) {
    console.log(obj.p) // outputs the string 'lies!'
}
```

In this example we have an `if` statement. This statement checks to see if `obj.p` is a number, and it also checks to see if `obj.p` is greater than `10`. If both of these situations are `true` then we run the body of the `if` statement which is to print the value. However, when we print the value, we receive a string of `'lies!'` instead! Can you think of why this may happen?

Answer (and prevention) [here](/modules/oop-fp/property-descriptors-quiz-answer.md)