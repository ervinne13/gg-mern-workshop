# Projects & Tasks

In this activity, we'll make use of our knowledge in React, Redux, and Firebase to build a simple application to track projects & tasks.

Create a new project with create react app:

```bash
create-react-app projects
```

Importing libraries we'll need later:

```bash
cd projects
npm install react-router-dom redux react-redux redux-thunk firebase react-redux-firebase redux-firestore
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

## Building the Views

TODO

## Adding & Implementing Redux

```bash
npm install redux react-redux
```

Adding a redux store:

Update your `index.js` file at the root of your project and add in the following code just before the Render script:

```jsx
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from 'Redux/rootReducer';

const store = createStore(rootReducer);

const app = (
    <Provider store={ store }>
        <App />
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
```

Remove the old `ReactDOM.render(...` code that still references to just `<App />`.

## Adding Dummy Data for Redux

Just to test, let's add dummy data first:

TODO

## Redux Middlewares & Redux Thunk

Redux thunk will basically halt a certain dispatched action, which, by then, we will be able to try and do asynchronous tasks like consuming an API before finally resuming the action and feed the fetched data to the reducer.

The precise definition of a “thunk” varies across contexts. Generally though, thunks are a functional programming technique used to delay computation. Instead of performing some work now, you produce a function body or unevaluated expression (the “thunk”) which can optionally be used to perform the work later. 

![Redux Thunk Workflow](/img/react-redux-jsapi-overview.png)

Install it by:

```bash
npm install redux-thunk
```

### Applying Thunk as a Redux Middleware

In your `index.js` file in the root directory, modify `import { createStore } from 'redux';` to `import { createStore, applyMiddleware } from 'redux';` as we'll need to make use of the `applyMiddleware` function.

Import `thunk` and apply it as a middleware in your store:

```jsx
import thunk from 'redux-thunk';

const store = createStore(rootReducer, applyMiddleware(thunk));
```

### Applying Thunk in Actions

Let's take for example the code below which describes and action to add a project:

```js
export const createProject = (project) => {
    return {
        type: 'CREATE_PROJECT',
        project
    };
};
```

In redux, we return an action in the format of an object with a `type` property that describes that action.

With thunk though, instead of an object, we return a function. That function, will then call a `dispatch` callback (1st param) once it's done with its async task

```js
export const createProject = (project) => {
    return (dispatch, getState) => {

        //  do something async, then ...
        dispatch({
            type: 'CREATE_PROJECT',
            project
        })
    };
};
```

## Setting Up Firebase

Create an account in https://firebase.google.com.

Then click "go to console" and create a project by clicking "Add project". Name this project "worklogs", set your location to philippines, and click "Create project".

For now, let's just create a firebase database that our application can use, let's ignore security for now.

You should be redirected to your project dashboard. Create a Firebase database by clicking `</>`. This will prompt you to register an app, you may call it whatever you like, for now, type in "Worklogs App" and create the app.

Firebase will then redirect you to a page with "Add Firebase SDK". It will display a script and you'll need to copy the keys specified to our `config/firebase.js` file. Like so:

File `config/firebase.js`:
```js
const firebaseConfig = {
    apiKey: "AIzaSyCV7ex-XVazjmyY6byEtusXlMrtW9HHMYU",
    authDomain: "worklogs-296f3.firebaseapp.com",
    databaseURL: "https://worklogs-296f3.firebaseio.com",
    projectId: "worklogs-296f3",
    storageBucket: "worklogs-296f3.appspot.com",
    messagingSenderId: "259099390987",
    appId: "1:259099390987:web:bdf127ab685fc0b2"
};

export default firebaseConfig;
```

Note: you don't have to worry about the `apiKey` being exposed in the front end, it's natural to be exposed, otherwise we won't have any way to connect to our database. We can secure our firebase database later on with rules.

Let's create a folder dedicated for persistence and add in firebase in there. Create a folder `src/Persistence` and a file called `Firebase.js` inside it. Add the following content to the new file:

File `src/Persistence/Firebase.js`
```js
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import config from 'config/firebase';

firebase.initializeApp(config);
firebase.firestore().settings({ timestampsInSnapshots: true});

export default firebase;
```

## Firebase Firestore Basics

Firestore is basically just a NoSQL database, much like MongoDB and Redis.
Firestore deals with "collections" (worklogs, projects, tasks, etc,) and documents inside collections.

Think of collections as tables and documents as individual rows in that table.

## Creating a Firestore Database

In your console, click on "Database" in the left navigation, once you're redirected, click "Create database" in the "Cloud Firestore" page.
Make sure to click the radio button "Start in test mode" so we can do some reads and writes to the database. We can change this later on with rules.

Add the necessary collections.

TODO

## Connecting Redux to Firebase

We can actually just call some APIs to firebase to read and write data. A better way to do it in react would be to make use of the libraries we installed earlier: `react-redux-firebase` and `redux-firestore`.

Update your index.js file and add the following imports:

```jsx
import { getFirestore } from 'redux-firestore';
import { getFirebase } from 'react-redux-firebase';
```

... then modify your store creation to:

```jsx
const store = createStore(rootReducer, applyMiddleware(thunk.withExtraArgument(getFirebase, getFirestore)));
```

What `withExtraArgument` does is add extra arguments passed to the function we feed in redux when we create action creators.