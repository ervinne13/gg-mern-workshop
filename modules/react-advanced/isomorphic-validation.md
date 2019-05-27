# Isomorphic Validation

One of the advantages of MERN stack is `isomorphism`. If you don't take advantage of this, you loose one of the major reason of choosing to use JavaScript in the backend in the first place!

## Isomorphic Code

These are code that can run on both the server and the backend. This is why we divided our code into layers instead of MVC or another architecture. `Domain` code must be "pure" and "isomorphic". It's mere definition of business rules that both the application and the persistence layer must adhere to.

## Validation with Yup

To start, let's install yup:

```bash
npm install yup
```