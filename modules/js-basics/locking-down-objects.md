# Locking Down Objects

Sealing, Preventing Extension, and Freezing allow you to lock down an object to varying degrees. Each one of these approaches has the same effect; an object will no longer be extensible, meaning that new properties cannot be added to the object. However there are small nuances which affect each approach as well.

WARNING! Objects inside locked down objects will not be affected. You will be needing something like [deep freeze](https://github.com/substack/deep-freeze) for that but performance may possibly suffer.


## Preventing Extension

An object can be prevented from being extended by calling `Object.preventExtensions()` on it. This is useful in situations where you don’t want new properties to be added to an object. Existing properties can be modified and deleted. It is the “weakest” when compared to Sealing and Freezing an object. It has a correlating `Object.isExtensible()` method to see if an object can be extended. Existing property descriptors are not modified.

```js
const obj = { p: 'first' }
Object.preventExtensions(obj)

obj.p = 'second' // OK
obj.p2 = 'new val' // fail silently, throw in strict

console.log(obj) // { p: 'second' }
console.log(Object.isExtensible(obj)) // false
console.log(Object.getOwnPropertyDescriptor(obj, 'p'))
//  { 
//      value: 'second', 
//      writable: true,
//      enumerable: true, 
//      configurable: true 
//  }
delete obj.p // works as always
```

## Sealing

An object can be sealed by calling `Object.seal()` on it. Sealing is useful in the situation where you have an object and you want it to adhere to a certain set of expectations regarding the properties it has, however you don’t necessarily want to prevent changes to those properties. Every property on a sealed object will have its `configurable` property descriptor set to `false`, however their writable PD won’t change. There is a correlating `Object.isSealed()` method to see if an object has been sealed.

```js
const obj = { p: 'first' }
Object.seal(obj)

obj.p = 'second' // OK
delete obj.p // fail silently, throw in strict
obj.p2 = 'new val' // fail silently, throw in strict

console.log(obj) // { p: 'second' }
console.log(Object.isSealed(obj)) // true
console.log(Object.getOwnPropertyDescriptor(obj, 'p'))
//  { 
//      value: 'second', 
//      writable: true,
//      enumerable: true, 
//      configurable: false 
//  }
```

## Freezing

An object can be frozen by calling `Object.freeze()` on it. This is the most extreme tool to lock down an object as no properties can be reassigned, added, or deleted. The property descriptor of each property will have both their `writable` and `configurable` values set to `false`. There is a correlating Object.isFrozen() method which will tell you if an object is frozen.

```js
const obj = { p: 'first' }
Object.freeze(obj)

obj.p = 'second' // fail silently, throw in strict
delete obj.p // fail silently, throw in strict
obj.p2 = 'new val' // fail silently, throw in strict

console.log(obj) // { p: 'first' }
console.log(Object.isFrozen(obj)) // true
console.log(Object.getOwnPropertyDescriptor(obj, 'p'))
//  { 
//      value: 'first', 
//      writable: false,
//      enumerable: true, 
//      configurable: false 
//  }
```

## Summary

Here’s a summary of the different methods for locking down objects.

![locking objects table](/img/locking-objects-table.png)

Note that `isExt` is short for `isExtensible`. reassign is whether or not a property can be assigned another value. `del` is whether or not properties can be deleted. `add` is whether or not a new property can be added.