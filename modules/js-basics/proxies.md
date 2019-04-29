# Proxies

If property descriptors let you lie, then *proxies let you lie in fun and imaginative ways!* A proxy is essentially a new object which can be used as an intermediary for intercepting calls to an existing `target` object. Much like with property descriptors, proxies can be defined by using an object with key/value pairs where the key is the name of the “proxy Trap”, and the value is a method to be called when interacting with the proxy.

There are about a dozen proxy Traps, and if a trap has not been defined then the operation will fall back to performing the default behavior. For example, one of the traps is for getting a value. If you attempt to get a value from a proxy and haven’t specified the `get` trap, then the proxy will simply retrieve the value from the `target` object.

Proxy Traps will typically have a correlating `Reflect` method. For example, the has trap `has` a correlating `Reflect.has()` method.

The basic syntax for defining proxy traps looks like the following:

```js
const proxy = new Proxy(target, handler);
```

Of course, if you interact with the original target object, the proxy traps will be bypassed entirely.

Proxies can be quite useful for writing test code, where you want to assert that very exact operations are being performed on objects.

## Get Proxy Trap

The `get` proxy trap is pretty similar to the getter property descriptor in that both of these can be used to call a function when retrieving a value from an object. However, the `get` proxy trap is much more powerful. Whereas the property descriptor getter needs to know the name of a property ahead of time, the `get` proxy trap will be called regardless of the name of the property being accessed. __It will even fire if the property doesn’t exist at all!__

```js
const orig = { p: 7 };
const handler = {
    get: (target, prop, receiver) => {
        // target === orig
        // receiver === proxy || receiver === child
        return prop in target ? target[prop] + 1 : Infinity;
    }
};

const proxy = new Proxy(orig, handler)
console.log(orig.p);    // 7
console.log(orig.r);    // undefined
console.log(proxy.p);   // 8
console.log(proxy.r);   // Infinity
```

In the above example the `get` proxy trap will check to see if the `prop` property exists in the `target` object. If it does it will return an incremented version of the value. If it does not it will return `Infinity`.

## Has Proxy Trap

The `has` proxy trap is called when code attempts to see if a property exists within an object.

```js
const orig = { p: 7 };
const handler = {
    has: (target, prop) => {
        return false;
    }
};

const proxy = new Proxy(orig, handler);
console.log('p' in orig); // true
console.log('r' in orig); // false
console.log('p' in proxy); // false
console.log(Reflect.has(proxy, 'p')); // false
console.log(proxy.p); // 7
```

In this example we always reply with a `false`, which will make it difficult to tell if a property exists within an object.

## Set Proxy Trap

The `set` proxy trap is called when a value is being set on an object. Much like the benefits of the `get` proxy trap over the getter property descriptor, this method is called for every single property being set on an object, even if you don’t know the name ahead of time.

```js
const orig = {};
const handler = {
    set: (target, prop, value, receiver) => {
        target[prop.toUpperCase()] = String(value)
    }
};
const proxy = new Proxy(orig, handler);

orig.p = 1;
console.log(orig);   // { p: 1 }
proxy.hello = 1;
console.log(orig);   // { p: 1, HELLO: '1' }    proxies affect the original object when setting
console.log(proxy);  // { p: 1, HELLO: '1' }
```

In this example we will intercept the setting of values. We then uppercase the property name, and stringify the value, before setting it on the underlying object.

## Delete Proxy Trap

The `delete` proxy trap is called when a property is being deleted from an object.

```js
const orig = { p: 1, r: 2 };
const handler = {
    deleteProperty: (target, prop) => {
        //  only allow deletion of the 'r' property and nothing lese
        if (prop === 'r') delete target[prop]
        return true; // falsey will throw in strict
    }
};
const proxy = new Proxy(orig, handler);

delete proxy.p;
delete proxy.r;
console.log(orig);  // { p: 1 } like set, will affect the original object as well
console.log(proxy); // { p: 1 }
```

In this example we only allow the delete to affect the underlying `target` object if the property name is exactly `'r'`. So, when deleting `proxy.p`, the operation has no effect, but when deleting `proxy.r`, the property is removed.


__WARNING! As you've noticed, both `set` and `delete` traps generate side effects. This is something that you need to be aware of when doing FP as you should be avoiding side effects.__

## Object Keys Proxy Trap

The `ownKeys` proxy trap is called when we attempt to list the keys within an object. It’s triggered in a variety of ways, such as running `Object.keys()`, `Reflect.ownKeys()`, `for (prop in obj)`, etc., on an object.

```js
const sym = Symbol();
const orig = { p: 1, r: 2, [sym]: 3 };
const handler = { ownKeys: (target) => ['p', sym] };
const proxy = new Proxy(orig, handler);

console.log(Object.keys(proxy));                     // ['p']
console.log(Reflect.ownKeys(proxy));                 // ['p', sym]
console.log(Object.getOwnPropertyNames(proxy);)      // ['p']
console.log(Object.getOwnPropertySymbols(proxy));    // [sym]
```

