# Applying Persistence (Firebase)

If you don't know about firebase yet, follow along the instructor with this [module](/modules/firebase/index.md) then go back here afterwards.

Redux is synchronous, if not, it would be very difficult to use anyway. We can still add synchronous operations to it though by adding middlewares.

One such middleware is called thunk, install it by:

```bash
npm install redux-thunk
```

## Registering Middleware

Update your `ReduxWrapper` component to:

```jsx
import React from 'react';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './rootReducer';

const store = createStore(rootReducer, applyMiddleware(thunk));

const ReduxWrapper = ({ children }) => (
    <Provider store={ store }>
        { children }
    </Provider>
);

export default ReduxWrapper;
```

Now try delaying any of your actions by modifying our action creators to return functions instead of the actual action data. Let's experiment with `addTask`:

```js
export const addTask = (taskValues) => {
    const task = {
        id: generateUUID(),
        ...taskValues
    }
    return (dispatch) => {
        setTimeout(function() {
            dispatch({
                type: ADD_TASK,
                task
            });
        }, 3000);
        console.log(' after 3 second effect ');
    };
};
```

## Adding Firebase

Install firebase by installing the following dependencies:

```npm
npm install firebase
```

Let's configure firebase. Create an env file at the root folder with the following contents:

File `.env`
```env
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_DATABASE_URL=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
```

And supply the data for each of the keys. You can find this in your firebase console.

Create a new file `App/Config/firebase.js` with the contents:

```js

import { initializeApp } from 'firebase/app';

export const configureFirebase = () => initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
});
```

Then "configure" firebase by calling the `configureFirebase` function in our App:

```jsx
import React from 'react';
import Routes from './Routes';
import ReduxWrapper from 'App/Client/Redux/ReduxWrapper';
import { configureFirebase } from 'App/Config/firebase';

configureFirebase();
const App = () => (
    <ReduxWrapper>
        <Routes />
    </ReduxWrapper>
);

export default App;
```

### Adding Tasks

Before we add data from our code, remove any documents in the `tasks` collection.

Create a new folder `Persistence\Tasks` and inside it a file called `TaskFirestorePersistenceModule` with the initial content:

```js

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const COLLECTION = 'tasks';

export const storeTask = task => {
    const firestore = firebase.firestore();
    return firestore.collection(COLLECTION).add(task);
};
```

Then in your actions file, import:

```js
import { storeTask as storeTaskInFirestore } from 'Persistence/Tasks/TaskFirestorePersistenceModule';
```

... and update the `addTask` function to:

```js
export const addTask = (taskValues) => {
    const task = {
        id: generateUUID(),
        ...taskValues
    }
    return (dispatch) => {
        storeTaskInFirestore(task)
            .then(dispatch({
                type: ADD_TASK,
                task
            }));        
    };
};
```

Before testing, restart your webpack dev server so react can now read the .env file. Otherwise an error similar to "index.cjs.js:409 Uncaught FirebaseError: projectId must be a string in FirebaseApp.options" might appear.

Save a task and it should function the same, at the same time, save a record in firebase.

## Loading Data

Let's not care about performance for a while and just load everything whenever requested (bad, but let's do this for now).

In your `TaskFirestorePersistenceModule`, add a new function:

```js
//  todo, filter later by id when we do auth
export const loadTasksPerDate = date => {
    const firestore = firebase.firestore();
    return new Promise((resolve, reject) => {
        firestore.collection(COLLECTION)
            .where('date' , '==', date)
            .get()
            .catch(reject)
            .then(querySnapshot => {
                resolve(querySnapshot
                    .docs
                    .map(doc => {
                        const task = doc.data();
                        task.remoteId = doc.id;
                        return task;
                    })
                );
            });
    });
};
```

Note: we'll be using the added `remoteId` later on.

Then update the `receiveTasks` action creator in our actions to receive not just the date, but also the tasks:

```js
export const receiveTasks = (date) => {
    return (dispatch) => {
        loadTasksPerDateInFirestore(date)
            .then(tasks => dispatch(
                {
                    type: RECEIVE_TASKS,
                    date,
                    tasks
                }
            ));
    };
};
```

