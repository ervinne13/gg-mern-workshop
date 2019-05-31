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
REACT_APP_FIREBASE_AUTH=
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

## Google Authentication

For starters, let's first move the `GoogleLoginButton` to ``App/Client/Features/Authentication` as it's misplaced. Just update the reference to it afterwards.

Update your `App/Client/Features/Authentication/Components/GoogleLoginButtonComponent.jsx` file to:

```jsx
import React from 'react';
import Button from 'App/Client/Common/Components/Button';
import { ReactComponent as Logo } from './google-icon.svg';
import './style.css';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const GoogleLoginButton = ({ onUserAuthenticated }) => (
    <Button 
        onClick={() => handleGoogleAuthentication(onUserAuthenticated)}
        fill="border" 
        size="large" 
        className="google-auth-btn" >
        Sign In with Google <Logo />
    </Button>
);

const handleGoogleAuthentication = (callback) => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth()
        .signInWithPopup(provider)
        .then(result => {
            const user = result.user;
            if (callback) {
                callback(user);
            } else {
                console.warn("Authenticated but the callback function was not supplied.");
            }
        });
};

export default GoogleLoginButton;
```

Then we apply redux to this component by creating it's own container `GoogleLoginButtonContainer.js` with the contents:

```js
import GoogleLoginButtonComponent from './GoogleLoginButton';
import { connect } from 'react-redux';
import { authenticate } from 'App/Client/Features/Authenticcation/Redux/actions';

const mapDispatchToProps = (dispatch) => {
    return {
        onUserAuthenticated: user => dispatch(authenticate(user))
    }
};

export default connect(null, mapDispatchToProps)(GoogleLoginButtonComponent);
```

Update the directory descriptor to point to this container instead:

```json
{
    "main": "./GoogleLoginButtonContainer.js"
}
```

Then create the actions and reducers for it in `App/Client/Features/Authentication/Redux`. Create the files:

File `action.js`:
```
export const AUTHENTICATE = 'AUTHENTICATE';

export const authenticate = (user) => {
    return {
        type: AUTHENTICATE,
        user
    };
};
```

File `reducers.js`:
```js

import { AUTHENTICATE } from './actions';

const initialState = {
    authenticated: false,
    user: null
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case AUTHENTICATE:
            return handleAuthenticate(state, action);
        default:
            return state;
    }
}

const handleAuthenticate = (state, action) => {    
    return { ...state, authenticated: true, user: action.user };
};

export default reducer;
```

Now update the `rootReducer.js` in `App/Client/Redux` to:

```js
import { combineReducers } from 'redux'
import tasksReducers from 'App/Client/Features/Tasks/Redux/reducers';
import authenticationReducers from 'App/Client/Features/Authentication/Redux/reducers';

export default combineReducers({
    tasksReducers,
    authenticationReducers
});
```

## Redirecting On Authenticate

Create a new component `App/Client/Features/Authentication/Components/RedirectsAuthenticatedUser` folder and inside it, 3 files:

File `RedirectsAuthenticatedUserComponent.jsx`:
```jsx
import React from 'react';
import moment from 'moment';
import { Redirect } from 'react-router-dom';

const RedirectsAuthenticatedUser = ({ user, children }) => {
    if (user) {
        const date = moment().format("YYYY-MM-DD");
        return <Redirect to={`/tasks/${date}`} />
    } else {
        return children;
    }
};

export default RedirectsAuthenticatedUser;
```

File `RedirectsAuthenticatedUserContainer.js`:
```jsx
import RedirectsAuthenticatedUserComponent from './RedirectsAuthenticatedUserComponent';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        user: state.authenticationReducers.user
    }
};

export default connect(mapStateToProps)(RedirectsAuthenticatedUserComponent);
```

And file `package.json`:
```json
{
    "main": "./RedirectsAuthenticatedUserContainer.js"
}
```

Then modify the routes so that it would wrap the scenes in this container. Update `App/Client/Routes.jsx`:

Add import:
```js
import RedirectsAuthenticatedUser from 'App/Client/Features/Authentication/Components/RedirectsAuthenticatedUser';
```

and update the route to `/` to:

```jsx
<Route exact path="/" component={ (props) => <RedirectsAuthenticatedUser><LandingScene {...props} /></RedirectsAuthenticatedUser> } />
```

