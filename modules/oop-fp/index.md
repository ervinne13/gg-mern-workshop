# Object Oriented & Functional Programming

In languages like Java and PHP, senior developers will likely compel you to do OOP while in JavaScript, majority of developers will prefer functional programming.

Your instructor will not impose any style that you should adapt but will instead discuss how to implement both and leave the decision to you.

Personally though, if you ask the instructor, the answer will always be "it depends" there are cases where OOP or FP will make more sense. Doing Redux where everything is done with pure functions? Do FP, doing Domain Driven Design/Development on backend and you need to prevent `anemic models`? Do Object Oriented Programming. If you want to improve as a developer, practice both and try to really understand each use case and when and where it's appropriate to do a specific style.

## Object Oriented Programming

- [OOP Basics](/modules/oop-fp/oop-basics.md)
- [Property Descriptors](/modules/oop-fp/property-descriptors.md)
- [Using (Abusing) Property Descriptors to Implement OOP](/modules/oop-fp/property-descriptors-in-oop.md)

## Functional Programming

- [FP Basics, Immutability and Pure Functions](/modules/oop-fp/fp-basics.md)
- [Locking Down Objects](/modules/oop-fp/locking-down-objects.md)

## Notes

The instructor was not able to create reasonable benchmarks so we're currently unsure of performance implications. To properly benchmark things, complex setup and scenarios must be simulated for each.

In general though, with how fast servers are anyway, you should care more about how maintainable your source code is than how optimize it is (read about pre-mature optimization).

## Further Reading

### ImmutabilityJS vs Object Freeze

https://stackoverflow.com/questions/36726138/why-should-i-use-immutablejs-over-object-freeze

https://gomakethings.com/how-to-handle-immutability-in-javascript/

### Security

We wont be dealing very deeply with security right inside our source code but if you're interested, the following reads are good.

https://medium.com/intrinsic/javascript-prototype-poisoning-vulnerabilities-in-the-wild-7bc15347c96

https://medium.com/intrinsic/common-node-js-attack-vectors-the-dangers-of-malicious-modules-863ae949e7e8

Of course, we'll cover basic security management later on, some security scans, and implementing SSL.