Update our reducer's `handleReceiveTasksActions` to overwrite the tasks.

```js
const handleReceiveTasksActions = (state, action) => {
    const currentDateSelected = action.date;
    const tasks = action.tasks;
    const tasksBeingDisplayed = tasks.filter(task => task.date === currentDateSelected);
    return { ...state, tasks, tasksBeingDisplayed, currentDateSelected };
};
```

## Updating Data

Let's now try to modify the status on toggle:

In your `TaskFirestorePersistenceModule`, add a new function:

```js
export const updateTask = task => {
    const firestore = firebase.firestore();
    return firestore.collection(COLLECTION)
        .doc(task.remoteId)
        .set(task);
}
```

And update the `toggleTaskStatus` of your `actions` to:

```js
export const toggleTaskStatus = (task) => {
    return (dispatch) => {
        updateTaskInFirestore(task)
            .then(dispatch({
                type: TOGGLE_TASK,
                task
            }));
    };
};
```

Notice though that the task is now updated. This is because the firebase call is executed BEFORE the reducer can update the state of the application.

Update the `toggleTaskStatus` to:

```js
export const toggleTaskStatus = (task) => {
    return (dispatch, getState) => {
        dispatch({ type: TOGGLE_TASK, task });
        const { tasksBeingDisplayed } = getState();
        const processedTask = tasksBeingDisplayed
            .find(taskBeingDisplayed => taskBeingDisplayed.id === task.id);
        
        loadTasksPerDateAndDispatch(processedTask.date, dispatch);
    };
};
```

This will instead, dispatch the toggle action right away, then update in firebase, and finally reload the view view by using `loadTasksPerDateAndDispatch`.

By the way, `loadTasksPerDateAndDispatch` is the extracted version of `receiveTasks`. Update them like so:

```js
export const receiveTasks = (date) => {
    return (dispatch) => {
        loadTasksPerDateAndDispatch(date, dispatch);
    };
};

const loadTasksPerDateAndDispatch = (date, dispatch) => {
    loadTasksPerDateInFirestore(date)
            .then(tasks => dispatch(
                {
                    type: RECEIVE_TASKS,
                    date,
                    tasks
                }
            ));
};
```

Now the actual state is updated and even if you refresh the page, you'll be able to get the same state.

## Removing Data

In your `TaskFirestorePersistenceModule`, add a new function:

```js
export const deleteTask = task => {
    const firestore = firebase.firestore();
    return firestore.collection(COLLECTION)
        .doc(task.remoteId)
        .delete();
}
```

Then update the `deleteTask` in your actions.

```js
export const deleteTask = (task) => {
    return (dispatch) => {
        deleteTaskInFirestore(task)
            .then(dispatch({
                type: DELETE_TASK,
                task
            }));
    };
};
```

## Implementing Task Summaries

In both MongoDB and Firebase, there's no way to aggregate the query so that we can only get the summaries for all the tasks like we do in SQL databases. So we'll implement an all task loader instead for a while.

In your `TaskFirestorePersistenceModule`, add a new function:

```js
export const loadAllTasks = () => {
    const firestore = firebase.firestore();
    return new Promise((resolve, reject) => {
        firestore.collection(COLLECTION)
            .get()
            .catch(reject)
            .then(querySnapshot => {
                resolve(querySnapshot
                    .docs
                    .map(doc => {
                        const task = doc.data();
                        task.remoteId = doc.id;
                        return task;
                    })
                );
            });
    });
};
```

Note that you can work around this limitation by denormalizing. You create a document that contains the records that you would want to query and maintain that at the same time as you do updates to the collection. This is apparently the accepted practice in NoSQL despite being frowned upon on the relational database world.

Anyway, back to the app, we can let `handleReceiveTasksActions` as is in the actions. But now, we should also trigger `handleRefreshTaskSummaries` with it:

Update the call in the reducer to:

```js
case RECEIVE_TASKS:
    return handleRefreshTaskSummaries(handleReceiveTasksActions(state, action), action);
```

