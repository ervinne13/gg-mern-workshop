
# Property Descriptors Pop Quiz

Now that you’re familiar with property descriptors, let’s take a look at a situation one might encounter once you use (abuse) this feature. This is an example of the many kinds of situations our product Intrinsic protects against:

What code could lead to this outcome?
```js
if (typeof obj.p === 'number' && obj.p > 10) {
    console.log(obj.p) // outputs the string 'lies!'
}
```

In this example we have an `if` statement. This statement checks to see if `obj.p` is a number, and it also checks to see if `obj.p` is greater than `10`. If both of these situations are `true` then we run the body of the `if` statement which is to print the value. However, when we print the value, we receive a string of `'lies!'` instead! Can you think of why this may happen?

The reason this hacan happen is when we defined a getter property descriptor on our object. This getter keeps track of the number of times it has been retrieved. By default it will respond with a number 1. However, once this value has been retrieved twice, it will then respond with a string:

```js
let accesses = 0
const obj = Object.defineProperty({}, 'p', {
    get: () => {
        if (accesses++ >= 2) {
        return 'lies!'
        }
        return 12
    }
})
```

This case scenario may be dumb but there will be similar cases when you have processes accessing the same object or have a counter like this inside your object. Remember that since we're doing object oriented programming now instead of functional where every object is pure and expected to be immutable, there will be cases like these where your state suddenly becomes mutated and you now have unexpected behavior.

Now that you know *why* it is happening, do you have any ideas of how to *prevent* it from happening?

This situation can be prevented by reading the value from the object a single time, assigning the result of that read to an intermediary value which we control, and then acting upon that value:

```js
const p = obj.p // read object properties once
if (typeof p === 'number' && p > 10) {
    console.log(p) // 12
}
```

The benefit of this approach is two-fold: First, the value obviously cannot mutate anymore. Second, future accesses of the value are now more __performant__ (especially for scenarios like our previous `cart` object example). For example, no lookups for the obj prototype chain need to happen. And if any getters are being used we no longer have the overhead of calling their functions. If you repeatedly access object properties in a hot-path of your application consider caching the values like we’ve done here.