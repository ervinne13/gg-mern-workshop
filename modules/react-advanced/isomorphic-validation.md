# Isomorphic Validation

One of the advantages of MERN stack is `isomorphism`. If you don't take advantage of this, you loose one of the major reason of choosing to use JavaScript in the backend in the first place!

## Isomorphic Code

These are code that can run on both the server and the backend. This is why we divided our code into layers instead of MVC or another architecture. `Domain` code must be "pure" and "isomorphic". It's mere definition of business rules that both the application and the persistence layer must adhere to.

## Validation with Yup

To start, let's install yup:

```bash
npm install yup
```

## Basic Validation

// TODO

## Limitations

There are times where isomorphic code just isnt possible anymore. Consider a case scenario where you have to validate a record, but the validation logic is dependent on other records as well. This will introduce a divide in your code as if you validate in the frontend, you have to query those required records via AJAX but in the backend, you must get it straight from the source.

## Workaround

In order to work around this, we will be introducing the concept of "dependency inversion". We will do this the functional way through the use of higher order functions.