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