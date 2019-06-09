# Cleaning & Structuring React

By default, React's structure from "create-react-app" is not very ideal for even the slightly complex applications. We'll be changing up the application here in the context that we are also preparing for including backend later on.

After creating your project, let's prep it by installing the necessary components:

```bash
npm install react-router-dom moment react-moment prop-types react-flexbox-grid redux react-redux redux-thunk
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

The folders `Common`, `Features/Palette` and `Features/ErrorHandling` are folders that will almost always be in your new projects moving forward.

### Common Folder

Folder `App/Client/Common` will house anything that's ambiguous. In general, you SHOULD AVOID adding things in this folder as much as you can. Whatever you're doing should fall under a `Feature` and should be unambiguous. In the real world though, there are really cases that this is not possible. We'll be discussing things that will likely be placed here but most of the time, it's custom `PropTypes` that are too general, we'll discuss this in detail when we get to "Protecting Components with PropTypes".

### Features

We've mentioned that we will be using a modified "ducks" structure. Our client structure will revolve around "Features". These are literal features in our application. A feature can then have folders like "Components", "Redux", "Scenes" etc. inside instead of exposing these functional specifications right at the root of our application. This will ensure (force) better reusability in our components by forcing them to be isolated and work on its own with minimal to no dependencies outside its intended "Feature"

### ErrorHandling

This is pretty much self explanatory. All error handling will go here. This will also include pages like 404 and 500. We will be diving here further when we get to "Error Handling Strategies and React Error Boundaries".

## Root Based Imports

If there's one thing that's annoying in CRA's default setup, it's relative imports (../../ etc). We can get rid of this by creating a `jsconfig.json` file at the root directory of your project (beside `src` folder) with the contents:

```json
{
    "compilerOptions": {
        "jsx": "react", 
        "baseUrl": "./src",
        "paths": {
            "/*": ["/*"]
        }
    }
}
```

... this will tell Webpack that our root folder is the `./src` right next to this file. The property `paths` is there to tell Webpack that everything within our root folder can be imported as is. Ex. importing a `Button` component inside  `App/Client/Common/Components` will be like:

```jsx
import Button from 'App/Client/Common/Components/Button`;
```

... regardless of where you import.

## Misplaced `index.css` & `App.js`

Now that we can import from the root, let's move the `index.css` and `App.js` files from `src` to the `App/Client` where it belongs and update the `index.js` file's reference to it to:

```js
import 'App/Client/index.css';
import App from 'App/Client/App';
```

## Enabling Routing

We pretty much have 3 scenes in our application. A scene is a page in your app or website in general. They are responsible for:

- Stitching together components
- Joining components' behaviors to a more specific action that "Containers" may access (more on this in redux later)
- Isolating data retrieval and persistence so components are more reusable

To start, install 'react-dom-router' with:

```bash
npm install react-router-dom
```

We'll then create a component dedicated to routing. Create a new Component by creating a new file `App/Client/Routes.jsx` (there's no point in creating a folder for this as this does not use styles or will be using a container from Redux later on)

File `App/Client/Routes.jsx`:
```jsx
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import LandingScene from 'App/Client/Features/Landing/Scenes/Landing';
import TaskListPerDateScene from 'App/Client/Features/Tasks/Scenes/TaskListPerDate';
import TaskFormPerDateScene from 'App/Client/Features/Tasks/Scenes/TaskFormPerDate';

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={ LandingScene } />
            <Route exact path="/tasks/:date" component={ TaskListPerDateScene } />
            <Route exact path="/tasks/create" component={ TaskFormPerDateScene } />
            <Route exact path="/tasks/:taskId/edit" component={ TaskFormPerDateScene } />
        </Switch> 
    </BrowserRouter>
);

export default Routes;
```

... then update the `App.js` to:

```jsx
import React from 'react';
import Routes from './Routes';

const App = () => (
    <Routes />
);

export default App;
```

This will generate an error that the scenes cannot be resolved.
For now, let's simulate routing by creating each of these scenes with just an `h1` tag inside.

### Landing Scene

Create a new folder called `App/Client/Features/Landing/Scenes/Landing` with the following contents:

File `package.json`:
```json
{
    "main": "./LandingScene.jsx"
}
```

File `LandingScene.jsx`
```jsx
import React from 'react';

const LandingScene = () => (<h1>This is the landing scene</h1>);

export default LandingScene;
```

### Task List Per Date Scene

Create a new folder called `App/Client/Features/Tasks/Scenes/TaskListPerDate` with the following contents:

File `package.json`:
```json
{
    "main": "./TaskListPerDateScene.jsx"
}
```

File `TaskListPerDateScene.jsx`
```jsx
import React from 'react';

const TaskListPerDateScene = () => (<h1>This is the task list per date scene</h1>);

export default TaskListPerDateScene;
```

### Task Form Per Date Scene

Create a new folder called `App/Client/Features/Tasks/Scenes/TaskFormPerDate` with the following contents:

File `package.json`:
```json
{
    "main": "./TaskFormPerDateScene.jsx"
}
```

File `TaskFormPerDateScene.jsx`
```jsx
import React from 'react';

const TaskListPerDateScene = () => (<h1>This is the task form per date scene</h1>);

export default TaskFormPerDateScene;
```

## Testing Routing

Now test `http://localhost:3000/` and it should display "This is the landing scene". (Just change the port if it's different for you). Do the same for:

- `http://localhost:3000/tasks/2019-05-01`
- `http://localhost:3000/tasks/create`
- `http://localhost:3000/tasks/1/edit`

... and each should navigate to their respective components.

## Supporting 404

To handle missing pages, we simply tell the router to use a component for `path="*"`. Let's first create the component/scene that we will use:

Create a new file `App/Client/Features/ErrorHandling/PageNotFound.jsx` with the following contents:

```jsx
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => (
    <Fragment>
        <h1>Oops! The page you are looking for was not found.</h1>
        <Link to="/">Click here to go back home.</Link>
    </Fragment>
);

export default PageNotFound;
```

... then add the route:

```jsx
<Route path="*" component={ PageNotFound } />
```

last in the `<Switch>` tag of your `Router` component. You may now try routes that should not be supported to be redirected to this scene.

# Creating Components

Proceed to [creating storybook for components](/modules/todo/storybook.md) for the next lesson.