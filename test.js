
// //  ==========================================
// //  Utility library

// const applyValidatorWhenSettingPropertyOfObject = (validator, property, obj) => {
//     const _property = `_${property}`;

//     obj[_property] = null;
//     Object.defineProperty(obj, _property, { enumerable: false });
//     Object.defineProperty(obj, property, {
//         get: function() {
//             return this[_property];
//         },
//         set: function(value) {
//             validator(value, { ...this });
//             this[_property] = value;
//         }
//     });
// };

// //  Optional, piping for better readability when passing arguments
// const applyValidator = (validator) => {
//     return { 
//         whenSettingProperty: (property) => { 
//             return { 
//                 ofObject: (obj) => { applyValidatorWhenSettingPropertyOfObject(validator, property, obj) }
//             }
//         }
//     };
// };

// //  End of utility library
// //  ==========================================

// const person = { age: 0 };
// const validatePersonAgeIsNumber = (newValue) => {    
//     if (isNaN(newValue)) {
//         throw new TypeError(`Invalid age ${newValue}`);
//     }
// };

// //  normal, not very readable due to long name and multiple arguments
// applyValidatorWhenSettingPropertyOfObject(validatePersonAgeIsNumber, 'age', person);

// //  piped, better readability (arguable)
// applyValidator(validatePersonAgeIsNumber)
//     .whenSettingProperty('age')
//     .ofObject(person);


// person.age = 26;
// // person.age = 'chickenjoy';
// console.log(person.age);                //  26
// console.log(person);                    //  { age: [Getter/Setter] }
// console.log(JSON.stringify(person));    //  "{\"age\":26}"

const cart = {    
    total: 0,
    items: []
};

Object.defineProperty(cart, 'total', {    
    get: function() {
        let total = 0;
        this.items.forEach(item => {
            total += item.unitCost * item.qty;
        })

        return total;
    },
    
});

cart.items.push({ unitCost: 500, qty: 2 });
console.log(cart.total);    // 1000

cart.total = 83838;         //  must not work because we omitted setter
console.log(cart.total);    // 1000