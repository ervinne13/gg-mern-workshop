# State & Lifecycle

In Rendering Elements, we have learned one way to update the UI (another through setState if you went through the tic-tac-toe activity). We call ReactDOM.render() to change the rendered output:

```jsx
const Clock = ({ date }) => (
    <div>
        <h1>Hello, world!</h1>
        <h2>It is {date.toLocaleTimeString()}.</h2>
    </div>
);

const tick = () => {
    ReactDOM.render(
        <Clock date={new Date()} />,
        document.getElementById('root')
    );
};

setInterval(tick, 1000);
```

This, however, misses a crucial requirement: the fact that the `Clock` sets up a timer and updates the UI every second should be an implementation detail of the `Clock`.

Ideally we want to write this once and have the `Clock` update itself, as in just use:

```jsx
ReactDOM.render(
    <Clock />,
    document.getElementById('root')
);
```

To implement this, we need to add “state” to the Clo`ck component.

State is similar to props, but it is private and fully controlled by the component.

First, update your clock component to an ES6 class based component:

```jsx
import React from 'react';

class Clock extends React.Component {
    render() {
        const date = this.props.date;
        return (
            <div>
                <h1>Hello, world!</h1>
                <h2>It is {date.toLocaleTimeString()}.</h2>
            </div>
        );
    }
}
```

`Clock` is now defined as a class rather than a function.

The render method will be called each time an update happens, but as long as we render `<Clock />` into the same DOM node, only a single instance of the `Clock` class will be used. This lets us use additional features such as local state and lifecycle methods.

## Adding Local State to a Class

Replace `this.props.date` with `this.state.date` in the render() method:

```jsx
    const date = this.state.date;
```

Add a class constructor that assigns the initial `this.state`:

```jsx
//  ...
class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = { date: new Date() };
    }
  // ...
```

Remove the `date` prop from the `<Clock />` element in our renderer:

```jsx
ReactDOM.render(
    <Clock />,
    document.getElementById('root')
);
```

We will later add the timer code back to the component itself.

The result looks like this:

```jsx
import React from 'react';

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = { date: new Date() };
    }

    render() {
        const date = this.state.date;
        return (
            <div>
                <h1>Hello, world!</h1>
                <h2>It is {date.toLocaleTimeString()}.</h2>
            </div>
        );
    }
}

ReactDOM.render(<Clock />, document.getElementById('root'));
```

## Adding Lifecycle Methods to a Class

In applications with many components, it’s very important to free up resources taken by the components when they are destroyed.

We want to set up a timer whenever the Clock is rendered to the DOM for the first time. This is called “mounting” in React.

We also want to clear that timer whenever the DOM produced by the Clock is removed. This is called “unmounting” in React.

We can declare special methods on the component class to run some code when a component mounts and unmounts:

```jsx
class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = { date: new Date() };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        const date = this.state.date;
        return (
            <div>
                <h1>Hello, world!</h1>
                <h2>It is {date.toLocaleTimeString()}.</h2>
            </div>
        );
    }
}
```

__These methods are called “lifecycle methods”.__

The componentDidMount() method runs after the component output has been rendered to the DOM. This is a good place to set up a timer:

```jsx
    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }
```

Note how we save the timer ID right on `this`.

While` this.props` is set up by React itself and `this.state` has a special meaning, you are free to add additional fields to the class manually if you need to store something that doesn’t participate in the data flow (like a timer ID).

We will tear down the timer in the componentWillUnmount() lifecycle method:

```jsx
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
```

Finally, we will implement a method called `tick()` that the `Clock` component will run every second.

It will use `this.setState()` to schedule updates to the component local state:

```jsx
    tick() {
        this.setState({
            date: new Date()
        });
    }
```

# Using State Correctly

There are three things you should know about setState().

## Do Not Modify State Directly

For example, this will not re-render a component:

```jsx
    // Wrong
    this.state.comment = 'Hello';
```

Instead, use `setState()`:

```jsx
    // Correct
    this.setState({comment: 'Hello'});
```

The only place where you can assign `this.state` is the constructor.

## State Updates May Be Asynchronous

React may batch multiple `setState()` calls into a single update for performance.

Because `this.props` and `this.state` may be updated asynchronously, you should not rely on their values for calculating the next state.

For example, this code may fail to update the counter:

```jsx
    // Wrong
    this.setState({
        counter: this.state.counter + this.props.increment,
    });
```

To fix it, use a second form of `setState()` that accepts a function rather than an object. That function will receive the previous state as the first argument, and the props at the time the update is applied as the second argument:

```jsx
    // Correct
    this.setState((state, props) => ({
        counter: state.counter + props.increment
    }));
```

## State Updates are Merged

When you call `setState()`, React merges the object you provide into the current state.

For example, your state may contain several independent variables:

```jsx
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            comments: []
        };
    }
```

Then you can update them independently with separate `setState()` calls:

```jsx
componentDidMount() {
    fetchPosts().then(response => {
        this.setState({
            posts: response.posts
        });
    });

    fetchComments().then(response => {
        this.setState({
            comments: response.comments
        });
    });
}
```
