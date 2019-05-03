# Object Oriented Programming Basics

The three main concepts you have to remember in OOP is inheritance, polymorphism, and encapsulation. From what we learned earlier though, polymorphism is already automatic in JavaScript as an object can be of any type. We'll go back to this topic when we learn about TypeScript.

__What we will be focusing on instead is encapsulation.__

Object orientation is a programming paradigm where developers compose objects in such a way that both data and behavior are "encapsulated" in each object.

This encapsulation is what a lot of developers get wrong most of the time. Consider the code below in Java (we'll be using Java to make use of private properties easier):

```java
//  ...
class Ballpen {

    private float inkLeft;

    public void setInkLeft(float inkLeft) {
        this.inkLeft = inkLeft;
    }

    public float getInkLeft() {
        return this.inkLeft;
    }

}
```

This is very common in object oriented languages like Java & PHP. Luckily you wont find this in JavaScript as __this is entirely wrong implementation of encapsulation__.

## __`True`__ Encapsulation (and misconceptions)

Encapsulation is an object-oriented programming concept that binds together the data and functions that manipulate the data, and that __keeps both safe from outside interference and misuse__. Data encapsulation led to the important OOP concept of [data hiding](https://en.wikipedia.org/wiki/Information_hiding).

To encapsulate classes or objects, it's a pre-requisite that you protect your data from modification and "encapsulate" behavior such that the object is the only one able to do "safe" modifications on itself.

For example, let's correct the implementation above:

```java
//  ...
class Ballpen {

    private float inkLeft; 

    public float getInkLeft() {
        return this.inkLeft;
    }

    public void write() {
        this.inkLeft --;
    }

}
```

We introduce a new method (function in JS) called `write` that makes the `inkLeft` decrease. Effectively creating a behavior that outside objects may use while restricting modification in this class.

## Encapsulation in JS

This means, however, that we will need some sort of ability to do private only access in variables but still be able to create instances based on a "class". This is not easy in JavaScript as what we learned earlier using IIFE, we can create private access but only with "modules" which does not create new instances. Creating objects with `new` will not enable us to use IIFE and closures so we can't do privates as well.

But we have an option by making use of closures BUT NOT making use of IIFE.

```js
const createBallpen = (function() {
    let inkLeft = 100;

    const write = () => {
        inkLeft--;
    };

    const getInkLeft = () => {
        return inkLeft;
    };

    return {
        write,
        getInkLeft
    };
});

const pen1 = createBallpen();
const pen2 = createBallpen();

pen1.write();

console.log(pen1.getInkLeft()); //  99
console.log(pen2.getInkLeft()); // 100
```

As you've noticed, we were able to enable private only access to properties and at the same time, create "instances" by making use of "factory" functions that create objects for us the gains closure to properties or methods that we do not want to expose.

## Encapsulation by Property Descriptors

We also have the option of making use of something we call property descriptors. Which we will learn about in the next section.

## Composition Over Inheritance

We (should) know that in general, developers must prefer composition over inheritance. For example, consider the code below:

```Java

//  ...

class Engine {
    //  ...
    public void start() {
        //  ...
    }
}

class Car extends Engine {
    //  ...
    public void start() {
        super.start();  // engine
        //  ... car specific start tasks
    }
}

```

In order for the car to get the start function from `Engine`, a developer (a bad one at that) inherited from `Engine` to get that `start` function and invoke it.

A better way to do this is to do composition + dependency injection.

```java
//  ...

class Engine {
    //  ...
    public void start() {
        //  ...
    }
}

class Car {
    //  ...
    public Car(Engine engine) {
        this.engine = engine;
    }
    
    public void start() {
        engine.start();
        //  ... car specific start tasks
    }
}

```

In this code, the developer instead lets the `Engine` object (which can be changed to an interface to allow polymorphism later on) and starts that `engine` class property instead. This is a basic implementation of "Composition over Inheritance".

But how do we do this in JavaScript?

## JavaScript Object Composition

A common composition pattern in JavaScript is using object composition. It combines the power of objects and functional programming.

Do do object composition, you first start defining the actual behaviors:

```js
const canSayHi = self => ({
    sayHi: () => console.log(`Hi! I'm ${self.name}`)
});

const canEat = () => ({
    eat: food => console.log(`Eating ${food}...`)
})

// Composing Multiple Behaviors into One
// You may also do this directly of course, 
// I just like grouping behaviors as this is more reusable
const humanBehaviors = self => Object.assign(
    {}, 
    canSayHi(self), 
    canEat()
);

const makeHuman = name => {
    const self = {
        name
    };

    //  writing combined behaviors as "behaviors" also benefit 
    //  readability, this line reads like: Assign human behaviors 
    //  to the object `self`, it's almost literal
    return Object.assign(self, humanBehaviors(self));
}


const ervinne = makeHuman("Ervinne");

ervinne.sayHi();        //  Hi! I'm Ervinne
ervinne.eat("dirt");    //  Eating dirt...
```

## Implementing the `Car` Example

Let's do another example, but this time, trying to implement the `Car` Java example from earlier. There's one problem here though, we haven't tackled dependency injection in JS. Which is easy anyway, consider:

```js

//  file: engine.js
const canStartEngine = self => ({
    start: () => console.log(`Starting engine type: ${self.type}`)
});

//  export
const makeEngine = type => {
    const self = {
        type
    };

    return Object.assign(self, canStartEngine(self));
};

//  file: car.js
const canStartCar = self => ({
    start: () => {
        self.engine.start();
        console.log("Engine started, drive now.");
    }
});

//  export
const makeCar = engine => {
    const self = {
        engine
    };

    return Object.assign(self, canStartCar(self));
};

const feEngine = makeEngine("1.5 L 5A-FE (petrol)");
const vios2019 = makeCar(feEngine);

vios2019.start();
//  Starting engine type: 1.5 L 5A-FE (petrol)
//  Engine started, drive now.

```