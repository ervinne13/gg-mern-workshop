# Applying Redux

Redux is a specification on how to make data flow in one direction. Follow along the instructor as he quickly explain how redux works.

![redux flow](/img/redux-flow-02.png)

In React, it would look something like:

![redux flow](/img/redux-flow.png)

## Installing Redux in React

(If you've already installed this, you may skip)
```bash
npm install react-redux redux
```

The instructor would to emphasize a common practice that developers do is blindly integrate Redux with their React components. This hurts reusability and maintainability real quick.

## Presentational and Container Components

React bindings for Redux separate presentational components from container components. This approach can make your app easier to understand and allow you to more easily reuse components. Here's a summary of the differences between presentational and container components (but if you're unfamiliar, we recommend that you also read Dan Abramov's [original article describing the concept of presentational and container components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)):

## Separating Presentation and Redux Containers

(Excerpts from Dan Abramov)

You’ll find your components much easier to reuse and reason about if you divide them into two categories.

### Presentational Components

- Are concerned with how things look.
- May contain both presentational and container components** inside, and usually have some DOM markup and styles of their own.
- Often allow containment via this.props.children.
Have no dependencies on the rest of the app, such as Flux actions or stores.
- Don’t specify how the data is loaded or mutated.
- Receive data and callbacks exclusively via props.
- Rarely have their own state (when they do, it’s UI state rather than data).
- Are written as functional components unless they need state, lifecycle hooks, or performance optimizations.
- Examples: Page, Sidebar, Story, UserInfo, List.

### Container Components 

- Are concerned with how things work.
- May contain both presentational and container components** inside but usually don’t have any DOM markup of their own except for some wrapping divs, and never have any styles.
- Provide the data and behavior to presentational or other container components.
- Call Flux actions and provide these as callbacks to the presentational components.
- Are often stateful, as they tend to serve as data sources.
- Are usually generated using higher order components such as connect() from React Redux, createContainer() from Relay, or Container.create() from Flux Utils, rather than written by hand.
- Examples: UserPage, FollowersSidebar, StoryContainer, FollowedUserList.

## Back to ToDo

Anyway we'll get all these once we actually do something productive.

The first thing we need to do is to enumerate what are the actions that can affect state in our application. Let's break it down by feature:

### Actions from Calendar Feature
- Date is selected
    - Will affect what tasks are loaded
    - Change the date of a task being created

### Actions from Tasks Feature
- Page loaded / Ask to Receive Tasks given a date
    - Will change the currently displaying tasks in the tasks scene
- Delete Task
    - Will remove a task from our list
- Add Task
    - Creates a new task based on the current date selected
- Toggle Task Status
    - Changes the task's status from open to done and vice versa.

PS: with our current user interface, we don't have a way to update tasks (yet) so let's not bother with that for now.

## Defining Actions for Tasks

Actions in redux define what happened in our application create the new file `App/Client/Features/Tasks/Redux/actions.js`: with the contents:

```js
/** Action Types */
export const RECEIVE_TASKS = 'RECEIVE_TASKS';
export const ADD_TASK = 'ADD_TASK';
export const DELETE_TASK = 'DELETE_TASK';
export const TOGGLE_TASK = 'TOGGLE_TASK';

/** Action Creators */
export const receiveTasks = () => {
    //  let's use a demo data first
    return {
        type: RECEIVE_TASKS,
        tasks: demoData
    };
};

const demoData = [
    { text: 'Meeting with client @ 10 AM', status: 'done' },
    { text: 'Dentist appointment @ 2 PM', status: 'open' },
    { text: 'Ask about PC problems before going home', status: 'open' }
];

export const addTask = (task) => {
    return {
        type: ADD_TASK,
        task
    };
};

export const deleteTask = (task) => {
    return {
        type: DELETE_TASK,
        task
    };
};
```

Action types our our identifier to what happened. Inside each action is the relevant data to that action.

## Defining Reducers for Tasks

Reducers are code that knows how to mutate, provide, remove, data for every action that happens to our application.

The reducer is also the place where we can define the state (initial state) for the whole feature.

Let's first go back to our views and check what are the data that we need. At first iteration, we can say we'll need the following:

- list of tasks
- task being deleted

The list of task is self explanatory, the task being deleted is needed because when we delete task, we first show a modal right? So the instructor thinks it makes sense to have this recorded too.

Our initial state should look something like:

```js
const initialState = {
    tasksBeingDisplayed: [],
    taskBeingDeleted: null
}
```

Let's create a simple reducer first for Tasks, create the file `App/Client/Features/Tasks/Redux/reducers.js` with the contents:

```js
import {
    RECEIVE_TASKS,
    ADD_TASK,
    DELETE_TASK,
    TOGGLE_TASK
} from './actions';

const initialState = {
    tasksBeingDisplayed: [],
    taskBeingDeleted: null
}

const tasksReducer = (state = initialState, action) => {
    switch(action.type) {
        case RECEIVE_TASKS:
            return handleReceiveTasksActions(state, action);
        default:        
            return state;
    }
};

const handleReceiveTasksActions = (state, action) => {
    const tasksBeingDisplayed = [...action.tasks];
    return {...state, tasksBeingDisplayed};
};

export default tasksReducer
```

The first reducer we can do is setting tasks to the `TaskList` component at page load.

Reducers are simple, you have your "feature state" (since we divide our code by features). It is being maintained by this reducer and any action that happens, we get the data from that action and mutate our feature state based on it.

To test first, let's make redux work in our application

## Integrating Redux

Create a new Folder `App/Client/Redux` and inside it, two files:

File `ReduxWrapper.jsx`:
```jsx
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './rootReducer';

const store = createStore(rootReducer);

const ReduxWrapper = ({ children }) => (
    <Provider store={ store }>
        { children }
    </Provider>
);

export default ReduxWrapper;
```

File `rootReducer.jsx`:
```js
import { combineReducers } from 'redux'
import tasksReducers from 'App/Client/Features/Tasks/Redux/reducers';

export default combineReducers({
    tasksReducers
});
```

The component `ReduxWrapper` will be used to enable redux to a component (we'll use it at the root `App/Client/App` component) and the `rootReducer` will be used as the registry of all active reducers that we want enabled in redux.

Finally let's edit `App/Client/App.jsx` to make use of Redux by:

```jsx
import React from 'react';
import Routes from './Routes';
import ReduxWrapper from 'App/Client/Redux/ReduxWrapper';

const App = () => (
    <ReduxWrapper>
        <Routes />
    </ReduxWrapper>
);

export default App;
```

## Connecting Presentational Components Using Containers

This is one of the reasons why we use (abuse) directory descriptors (those package.json files with "main" inside) so much. Because we normally have at least 2 files per component, the presentational component, and the container.

Create the container `App/Client/Features/Tasks/Components/TaskList/TaskListContainer.js`

```js
import TaskListComponent from './TaskListComponent';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        tasks: state.tasksReducers.tasksBeingDisplayed
    };
};

export default connect(mapStateToProps)(TaskListComponent);
```

With the `connect` function, we can now map our reducer's state to the props of the component.

Finally, we update our `package.json` file to point to the container instead of the component:

```json
{
    "main": "./TaskListContainer.js"
}
```

PS: you might have to restart webpack after this since we edited a directory descriptor.

Test your view and we should now have a scene where there are no currently available tasks. This is our "initial state".

But now, how do we get the data? We now, "dispatch" actions.

## Dispatching Actions

To make the data available we need to dispatch the `RECEIVE_TASKS` action.

You might think that we would dispatch the action straight in the `TaskList` component. But we should dispatch this to the component that knows best when data should actually be loaded, a component where it makes sense to know about the date as well (we'll be basing our task list on the currently selected date later on).

The best candidate is the scene where the `TaskList` appears from.
Create the container `App/Client/Features/Tasks/Scenes/TaskListPerDate/TaskListPerDateContainer.js` with the content:

```js
import TaskListPerDateScene from './TaskListPerDateScene';
import { connect } from 'react-redux';
import { receiveTasks } from 'App/Client/Features/Tasks/Redux/actions';

const mapDispatchToProps = (dispatch) => {
    return {
        onReadyToReceiveTasks: () => dispatch(receiveTasks())
    }
}

export default connect(null, mapDispatchToProps)(TaskListPerDateScene);
```

Previously, we mapped "state" to our props, we can use the 2nd parameter of the `connect` function to map "dispatch" to props instead. The function `dispatch` is used to "dispatch" events to Redux, which will then be processed by our reducers.

Update your `package.json` to:
```json
{
    "main": "./TaskListPerDateContainer.js"
}
```

This won't work just yet. We need to be able to trigger `onReadyToReceiveTasks` that is mapped to the props of the component.

In your `TaskListPerDateScene` component, add a callback to `componentDidMount` like so:

```jsx
    componentDidMount() {
        if (this.props.onReadyToReceiveTasks) {
            this.props.onReadyToReceiveTasks();
        }
    }
```

Note: also delete the demo data there as we don't need it anymore. Remove the const `demoData` and the `tasks={demoData}` in `render` function's `<TaskList>`.

But that's for temporary demonstration only. After testing, let's remove dispatching `receiveTasks` for now as this will be a problem later on because we are merely using hardcoded data.

Update `TaskListPerDateContainer` to:

```js
import TaskListPerDateScene from './TaskListPerDateScene';
import { connect } from 'react-redux';
// import { receiveTasks } from 'App/Client/Features/Tasks/Redux/actions';

// const mapDispatchToProps = (dispatch) => {
//     return {
//         onReadyToReceiveTasks: () => dispatch(receiveTasks())
//     }
// }

export default connect(null, null)(TaskListPerDateScene);
```

To comment out forced receiving of tasks for now and the UI should be empty again.

## Implementing Add Task Action

Now we'll enable being able to create new tasks. Add a container `App/Client/Features/Tasks/Forms/TaskFormContainer.js`

```js
import TaskForm from './TaskForm';
import { connect } from 'react-redux';
import { addTask } from 'App/Client/Features/Tasks/Redux/actions';

const mapDispatchToProps = dispatch => {
    return {
        onSaveTask: task => dispatch(addTask(task))
    }
};

export default connect(null, mapDispatchToProps)(TaskForm);
```

Then update your directory descriptor to:

```json
{
    "main": "./TaskFormContainer.js"
}
```

Good thing that the `onSaveTask` is already in place. However, we would need to add some code to the form so that it would redirect somewhere once it's done saving a task.

Add import to Redirect to the `TaskForm` component.

```js
import { Redirect } from 'react-router-dom';
```

then add `taskSubmitted: false,` in the state in the constructor. Update this state when `triggerSaveTask` is called. Add the follow at the end of the `triggerSaveTask` function:

```js
this.setState({ taskSubmitted: true });
```

Lastly, add a checker that will redirect if task is submitted successfully:

```jsx
    if (this.state.taskSubmitted) {
        return <Redirect to="/tasks/2019-05-19" />
    }
```

PS: For now, let's hardcode the date, we'll change this later on.


__Implementing the Reducer__

Now let's add a reducer to handle new tasks and add it to the state:

in your `App/Client/Features/Tasks/Redux/reducers.js`, add the function:

```js
const handleAddTaskAction = (state, action) => {
    const tasksBeingDisplayed = [
        ...state.tasksBeingDisplayed,
        action.task
    ];

    return { ...state, tasksBeingDisplayed };
};
```

.. then add a case in our reducer to call this function:
```js

case ADD_TASK:
    return handleAddTaskAction(state, action);
```

Test and you should now be able to add tasks to the main page. This generates and issue that the tasks does not have a unique key prop. This is because we don't generate an id for the tasks yet.

## ID Generation

Normally we employ a track number management system but that requires a bit of effort so for now, let's google a code that can generate ids. 

Create a new file inside src called `Domain/Identification/Services/IDGenerationService.js` with the contents:

```js
export const generateUUID = () => {
    //  taken directly from: 
    //  https://codepen.io/Jvsierra/pen/BNbEjW
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
      
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +s4() + '-' + s4() + s4() + s4();
};
```

Then update your actions in `App/Client/Features/Tasks/Redux/actions.js`'s `addTask` action creator to:

```js
export const addTask = (taskValues) => {
    const task = {
        id: generateUUID(),
        ...taskValues
    }
    return {
        type: ADD_TASK,
        task
    };
};
```

Of course, don't forget to import `generateUUID`:

```js
import { generateUUID } from 'Domain/Identification/Services/IDGenerationService';
```

You may be thinking, why not put id generation on the reducer? Reducers should be deterministic as much as possible. ID generation is usually not. Moreover, in the real world, you generate ID in the backend and strictly not in the frontend as you need to have some sort of sequence management system (kinda like what PostgreSQL does or usual Tracking Number Management systems in ERPs).

Finally, update the `TaskListComponent` to:

```jsx
//  ...
const TaskListComponent = ({ tasks }) => (
    <ul className="task-list">
        {tasks.map(task => 
            <li key={task.id}>
                <Task task={task} />
            </li>
        )}
    </ul>
);
//  ...
```

## Toggling Tasks

