# Conditional Rendering

Conditional rendering in React works the same way conditions work in JavaScript. Use JavaScript operators like if` or the conditional operator to create elements representing the current state, and let React update the UI to match them.

Consider these two components:

```jsx
const UserGreeting = () => <h1>Welcome back!</h1>;

const GuestGreeting = () => <h1>Please sign up.</h1>;
```

We’ll create a `Greeting` component that displays either of these components depending on whether a user is logged in:

```jsx
const Greeting = ({ isLoggedIn }) => {
    const isLoggedIn = props.isLoggedIn;
    if (isLoggedIn) {
        return <UserGreeting />;
    }
    return <GuestGreeting />;
};

ReactDOM.render(
    // Try changing to isLoggedIn={true}:
    <Greeting isLoggedIn={ false } />,
    document.getElementById('root')
);
```

This example renders a different greeting depending on the value of `isLoggedIn` prop.

## Element Variables

You can use variables to store elements. This can help you conditionally render a part of the component while the rest of the output doesn’t change.

Consider these two new components representing Logout and Login buttons:

TODO: continue with: https://reactjs.org/docs/conditional-rendering.html