This will then block access to the landing page if the user is already authenticated and will automatically redirect users.

## Redirecting Guests

Now we'll want to do the reverse. We would like to redirect the users to the landing page if the user is not yet authenticated.

Create a new folder `App/Client/Features/Authentication/Components/RequiresAuthentication` and inside it, create the files:

File `RequiresAuthenticationComponent.jsx`:
```jsx
import React  from 'react';
import { Redirect } from 'react-router-dom';

const RequiresAuthentication = ({ user, children }) => {
    if (user) {
        return children;
    } else {        
        return <Redirect to={`/`} />        
    }
};

export default RequiresAuthentication;
```

File `RequiresAuthenticationContainer.js`:
```js
import RequiresAuthenticationComponent from './RequiresAuthenticationComponent';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        user: state.authenticationReducers.user
    }
};

export default connect(mapStateToProps)(RequiresAuthenticationComponent);
```

File `package.json`:
```json
{
    "main": "./RequiresAuthenticationContainer.js"
}
```

We'll do the same thing as we did previously for the landing page. Update `App/Client/Routes.jsx`:

Add import:
```jsx
import RequiresAuthentication from 'App/Client/Features/Authentication/Components/RequiresAuthentication';
```

And update the routes:

```jsx
    <Route exact path="/tasks/:date/create" component={ (props) =>
        <RequiresAuthentication>
            <TaskFormPerDateScene { ...props }/>
        </RequiresAuthentication>
    } /> } />

    <Route exact path="/tasks/:date" component={ (props) =>
        <RequiresAuthentication>
            <TaskListPerDateScene { ...props }/>
        </RequiresAuthentication>
    } />
```

## Firebase Front-end Only Sessions

With our current implementation, refreshing the page will make us loose our session. To be able to keep our sessions we need to have some sort of server that can keep cookies for us.

Luckily, we can do this with firebase without having to spin up a node or express server.

install:

```bash
npm install react-with-firebase-auth
```

The update the `App/Config/firebase.js` file to:

```js

import withFirebaseAuth from 'react-with-firebase-auth'
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

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

export const applyFirebaseAuthAndConfigToComponent = (component) => {
    const app = configureFirebase();
    const firebaseAppAuth = app.auth();
    const providers = {
        googleProvider: new firebase.auth.GoogleAuthProvider(),
    };

    return withFirebaseAuth({
        providers,
        firebaseAppAuth,
    })(component);
};
```

The function `withFirebaseAuth` will expose 1 object and 2 functions in the props of the component we integrate it to: `user`, `signOut`, `signInWithGoogle` (since we used `GoogleAuthProvider`)

And use the `applyFirebaseAuthAndConfigToComponent` to the `App/Client/App.jsx` component:

```jsx
import React from 'react';
import Routes from './RoutesContainer';
import ReduxWrapper from 'App/Client/Redux/ReduxWrapper';
import { applyFirebaseAuthAndConfigToComponent } from 'App/Config/firebase';

const App = (authProps) => (
    <ReduxWrapper>
        <Routes { ...authProps } />
    </ReduxWrapper>
);

export default applyFirebaseAuthAndConfigToComponent(App);
```

Now update the `Routes` to pass in the required data to the appropriate components:

```jsx
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import RedirectsAuthenticatedUser from 'App/Client/Features/Authentication/Components/RedirectsAuthenticatedUser';
import RequiresAuthentication from 'App/Client/Features/Authentication/Components/RequiresAuthentication';

import LandingScene from 'App/Client/Features/Landing/Scenes/Landing';
import TaskListPerDateScene from 'App/Client/Features/Tasks/Scenes/TaskListPerDate';
import TaskFormPerDateScene from 'App/Client/Features/Tasks/Scenes/TaskFormPerDate';
import PageNotFound from 'App/Client/Features/ErrorHandling/PageNotFound';

const Routes = ({ userAuthenticated, user, signOut, signInWithGoogle }) => {
    if (user && userAuthenticated) {
        userAuthenticated(user);
    }

    return (
        <BrowserRouter>
        <Switch>
            <Route exact path="/" component={ (props) => 
                <RedirectsAuthenticatedUser >
                    <LandingScene {...props} signInWithGoogle={ signInWithGoogle } />
                </RedirectsAuthenticatedUser>
            } />

            <Route exact path="/tasks/:date/create" component={ (props) =>
                <RequiresAuthentication >
                    <TaskFormPerDateScene { ...props } signOut={ signOut } />
                </RequiresAuthentication>
            } /> } />

            <Route exact path="/tasks/:date" component={ (props) =>
                <RequiresAuthentication >
                    <TaskListPerDateScene { ...props } signOut={ signOut }/>
                </RequiresAuthentication>
            } />

            <Route path="*" component={ PageNotFound } />
        </Switch> 
    </BrowserRouter>
    );
};

export default Routes;
```

