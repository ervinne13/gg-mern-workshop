# Using (Abusing) Property Descriptors to Implement OOP

(Ab)using property descriptors can make for perfectly encapsulated behaviors in objects.

Consider an e-commerce application where we model a `Cart` object. It's total cost represented by a field `total` is the sum of all items' sub-total which is computed by `unitCost` * `qty` for each items.

```js
//  optional, but we can make use of our earlier learnings: 
//  behavior composition
const canComputeTotalCost = self => ({
    getTotalCost: () => {
        let total = 0;
        self.items.forEach(item => {
            total += item.unitCost * item.qty;
        });

        return total;
    }
});

const makeCart = () => {
    const self = {
        total: 0,
        items: []
    };

    Object.defineProperty(self, 'total', {    
        get: function() {
            return canComputeTotalCost(this).getTotalCost();
        }
    });

    return self;
};

const cart = makeCart();

cart.items.push({ unitCost: 500, qty: 2 });
console.log(cart.total);    // 1000

cart.total = 83838;         //  must not work because we omitted setter
console.log(cart.total);    // 1000
```

This will effectively make you create truly encapsulated objects that contain their own behaviors.

This is a very robust implementation, but be careful! Behavior can now be difficult to track when you do this implementation and the only clue you can get is if you log the object, the property `total` is not a value but is labeled `Getter`.

Something like:
```
{ total: [Getter], items: [ { unitCost: 500, qty: 2 } ] }
```

BUT! this wont be the case in some logging. Try changing the object to a string via `JSON.stringify`

```js
console.log(JSON.stringify(cart));  // {"total":1000,"items":[{"unitCost":500,"qty":2}]}
```

Your only clue as to how that field is being computed is now lost. Again, this is very powerful, but still have drawbacks (like everything else actually, just weight the benefits vs drawbacks).