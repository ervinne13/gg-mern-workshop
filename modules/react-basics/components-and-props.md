# Components & Props

Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.

## Function and Class Components

The simplest way to define a component is to write a JavaScript function, the following are all the same way to create a function based component:

Basic function
```jsx
function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
}
```

Arrow function
```jsx
const Welcome = props => {
    return <h1>Hello, { props.name }</h1>
};
```

Arrow function without block scope
```jsx
const Welcome = props => (
    <h1>Hello, { props.name }</h1>
);
```

Arrow function without block scope and extracted props
```jsx
const Welcome = ({ name }) => (
    <h1>Hello, { name }</h1>
);
```

These functions are valid React components because it accepts a single “props” (which stands for properties) object argument with data and returns a React element. We call such components “function components” because they are literally JavaScript functions.

You can also use an ES6 class to define a component:

```jsx
class Welcome extends React.Component {
    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}
```

Note that in this case, you have to access the props through `this`.

The above two components are equivalent from React’s point of view.

## Rendering a Component

This code, will render "Hello, Ervinne" on the page:

```jsx
function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Ervinne" />;
ReactDOM.render(
    element,
    document.getElementById('root')
);
```

__Note: Always start component names with a capital letter.__

React treats components starting with lowercase letters as DOM tags. For example, `<div />` represents an HTML div tag, but `<Welcome />` represents a component and requires Welcome to be in scope.

## Composing Components

omponents can refer to other components in their output. This lets us use the same component abstraction for any level of detail. A button, a form, a dialog, a screen: in React apps, all those are commonly expressed as components.

For example, we can create an `App` component that renders `Welcome` many times:

```jsx
function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
}

function App() {
    return (
        <div>
            <Welcome name="Ervinne" />
            <Welcome name="Doris" />
            <Welcome name="John Doe" />
        </div>
    );
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
```

## Extracting Components

Don’t be afraid to split components into smaller components.

For example, consider this `Comment` component:

```jsx
const formatDate = date => date.toLocaleDateString();

const Comment = ({ author, text, date }) => (
    <div className="Comment">
        <div className="UserInfo">
            <img className="Avatar"
                src={ author.avatarUrl }
                alt={ author.name }
            />
            <div className="UserInfo-name">
                { author.name }
            </div>
        </div>
        <div className="Comment-text">
            { text }
        </div>
        <div className="Comment-date">
            { formatDate(date) }
        </div>
    </div>
)
```

It accepts `author` (an object), `text` (a string), and `date` (a date) as props, and describes a comment on a social media website.

This component can be tricky to change because of all the nesting, and it is also hard to reuse individual parts of it. Let’s extract a few components from it.

First, we will extract `Avatar`:

```jsx
const Avatar = ({ user }) => (
    <img className="Avatar"
        src={ user.avatarUrl }
        alt={ user.name }
    />
);
```

The `Avatar` doesn’t need to know that it is being rendered inside a `Comment`. This is why we have given its prop a more generic name: `user` rather than `author`.

You should name props from the component’s own point of view rather than the context in which it is being used.

We can now simplify `Comment` a tiny bit:

```jsx
const Comment = ({ author, text, date }) => (
    <div className="Comment">
        <div className="UserInfo">
            <Avatar user={ author } />
            <div className="UserInfo-name">
                { author.name }
            </div>
        </div>
        <div className="Comment-text">
            { text }
        </div>
        <div className="Comment-date">
            { formatDate(date) }
        </div>
    </div>
);
```

Next, we will extract a `UserInfo` component that renders an `Avatar` next to the user’s name:

```jsx
const UserInfo = ({ user }) => (
    <div className="UserInfo">
        <Avatar user={ user } />
        <div className="UserInfo-name">
            { user.name }
        </div>
    </div>
);
```

This lets us simplify Comment even further:

```jsx
const Comment = ({ author, text, date }) => (
    <div className="Comment">
        <UserInfo user={ author } />
        <div className="Comment-text">
            { text }
        </div>
        <div className="Comment-date">
            { formatDate(date) }
        </div>
    </div>
);
```

# Props are Read-Only

Whether you declare a component as a function or a class, it must never modify its own props. Consider this sum function:

```js
const sum = (a, b) => a + b;
```

Such functions are called “pure” because they do not attempt to change their inputs, and always return the same result for the same inputs.

In contrast, this function is impure because it changes its own input:

```js
const withdraw = (account, amount) => account.total -= amount;
```

React is pretty flexible but it has a single strict rule:

__All React components must act like pure functions with respect to their props.__