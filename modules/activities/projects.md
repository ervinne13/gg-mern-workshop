# Projects & Tasks

In this activity, we'll make use of our knowledge in React, Redux, and Firebase to build a simple application to track projects & tasks.

Create a new project with create react app:

```bash
create-react-app projects
```

Importing libraries we'll need later:

```bash
cd projects
npm install react-router-dom
```

## Cleaning Up

Let's first remove some of the files that we don't need.
Remove:
- src/App.css
- src/App.test.js
- src/logo.svg

Clean up the `src/App.js`, remove references and just leave it with a mere h1 tag with whatever content you want as temporary placeholder:

```jsx
import React from 'react';

const App = () => (
  <h1>Temporary Placeholder</h1>
);

export default App;
```

## Adding Styles

We don't want to focus on CSS but since we also don't want our project looking ugly, let's use some pre made css templates. One of the free ones we can use is materialize.

Install materializecss by:

```bash
npm install materialize-css@next 
```

Then import materializecss in our `src/index.js` just before we import our own custom `index.css`:

```jsx
//  ...
import 'materialize-css/dist/css/materialize.min.css'
import './index.css';
// ...
```

## Structuring the Project

We're going to use a modified duck structure (yes, it's really called duck, search it up).
See the full discussion on how to structure [here](/modules/react-advanced/modified-duck-structure.md).

