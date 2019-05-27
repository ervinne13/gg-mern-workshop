# Introduction to Component Testing

It's very difficult to do test driven development in React. In this session, we won't be doing test driven development. We will only be doing Unit Testing through Component Testing in React.

Two are very much different as in TDD, you "test before the fact". Meaning you do your test code before doing any production code. This is very difficult to do with frontend as most of the time, a lot of testing should only really be done by the eyes. With component testing, we will mostly be testing for edge cases for our components.

## Snapshot Testing

One of the simplest way for testing React components is snapshot testing.

Snapshots are a common theme in technology: you can take a snapshot of a virtual private server. Or you can take a snapshot of a volume in AWS.

And so on.

Snapshot testing in React is not built into the library itself: instead it’s a feature built into Jest.

Jest (the testing runner) takes a snapshot of the component on the first run, then it checks if the saved snapshot matches the actual component.

Here's and example:

```jsx
import React from "react";
import { create } from "react-test-renderer";
import FeatureComponent from "../FeatureComponent";

describe("Feature component", () => {
    test("it matches the snapshot", () => {
        const component = create(<FeatureComponent />);
        expect(component.toJSON()).toMatchSnapshot();
    });
});
```

### Breaking the Test Down

`react-test-renderer` is a library for rendering React components to pure JavaScript objects. Guess what, it is a good way for testing our components in the most simple way. The function `create` is a function from that library for "mounting" the component.

The instructor puts double quotes on mounting as instead of mounting it on a markup, jest merely creates an instance of that component which you may now make assertions on. `reacte-test-renderer` does not use the real DOM.

## Testing the wrong way (do not test the implementation)

//  TODO

