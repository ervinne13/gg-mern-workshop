# Cleaning & Structuring React

By default, React's structure from "create-react-app" is not very ideal for even the slightly complex applications. We'll be changing up the application here in the context that we are also preparing for including backend later on.

In order to move forward quickly though. Just clone the repository using the command specified below:

```bash

```

## Cleaning Up

You should notice that we've removed some of the files that we don't need.
Remove:
- src/App.css
- src/App.test.js
- src/logo.svg

We've cleaned up the `src/App.js` as well to remove references and just leave it with a mere h1 tag with whatever content you want as temporary placeholder:

```jsx
import React from 'react';

const App = () => (
  <h1>Temporary Placeholder</h1>
);

export default App;
```

## Structuring

We're going to use a modified duck structure (yes, it's really called duck, search it up).
See the full discussion on how to structure [here](/modules/react-advanced/modified-duck-structure.md).