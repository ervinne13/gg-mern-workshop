# Object Oriented & Functional Programming

In languages like Java and PHP, senior developers will likely compel you to do OOP while in JavaScript, majority of developers will prefer functional programming.

Your instructor will not impose any style that you should adapt but will instead discuss how to implement both and leave the decision to you.

Personally though, if you ask the instructor, the answer will always be "it depends" there are cases where OOP or FP will make more sense. Doing Redux where everything is done with pure functions? Do FP, doing Domain Driven Design/Development on backend and you need to prevent `anemic models`? Do Object Oriented Programming. If you want to improve as a developer, practice both and try to really understand each use case and when and where it's appropriate to do a specific style.

## Object Oriented Programming

- OOP Basics
- __`True`__ Encapsulation (and misconceptions)
- [Property Descriptors](/modules/js-basics/property-descriptors.md)
- [Using (Abusing) Property Descriptors to Implement OOP](/modules/js-basics/property-descriptors-in-oop.md)
- Performance Considerations

## Functional Programming

- FP Basics
- Immutability and Pure Functions
- [Locking Down Objects](/modules/js-basics/locking-down-objects.md)
- Performance Considerations

## Benchmarks

TODO: Deepfrozen objects under FP vs Behavior rich objects under OOP

Research later:

https://medium.com/intrinsic/javascript-object-property-descriptors-proxies-and-preventing-extension-1e1907aa9d10

https://medium.com/intrinsic/javascript-prototype-poisoning-vulnerabilities-in-the-wild-7bc15347c96

https://medium.com/intrinsic/common-node-js-attack-vectors-the-dangers-of-malicious-modules-863ae949e7e8

https://stackoverflow.com/questions/36726138/why-should-i-use-immutablejs-over-object-freeze

https://gomakethings.com/how-to-handle-immutability-in-javascript/