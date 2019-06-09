# Handling Events

Handling events with React elements is very similar to handling events on DOM elements. There are some syntactic differences:

- React events are named using camelCase, rather than lowercase.
- With JSX you pass a function as the event handler, rather than a string.

For example, the HTML:

```html
<button onclick="doSomething()">
    Do Something
</button>
```

Where onclick is all lowercase, while JSX is using camelCase:

```jsx
<button onClick={ doSomething }>
    Do Something
</button>
```

Note: like demonstrated in our activity earlier, passing the function directly to the `onClick` will make it lose its reference to `this`. Either wrap in an arrow function (simulates implicit `this` binding) or do an explicit `this` binding.

Another difference is that you cannot return `false` to prevent default behavior in React. You must call `preventDefault` explicitly. For example, with plain HTML, to prevent the default link behavior of opening a new page, you can write:

```html
<a href="#" onclick="console.log('The link was clicked.'); return false">
    Click me
</a>
```

In React, this could instead be:

```jsx
const ActionLink = () => {
    const handleClick = (e) => {
        e.preventDefault();
        console.log('The link was clicked.');
    }

    return (        
        <a href="#" onClick={ handleClick }>
            Click me
        </a>
    );
};
```

When using React you should generally not need to call `addEventListener` to add listeners to a DOM element after it is created. Instead, just provide a listener when the element is initially rendered.

When you define a component using an ES6 class, a common pattern is for an event handler to be a method on the class. For example, this `Toggle` component renders a button that lets the user toggle between “ON” and “OFF” states:

```jsx
class Toggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isToggleOn: true };
    }

    handleClick() {
        this.setState(state => ({
            isToggleOn: !state.isToggleOn
        }));
    }

    render() {
        return (
            <button onClick={ this.handleClick.bind(this) }>
                { this.state.isToggleOn ? 'ON' : 'OFF' }
            </button>
        );
    }
}
```

Note, in case you have multiple calls to a function that needs an explicit `this` binding, or just don't want to `bind` all the time, you can do the binding in advance. Like so:

```jsx
class MultiButtonComponent extends React.Component {
    constructor(props) {
        super(props);

        //  Advanced binding technique
        this.generalEventHandler = this.generalEventHandler.bind(this);
    }

    generalEventHandler() {
       //   makes use of `this` keyword that should 
       //   point to MultiButtonComponent's instance
    }

    render() {
        return (
            <Fragment>
                <button onClick={ this.generalEventHandler }>
                    Button 1
                </button>
                <button onClick={ this.generalEventHandler }>
                    Button 2
                </button>
            </Fragment>
        );
    }
}
```

If advanced binding still annoys you. CRA (create react app) also provides a special syntax to get around the `this` binding. You simply declare a function as you would an arrow function but inside a class:

```jsx
class LoggingButton extends React.Component {
    // This syntax ensures `this` is bound within handleClick.
    // Warning: this is *experimental* syntax.
    handleClick = () => {
            console.log('this is:', this);
    }

    render() {
        return (
            <button onClick={this.handleClick}>
                Click me
            </button>
        );
    }
}
```

The instructor wants to re-iterate that this is a react-specific syntax so don't try doing this on your backend.

Lastly, as we demonstrated earlier, maybe the most consistent and better looking of all is to just wrap your function in another arrow function. Not to mention, this allows you to add parameters to your call:

```jsx
class LoggingButton extends React.Component {
    handleClick() {
        console.log('this is:', this);
    }

    render() {
        // This syntax ensures `this` is bound within handleClick
        return (
            <button onClick={(e) => this.handleClick(e)}>
                Click me
            </button>
        );
    }
}
```

The problem with this syntax is that a different callback is created each time the `LoggingButton` renders. In most cases, this is fine. However, if this callback is passed as a prop to lower components, __those components might do an extra re-rendering.__ We generally recommend binding in the constructor or using the class fields syntax, to avoid this sort of performance problem.