We'll need to create a container for the `Routes` so it can pass in the `user` from firebase. Create the file `RoutesContainer.js` next to it with the contents:

```js
import Routes from './Routes';
import { connect } from 'react-redux';
import { authenticate } from 'App/Client/Features/Authentication/Redux/actions';

const mapDispatchToProps = (dispatch) =>  {
    return {
        userAuthenticated: user => dispatch(authenticate(user))
    }
};

export default connect(null, mapDispatchToProps)(Routes);
```

Now we'll have to make use of the `signInWithGoogle` passed by firebase instead of getting it manually. Update the `LandingScene.jsx` component to:

```jsx
const LandingScene = ({ signInWithGoogle }) => (
    <div className="landing-scene">
        <Logo />
        <h1>To Do Tasks by Ground Gurus</h1>
        <GoogleLoginButton onClick={ signInWithGoogle }/>
    </div>
);
```

We'll then revert to using a normal button for `GoogleLoginButton`. Update `package.json` to:
```json
{
    "main": "./GoogleLOginButtonComponent.jsx"
}
```

and the `GoogleLoginButtonComponent.jsx` file to:
```jsx
import React from 'react';
import Button from 'App/Client/Common/Components/Button';
import { ReactComponent as Logo } from './google-icon.svg';
import './style.css';

const GoogleLoginButton = ({ onClick }) => (
    <Button 
        onClick={onClick}
        fill="border" 
        size="large" 
        className="google-auth-btn" >
        Sign In with Google <Logo />
    </Button>
);

export default GoogleLoginButton;
```

Now, firebase will keep your session automatically.

## Setting Task Author

With this, we can try to add tasks that are now tagged to a certai user. Update `App/Client/Features/Tasks/Redux/actions.js`'s `addTask` function to:

```js
export const addTask = (taskValues) => {    
    return (dispatch, getState) => {
        const { user } = getState().authenticationReducers;
        if (!user) {
            throw new Error('Unathenticated');
        }

        const task = {
            id: generateUUID(),
            author: user.email,
            ...taskValues
        }

        storeTaskInFirestore(task)
            .then(dispatch({
                type: ADD_TASK,
                task
            }));        
    };
};
```

## Filtering Content by Author

First go to `App/Client/Features/Tasks/Redux/actions.js` and update:

Function `loadTasksPerDateAndDispatch`:
```js
const loadTasksPerDateAndDispatch = (date, user, dispatch) => {
    loadAllTasksInFirestore(user)
            .then(tasks => dispatch(
                {
                    type: RECEIVE_TASKS,
                    date,
                    tasks
                }
            ));
};
```

We'll have `loadAllTasksInFirestore` take in the user:

Function `receiveTasks`:
```js
export const receiveTasks = (date) => {
    return (dispatch, getState) => {
        const user = getState().authenticationReducers.user;
        loadTasksPerDateAndDispatch(date, user, dispatch);
    };
};
```

Function `toggleTaskStatus`:
```js
export const toggleTaskStatus = (task) => {
    return (dispatch, getState) => {
        dispatch({ type: TOGGLE_TASK, task });
        const user = getState().authenticationReducers.user;
        const { tasksBeingDisplayed } = getState().tasksReducers;
        const processedTask = tasksBeingDisplayed
            .find(taskBeingDisplayed => taskBeingDisplayed.id === task.id);
        
        updateTaskInFirestore(processedTask)
            .then(() => loadTasksPerDateAndDispatch(processedTask.date, user, dispatch));
    };
};
```

Finally, update `TaskFirestorePersistenceModule.js`'s `loadAllTasks` function to:
```js
export const loadAllTasks = (user) => {    
    const firestore = firebase.firestore();
    return new Promise((resolve, reject) => {
        firestore.collection(COLLECTION)
            .where('author' , '==', user.email)
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