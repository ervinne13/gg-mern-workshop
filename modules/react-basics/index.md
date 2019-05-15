# React Basics

React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called “components”.

Learning about [atomic design](/modules/atomic-design.md) would really help you adjust more to the "React mentality"

We'll learn first about react in a "practical way" by doing an actual application while we learn, then we'll go back and revisit all the necessary concepts to learn them in depth.

Before getting our feet wet though, let's first discuss about React's weird syntax called `JSX`.

## Creating a React Application using CRA

If you havent installed CRA (create react app) yet, install it with:

```bash
npm install -g create-react-app
```

Create a project we can test on with the command:

```bash
npx create-react-app scratch
```

Tip: we use `npx` not `npm`. Think of `npx` as something similar to `npm run`, it's used to run some package that is usually installed globally.

We'll call the application `scratch` as in kinda like a scratch paper.

Let's first learn about what happened and discuss about the structure - [click here](/modules/react-basics/cra-structure.md).

See your project in action in the URL specified in your terminal. For example: `Local: http://localhost:3001` or `On Your Network:  http://192.168.0.186:3001/`.

## JSX Basics

Before getting our feet wet, let's first discuss about React's weird syntax called `JSX`.

[Click here to view the lesson](/modules/react-basics/jsx.md)

## Quick & Dirty Learning

We'll be familiarizing ourselves with React development by actually developing a simple tic tac toe game.

[Click here to view the lesson](/modules/react-basics/tic-tac-toe.md)

## Review and Remastery

After developing our first React application. Let's revisit the concepts for mastery

### Components & Props

Components let you split the UI into independent, reusable pieces, and think about each piece in isolation. This page provides an introduction to the idea of components.

[Click here to view the lesson](/modules/react-basics/components-and-props.md)

### State & Lifecycle

React components manages their own states, state changes, goes through a series of functions triggered inside a component - its lifecycle

[Click here to view the lesson](/modules/react-basics/state-and-lifecycle.md)

### Handling Events

Know about similarities and differences on how events are handled with React elements:

[Click here to view the lesson](/modules/react-basics/handling-events.md)

### Conditional Rendering

In React, you can create distinct components that encapsulate behavior you need. Then, you can render only some of them, depending on the state of your application.

[Click here to view the lesson](/modules/react-basics/conditional-rendering.md)

### Forms & Inputs

HTML form elements work a little bit differently from other DOM elements in React, because form elements naturally keep some internal state.

In this part of the workshop, we'll also learn two ways of handling input, controlled and uncontrolled.

[Click here to view the lesson](/modules/react-basics/forms-and-input.md)