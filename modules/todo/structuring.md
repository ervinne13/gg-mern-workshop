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

The folders `Common` and `Feature/ErrorHandling` are folders that will almost always be in your new projects moving forward.

Folder `App/Client/Common` will house anything that's ambiguous. In general, you SHOULD AVOID adding things in this folder as much as you can. Whatever you're doing should fall under a `Feature` and should be unambiguous. In the real world though, there are really cases that this is not possible. We'll be discussing things that will likely be placed here but most of the time, it's custom `PropTypes` that are too general, we'll discuss this in detail when we get to "Protecting Components with PropTypes".
