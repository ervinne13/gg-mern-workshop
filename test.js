
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

console.log(JSON.stringify(cart));