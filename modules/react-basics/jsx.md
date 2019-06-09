# JSX basics

JSX is a combination of JavaScript and HTML markup. Like the example below:

```jsx
const hello = <h1>Hello, world!</h1>;
```

React embraces the fact that __rendering logic is inherently coupled with other UI logic__: how events are handled, how the state changes over time, and how the data is prepared for display.

Instead of artificially separating technologies by putting markup and logic in separate files, React separates concerns with loosely coupled units called “components” that contain both. We will come back to components in a further section, but if you’re not yet comfortable putting markup in JS, this talk might convince you otherwise.

## Embedding Expressions in JSX

In your scratch project, update the `index.js` like so:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

const name = "Ervinne Sodusta";
const Greeting = <h1>Hello, { name }</h1>;

ReactDOM.render(<Greeting />, document.getElementById('root'));
```

Save and you don't need to refresh your browser, changes will be automatically detected by CRA's webpack configuration and you should see updates in your browser.

In JSX, you can put any valid JavaScript expression inside curly braces ({ }).

Example:

```jsx
const mathOperations = <h1>{ 1 + 2 }</h1>;
const functionCalls = <h1>{ Math.round(502) }</h1>;

const person = { firstName: "Ervinne", lastName: "Sodusta" };

const objectProperties = <h1>{ person.firstName } { person.lastName }</h1>;
```

## JSX is an Expression Too

After compilation, JSX expressions become regular JavaScript function calls and evaluate to JavaScript objects.

This means that you can use JSX inside of `if` statements and `for` loops, assign it to variables, accept it as arguments, and return it from functions:

```jsx
function getGreeting(user) {
    if (user) {
        return <h1>Hello, { user.name }!</h1>;
    }
    return <h1>Hello, Stranger.</h1>;
}

const Greeting = getGreeting({ name: "Ervinne Sodusta" });
```

## Invalid Keywords in JSX

Since JSX is just a JavaScript expression, what happens if you try to specify JavaScript reserved words used in HTML? It may either not work and generate a warning or throw an exception outright.

For example, specifying classes in your JSX you should use `className` instead of `class`.

__Wrong:__

```jsx
const Greeting = <h1 class="some-class">Hello!</h1>;
```

__Correct:__

Wrong:

```jsx
const Greeting = <h1 className="some-class">Hello!</h1>;
```

React DOM uses `camelCase` property naming convention instead of HTML attribute names. So another example, `tabindex` would become `tabIndex`.

Tip: if you don't know yet, tab index specifies the order of the elements that will be highlighted when you press `tab` key in your keyboard.

## Specifying Attributes with JSX

You may use quotes to specify string literals as attributes:

```jsx
const someContainer = <div tabIndex="0"></div>;
```

If you need to set a value in attributes from a JavaScript expression, you'll have to omit the double quotes and replace it with curly braces like so:

```jsx
const avatar = <img src={user.avatarUrl}></img>;
```

## Specifying Children with JSX

If your JSX element excees one line, you may wrap it in parenthesis like so:

```jsx
const greeting = (
    <div>
        <h1>Hello!</h1>
        <h2>Good to see you here.</h2>
    </div>
);
```

However, you may NOT wrap two elements together on the same level. You must either wrap this in a `div` or use a `Fragment`

__Not possible:__

```jsx
const greeting = (
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
);
```

Work-around without having to use `div`:

```jsx
import React, { Fragment } from 'react';

const greeting = (
    <Fragment>
        <h1>Hello!</h1>
        <h2>Good to see you here.</h2>
    </Fragment>
);
```

This will result in markup that does not contain unecessary `div` wrappers:

```html
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
```

## JSX Represents Objects

Babel compiles JSX down to `React.createElement()` calls.

These two examples are identical:

```jsx
const element = (
    <h1 className="greeting">
        Hello, world!
    </h1>
);
```

```jsx
const element = React.createElement(
    'h1',
    {className: 'greeting'},
    'Hello, world!'
);
```