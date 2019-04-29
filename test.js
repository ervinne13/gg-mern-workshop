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