## Apply Proxy Trap

The `apply` proxy trap is called when a function is called. The second argument is the value of `this` when the function is called. Arguments to the function are provided as the third argument in an array.

```js
function orig(msg) {
    return `Hello, ${msg}!`
}

const handler = {
    apply: (target, self, args) => {
        return target(String(args[0]).toUpperCase());
    }
};

const proxy = new Proxy(orig, handler);
console.log(orig('world')); // 'Hello, world!'
console.log(proxy('world')); // 'Hello, WORLD!'
// Also, Function.prototype.apply(), .call()
```

In this example we intercept the function call, capitalize the first argument, and pass that to the underlying `target` function.

## Construct Proxy Trap

The `construct` proxy trap is very similar to the apply proxy trap. However, it is specifically called when the `new` keyword is being provided.

```js
class Original {
    constructor(arg) {
        console.log(`Hello, ${arg}!`);
    }
}

const handler = {
    construct(target, args) {
        return new target(String(args[0]).toUpperCase());
    }
};

const OriginalProxy = new Proxy(Original, handler);
new OriginalProxy('Tom'); // 'Hello, TOM!'
```

In this example we also take the first argument, capitalize it, and then provide it to the underlying constructor function. Note that this works with any `function`, not just those defined using the `class` keyword.

## Get/Set Prototype Proxy Traps

The `getPrototypeOf`, and `setPrototypeOf` proxy traps are called when attempting to access the prototype or when trying to override the prototype, respectively.

```js
const orig = {};
const handler = {
    getPrototypeOf: (target) => null,
    setPrototypeOf: (target, proto) => {
        throw new Error('__proto__ overwriting is not allowed');
    }
};

const proxy = new Proxy(orig, handler);

console.log(orig.__proto__);                // {}
console.log(proxy.__proto__);               // null
console.log(Object.getPrototypeOf(proxy));  // null
console.log(Reflect.getPrototypeOf(proxy)); // null

proxy.__proto__ = {};                       // __proto__ overwriting is not allowed
Reflect.setPrototypeOf(proxy, {});          // __proto__ overwriting is not allowed
```

In the above example we’re lying whenever the prototype is accessed and saying that the value is `null`. Whenever one attempts to override the prototype we then throw an error. This can be useful for locking down an object and preventing prototype modifications.

## Extensibility Proxy Traps

The `preventExtensions` and `isExtensible` proxy traps are called when running `Object.preventExtensions()` and `Object.isExtensible()` on a proxy.

```js
const orig = {};
const handler = {
    preventExtensions: (target) => {
        //  .. you can do anything here as long as you call preventExtensions below like so:
        return Object.preventExtensions(target);
    },
    isExtensible: (target) => {
        //  .. you can do anything here as long as you call isExtensible below like so:
        return Reflect.isExtensible(target);
    }
};

const proxy = new Proxy(orig, handler);
console.log(Object.isExtensible(proxy)); // true
Object.preventExtensions(proxy);
console.log(Object.isExtensible(proxy)); // false
// Note: Can't lie, otherwise will throw Error
```

In this example we’re simply calling out to the correlating Reflect methods and returning the values. However we could also throw an error or log the access if we wanted. Note that we can’t actually lie in these situations. For example, if you call `Object.preventExtensions(proxy)`, and don’t actually prevent extensions on the `proxy` object, then JavaScript will throw an error. The same thing happens if you lie with the `isExtensible` result.

Follow along the instructor as he proves JavaScript preventing you from not calling `preventExtensions` or `isExtensible` in their respective traps.

## Property Descriptors Proxy Traps

And finally, the `defineProperty` and `getOwnPropertyDescriptor` proxy traps are called when either setting or getting a property descriptor of an object.

```js
const proxy = new Proxy({}, {
    defineProperty: (target, prop, desc) => {
        if (desc.value === 42) {
            Object.defineProperty(target, prop, desc);
        }
        
        return true;
    },
    getOwnPropertyDescriptor: (target, prop) => {
        return Object.getOwnPropertyDescriptor(target, prop);
    }
});

Object.defineProperty(proxy, 'p', { value: 42 });
Object.defineProperty(proxy, 'r', { value: 43 });   //  should not take effect

console.log(proxy.p, proxy.r); // 42, undefined

proxy.r = 43;   //  should not take effect
console.log(proxy.p, proxy.r); // 42, undefined
```

In this example we only allow the `defineProperty` proxy trap to modify a property descriptor if the value being modified is equal to `42`. When reading the property descriptors we simply trigger the default behavior. This is useful for only allowing certain property descriptor settings to be set, or enforcing that all new properties have their `configurable` property set to `false`, etc.