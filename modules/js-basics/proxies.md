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

Object Keys Proxy Trap

TODO: https://medium.com/intrinsic/javascript-object-property-descriptors-proxies-and-preventing-extension-1e1907aa9d10