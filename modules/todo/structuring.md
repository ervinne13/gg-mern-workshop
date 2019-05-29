# Cleaning & Structuring React

By default, React's structure from "create-react-app" is not very ideal for even the slightly complex applications. We'll be changing up the application here in the context that we are also preparing for including backend later on.

```bash

```

## Cleaning Up

Remove some of the files that we don't need.
Remove:
- src/App.css
- src/App.test.js
- src/logo.svg

Clean up the `src/App.js` as well to remove references and just leave it with a mere h1 tag with whatever content you want as temporary placeholder:

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

Refer to the mocks [here](https://xd.adobe.com/view/cdc8394c-8a65-42ad-56af-3d559771ce3e-bbf9/screen/f6545cae-8da0-4141-9063-f6b32540a685/iPhone-X-XS-1) to get to see the plan interface.

For this specific project, create the following folders from the `src` folder:

- App/Client/Common
- App/Client/Features/ErrorHandling
- App/Client/Features/Landing
- App/Client/Features/Calendar
- App/Client/Features/Tasks
- App/Client/Features/Palette

The folders `Common`, `Features/Palette` and `Features/ErrorHandling` are folders that will almost always be in your new projects moving forward.

### Common Folder

Folder `App/Client/Common` will house anything that's ambiguous. In general, you SHOULD AVOID adding things in this folder as much as you can. Whatever you're doing should fall under a `Feature` and should be unambiguous. In the real world though, there are really cases that this is not possible. We'll be discussing things that will likely be placed here but most of the time, it's custom `PropTypes` that are too general, we'll discuss this in detail when we get to "Protecting Components with PropTypes".

### Features

We've mentioned that we will be using a modified "ducks" structure. Our client structure will revolve around "Features". These are literal features in our application. A feature can then have folders like "Components", "Redux", "Scenes" etc. inside instead of exposing these functional specifications right at the root of our application. This will ensure (force) better reusability in our components by forcing them to be isolated and work on its own with minimal to no dependencies outside its intended "Feature"

### Palette

This is the reason why we learned atomic design earlier. Before doing anything functional, we will write our components as small as whatever's reasonable and slap it in the "Palette" (as in literally a painter's palette). Remember "Thinking in React" and "Atomic Design"? we will write our components small first, then "stitch" them later on when creating our actual "scenes" instead of trying to make everything per page/scene.

This will ensure (force) component decoupling and avoid spaghetti code and akward dependencies between components and scenes later on.

### ErrorHandling

This is pretty much self explanatory. All error handling will go here. This will also include pages like 404 and 500. We will be diving here further when we get to "Error Handling Strategies and React Error Boundaries".