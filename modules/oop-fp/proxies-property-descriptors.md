# Combining Proxies & Property Descriptors

If ever you need to, you may combine both property descriptors and proxies.

One thing that you should note though, is that even if you use the `defineProperty` first, proxies will still be evaluated first.

```js
const orig = {};

Object.defineProperty(orig, 'name', {
    get: () => {
        console.log('2. prop desc get');
        return 'Ervinne';
    }
});

const proxy = new Proxy(orig, {
    get: (target, prop) => {
        console.log('1. proxy get');
        return target[prop];
    }
});

console.log(`3. ${proxy.name}`); // 1. proxy get
                                 // 2. prop desc get
                                 // 3. Ervinne
```

In this example we’re using both the `get` property descriptor applied to our `orig` object, as well as the `get` proxy trap with the `orig` object being the target. When we attempt to read the `name` property it first calls the proxy trap, then calls the property descriptor, before returning the actual value the calling location.

Of course, there will be some __performance overhead__ for calling these functions when getting a value from an object, not to mention __cognitive overhead__ to figure out what’s going on, so use them sparingly in production applications.