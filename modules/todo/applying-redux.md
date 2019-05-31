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

export const toggleTaskStatus = (task) => {
    return {
        type: TOGGLE_TASK,
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

Let's create a handler in the reducer to update the state of a tasks when it's status is toggled:

```js
const handleToggleTaskAction = (state, action) => {
    const tasksBeingDisplayed = [ ...state.tasksBeingDisplayed ].map(task => {
        const idMatches = action.task.id === task.id;
        const isOpen = task.status === 'open';
        if (idMatches && isOpen) {
            return { ...task, status: 'done' };
        } else if (idMatches && !isOpen) {
            return { ...task, status: 'open' };
        } else {
            return task;
        }
    })

    return { ...state, tasksBeingDisplayed };
};
```

... and of course, call it in the reducer for the matching action type:

```js
case TOGGLE_TASK:
    return handleToggleTaskAction(state, action);
```

Then we'll connect the `Task` component directly (instead of the list since that component already has the infor about the task).

Create the container `App/Client/Features/Task/Components/Task/TaskContainer.js` with the contents:

```js
import TaskComponent from './TaskComponent';
import { connect } from 'react-redux';
import { toggleTaskStatus } from 'App/Client/Features/Tasks/Redux/actions';

const mapDispatchToProps = dispatch => {
    return {
        onToggle: task => dispatch(toggleTaskStatus(task))
    }
};

export default connect(null, mapDispatchToProps)(TaskComponent);
```

... to dispatch `toggleTaskStatus` whenever `onToggle` is triggered.

Lastly, we'll point to the container in our directory descriptor:

File `package.json`:
```json
{
    "main": "./TaskContainer.js"
}
```

And that's it!

## Handling Deletion (Version 1)

Let's try deleting tasks without modal first. Update the task container to map `onRemove` props to dispatch as well:

```js
    onRemove: task => dispatch(deleteTask(task))
```

... also update the import:

```js
import { toggleTaskStatus, deleteTask } from 'App/Client/Features/Tasks/Redux/actions';
```

Then implement actual deletion in our redux by adding the handler in our reducers file:

```js
const handleRemoveTaskAction = (state, action) => {
    const tasksBeingDisplayed = [ ...state.tasksBeingDisplayed ]
        .filter(task => action.task.id !== task.id);

    return { ...state, tasksBeingDisplayed };
};
```

Then register it in the reducer by adding a case:

```js
case DELETE_TASK:
    return handleRemoveTaskAction(state, action);
```

Testing in the browser should now remove a task on delete.

## Handling Deletion (Version 2 - with Modal)

Let's first add the modal in the scene that it should appear on.

Update the `TaskListPerDateScene` component in `App/Client/Features/Tasks/Scenes/` to:

```jsx
import React, { Fragment } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Link } from 'react-router-dom';
import Modal from 'App/Client/Common/Components/Modal';
import Button from 'App/Client/Common/Components/Button';
import VerticalDateNavigator from 'App/Client/Features/Calendar/Components/VerticalDateNavigator';
import TaskList from 'App/Client/Features/Tasks/Components/TaskList';
import ConfirmDeletion from 'App/Client/Features/Tasks/Components/ConfirmDeletion';
import './style.css';

class TaskListPerDateScene extends React.Component {
    
    componentDidMount() {
        if (this.props.onReadyToReceiveTasks) {
            this.props.onReadyToReceiveTasks();
        }
    }

    render() {
        const { isConfirmDeletionModalOpen } = this.props;
        return (
            <Fragment>
                <Modal isOpen={isConfirmDeletionModalOpen}>
                    <ConfirmDeletion />
                </Modal>
                <Grid>
                    <Row>
                        <Col sm={12} md={4}>
                            <VerticalDateNavigator selectedDate={new Date()} />
                        </Col>
                        <Col sm={12} md={8}>
                            <div className="task-list-header">
                                <h1>Tasks</h1>
                                <Link to="/tasks/create">
                                    <Button size="large">+ Create New</Button>
                                </Link>
                            </div>
                            <TaskList />
                        </Col>
                    </Row>
                </Grid>
            </Fragment>
           
        );
    }
}

export default TaskListPerDateScene;
```

Then update `TaskListPerDateContainer` to:

```jsx
import TaskListPerDateScene from './TaskListPerDateScene';
import { connect } from 'react-redux';
// import { receiveTasks } from 'App/Client/Features/Tasks/Redux/actions';

const mapStateToProps = (state) => {
    const isConfirmDeletionModalOpen = !!state.tasksReducers.taskBeingDeleted
    return {
        isConfirmDeletionModalOpen
    };
};

// const mapDispatchToProps = (dispatch) => {
//     return {
//         onReadyToReceiveTasks: () => dispatch(receiveTasks())
//     }
// }

export default connect(mapStateToProps, null)(TaskListPerDateScene);
```

This will check if we have a value in taskBeingDeleted and open the modal according to it.

### Splitting Actions

Now we need to split the DELETE_TASK action into two, the intent to delete and the actual deletion, we also need to create an action for cancelling task deletion. Create a new action type by adding the following code in your `App/Client/Features/Tasks/Redux/actions.js`

```js
export const REQUEST_TASK_DELETION = 'REQUEST_TASK_DELETION';
export const CANCEL_TASK_DELETION = 'CANCEL_TASK_DELETION';
```

and it's action creator:

```js
export const requestTaskDeletion = (task) => {
    return {
        type: REQUEST_TASK_DELETION,
        task
    };
};

export const cancelTaskDeletion = () => {
    return { type: CANCEL_TASK_DELETION };
};
```

Now update your reducer and add the handler:

```js
const handleRequestTaskDeletion = (state, action) => {
    const taskBeingDeleted = { ...action.task };
    return { ...state, taskBeingDeleted };
};
```

and register it:

```js
case REQUEST_TASK_DELETION:
    return handleRequestTaskDeletion(state, action);
```

Then change the action dispatched in the `App/Client/Features/Tasks/Components/Task/TaskContainer.js` from:

```js
onRemove: task => dispatch(deleteTask(task))
```

to

```js
onRemove: task => dispatch(requestTaskDeletion(task))
```

also update your import to import `requestTaskDeletion` instead of `deleteTask`.

Now deleting tasks should automatically open the modal instead of deleting the task right away.

Now let's attach the actual deletion in the modal.

Create a new container `App/Client/Features/Tasks/ConfirmDeletionContainer.js` with the following contents:

```js

import ConfirmDeletionComponent from './ConfirmDeletionComponent';
import { connect } from 'react-redux';
import { deleteTask, cancelTaskDeletion } from 'App/Client/Features/Tasks/Redux/actions';

const mapDispatchToProps = (dispatch) => {
    return {
        onConfirm: task => dispatch(deleteTask(task)),
        onCancel: () => dispatch(cancelTaskDeletion())
    };
};

export default connect(null, mapDispatchToProps)(ConfirmDeletionComponent);
```

We have a problem though, we havent set the `ConfirmDeletionComponent` to know about the task being deleted. Let's fix that real quick and edit it by adding the `task` to the props:

```jsx
const ConfirmDeletionComponent = ({ task, onConfirm, onCancel }) => (
    <div className="confirm-deletion-prompt">
        <div className="message">
            <h1>Are you sure you want to remove this task?</h1>
            <p>This action cannot be undone</p>
        </div>
        <div className="actions">
            <FlatButton type="danger" onClick={() => onConfirm(task)}>Remove</FlatButton>
            <FlatButton type="grey" onClick={() => onCancel()}>Cancel</FlatButton>
        </div>
    </div>
);
```

But now, we'll have to fill that missing task, we can simply write a `mapStateToProps` in the same container. The container should now look like:

```js
import ConfirmDeletionComponent from './ConfirmDeletionComponent';
import { connect } from 'react-redux';
import { deleteTask, cancelTaskDeletion } from 'App/Client/Features/Tasks/Redux/actions';

const mapStateToProps = (state) => {
    return {
        task: state.tasksReducers.taskBeingDeleted
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onConfirm: task => dispatch(deleteTask(task)),
        onCancel: () => dispatch(cancelTaskDeletion())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmDeletionComponent);
```

Finally, point the directory descriptor to the container:
```json
{
    "main": "./ConfirmDeletionContainer.js"
}
```

Now confirming deletion should actually delete the task. But it does not close the modal. To make this happen, we can update the `handleRemoveTaskAction` in the actions and reset the `taskBeingDeleted` for every successfully deleted task.

```js
const handleRemoveTaskAction = (state, action) => {
    const taskBeingDeleted = null;
    const tasksBeingDisplayed = [ ...state.tasksBeingDisplayed ]
        .filter(task => action.task.id !== task.id);

    return { ...state, tasksBeingDisplayed, taskBeingDeleted };
};
```

Nice, cancel does not work yet though. Let's quickly fix that by adding a new reducer handler:

```js
const handleCancelTaskDeletion = (state) => {
    const taskBeingDeleted = null;
    return { ...state, taskBeingDeleted };
};
```

... and registering it in the reducer's switch case:

```js
case CANCEL_TASK_DELETION:
    return handleCancelTaskDeletion(state);
```

And, all done!

# Dividing Tasks by Date

Reviewing the "Actions from Calendar Feature" section earlier. We only really have 1 action for the Calendar feature. We can choose to create a new set of redux setup for the Calendar.

For the instructor though, this is more trouble than it's worth. Let's just slap in an `Link` to each `CalendarLinkItem` instead since we're basing on the url anyway:

Update `App/Client/Features/Calendar/Components/CalendarLinkItem.jsx`'s `const CalendarLinkItemComponent` code to:

```jsx
const CalendarLinkItemComponent = ({ taskMessage, taskHighlight, date, isActive }) => {
    const dateObj = new Date(date);
    const dateString = moment(dateObj).format("YYYY-MM-DD");

    return (
        <Link to={ `/tasks/${dateString}` }>
            <div className={`calendar-link-item ${isActive ? "-is-active" : ""}`}>
                <div className="calendar-link-item-content">
                    <DayOfWeek date={dateObj} />
                    <TaskStatus highlight={taskHighlight}>{taskMessage}</TaskStatus>
                </div>
                <DayOfMonth date={dateObj} />
            </div>
        </Link>
    );
};
```

and import the following:

```js
import Moment from 'react-moment';
import moment from 'moment';
import { Link } from 'react-router-dom';
```

## Making Form Date Aware

Now that we can nagivate through dates, let's first update our routes since the form does not know about the date. Update `App/Client/Routes.jsx` and change `/tasks/create` to `/tasks/:date/create`.

```jsx
    <Route exact path="/tasks/:date/create" component={ TaskFormPerDateScene } />
```

We'll also have to update the scene that links to the form. Update `App/Client/Features/Tasks/Scenes/TaskListPerDateScene.jsx`, in the `render` function, update the  `Link`'s `to` property from `"/tasks/create"` to `{ `/tasks/${date}/create` }` and add the variable date by:

```js
const date = this.props.match.params.date;
```

Do the same for `VerticalDateNavigator`'s `selectedDate` property.

Your render function should now look something like:

```jsx
    render() {
        const { isConfirmDeletionModalOpen } = this.props;
        const date = this.props.match.params.date;
        return (
            <Fragment>
                <Modal isOpen={isConfirmDeletionModalOpen} hideDefaultCloseButton={true}>
                    <ConfirmDeletion />
                </Modal>
                <Grid>
                    <Row>
                        <Col sm={12} md={4}>
                            <VerticalDateNavigator selectedDate={ date } />
                        </Col>
                        <Col sm={12} md={8}>
                            <div className="task-list-header">
                                <h1>Tasks</h1>
                                <Link to={ `/tasks/${date}/create` }>
                                    <Button size="large">+ Create New</Button>
                                </Link>
                            </div>
                            <TaskList />
                        </Col>
                    </Row>
                </Grid>
            </Fragment>
           
        );
    }
```

Let's do the same for `App/Client/Features/Tasks/Scenes/TaskFormPerDateScene.jsx` and pass in the `date` to both `VerticalDateNavigator` and `TaskForm`.

File `TaskFormPerDateScene.jsx`'s `render` function:

```jsx
    render() {
        const date = this.props.match.params.date;
        return (
            <Grid>
                <Row>
                    <Col sm={12} md={4}>
                        <VerticalDateNavigator selectedDate={date} />
                    </Col>
                    <Col sm={12} md={8}>                        
                        <TaskForm date={ date }/>
                    </Col>
                </Row>
            </Grid>
        );
    }
```

IMPORTANT! The prop `match` is only available in components that are used directly by the `BrowserRouter`. This is the reason why we are only getting this from the scene components and not directly in the components that need them.

We can now remove the hardcoded date redirect in the `App/Client/Features/Tasks/Forms/Task/TaskForm.jss`'s `render` function:
```js
    if (this.state.taskSubmitted) {
        const { date } = this.props;
        return <Redirect to={ `/tasks/${date}` } />
    }
```

Let's also update `triggerSaveTask` to include the date when triggering the `onSaveTask` callback:

```js
    triggerSaveTask = (event) => {
        event.preventDefault();
        if (!this.validateTask(this.state.task)) {
            return;
        }

        if (this.props.onSaveTask) {
            const { date } = this.props;
            const task = { ...this.state.task, date };
            this.props.onSaveTask(task);
        }

        this.setState({ taskSubmitted: true });
    }
```

### Filtering Tasks Per Date

This is data related, so if our methods are correct so far, we do not have to update anything in the presentational components anymore.

Let's review first. In the tasks feature's reducer, we only really maintain state for `tasksBeingDisplayed`. Now though, we can maintain a new array called `tasks` that contains all the tasks regardless of the date. We would have to know the date though so we'll add a new state `currentDateSelected`.

In `App/Client/Features/Tasks/Redux/reducers.js`, update your initial state to:

```js
const initialState = {
    currentDateSelected: null,
    tasks: [],
    tasksBeingDisplayed: [],
    taskBeingDeleted: null
}
```

Let's then update the `TaskListPerDateContainer` to use the previously commented out code but include the date this time:

```js
import TaskListPerDateScene from './TaskListPerDateScene';
import { connect } from 'react-redux';
import { receiveTasks } from 'App/Client/Features/Tasks/Redux/actions';

const mapStateToProps = (state) => {
    const isConfirmDeletionModalOpen = !!state.tasksReducers.taskBeingDeleted
    return {
        isConfirmDeletionModalOpen
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onReadyToReceiveTasks: date => dispatch(receiveTasks(date))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListPerDateScene);
```

We will have a problem here though, onReadyToReceiveTasks currently only triggers on page load since we attached it to `componentDidMount`. If the date changes, React, being an SPA first, will just re render components instead of refreshing the  page (good).

So we'll have to trigger `onReadyToReceiveTasks` when the component updates as well. Let's then hook to `componentDidUpdate`. Update `TaskListPerDateScene` and set the following functions:

```jsx
    componentDidMount() {    
        this.triggerOnReadyToReceiveTasks();
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.date !== prevProps.match.params.date) {
            this.triggerOnReadyToReceiveTasks();
        }
    }

    triggerOnReadyToReceiveTasks() {
        if (this.props.onReadyToReceiveTasks) {
            const date = this.props.match.params.date;
            this.props.onReadyToReceiveTasks(date);
        }
    }
```

Here, we extracted the common code to a new function `triggerOnReadyToReceiveTasks` and called it to both `componentDidMount` and `componentDidUpdate` with `componentDidUpdate` conditionally updating only if the date really changed.

Let's then update our actions by letting `receiveTasks` get date instead of the tasks instead. Update the relevant function in the file `App/Client/Features/Tasks/Redux/actions.js`:

```js
export const receiveTasks = (date) => {
    return {
        type: RECEIVE_TASKS,
        date
    };
};
```

Then in `App/Client/Features/Tasks/Redux/reducers.js`, update the `handleReceiveTasksActions` handler to:

```js
const handleReceiveTasksActions = (state, action) => {
    const currentDateSelected = action.date;
    const tasksBeingDisplayed = state.tasks.filter(task => task.date === currentDateSelected);
    return { ...state, tasksBeingDisplayed, currentDateSelected };
};
```

This handler now functions to filter the `tasksBeingDisplayed` from the `tasks` state.

Now let's update the other handlers so that they update the `tasks` instead of the `tasksBeingDisplayed` directly:

```js
const handleAddTaskAction = (state, action) => {
    const tasks = [
        ...state.tasks,
        action.task
    ];

    return { ...state, tasks };
};

const handleToggleTaskAction = (state, action) => {
    const tasks = toggleTaskFromCollection([ ...state.tasks ], action);
    const tasksBeingDisplayed = toggleTaskFromCollection([ ...state.tasksBeingDisplayed ], action);

    return { ...state, tasks, tasksBeingDisplayed };
};

const toggleTaskFromCollection = (tasks, action) => {
    return tasks.map(task => {
        const idMatches = action.task.id === task.id;
        const isOpen = task.status === 'open';
        if (idMatches && isOpen) {
            return { ...task, status: 'done' };
        } else if (idMatches && !isOpen) {
            return { ...task, status: 'open' };
        } else {
            return task;
        }
    })
};

const handleRemoveTaskAction = (state, action) => {
    const taskBeingDeleted = null;
    const tasks = [ ...state.tasks ].filter(task => action.task.id !== task.id);
    const tasksBeingDisplayed = [ ...state.tasksBeingDisplayed ].filter(task => action.task.id !== task.id);

    return { ...state, tasks, tasksBeingDisplayed, taskBeingDeleted };
};
```

# Fixing Storybook After Updates

## Related to Routing

The component `Link` cannot be used outside browser routers. So update the calendar related storybooks and add the decorator:

```jsx
    .addDecorator(story => (
        <BrowserRouter>
            <Route path="*" component={ () => story() } />
        </BrowserRouter>
    ))
```

after importing `BrowserRouter` and `Route` with:

```jsx
import { BrowserRouter, Route } from 'react-router-dom';
```

This generates an issue though. The story source displays the `BrowserRouter` instead of our component. This is an ongoing issue with Storybook and it seems our only option for now is to wait for updates on their end.

## Related to Containers

After adding containers, check your storybook. A number of components should have errors. This is because we are trying to render "Containerized" components in storybook whereas we are only really interested in the components.

Simply importing the components directly (ignoring directory descriptor) should fix this. Update your imports to:

```js
import React from 'react';
import { storiesOf } from '@storybook/react';
import Modal from 'App/Client/Common/Components/Modal';
import Task from 'App/Client/Features/Tasks/Components/Task/TaskComponent';
import TaskList from 'App/Client/Features/Tasks/Components/TaskList/TaskListComponent';
import TaskForm from 'App/Client/Features/Tasks/Forms/Task/TaskForm';
import ConfirmDeletion from 'App/Client/Features/Tasks/Components/ConfirmDeletion/ConfirmDeletionComponent';
```