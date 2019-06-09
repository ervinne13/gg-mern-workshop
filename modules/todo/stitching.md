# Stitching Scenes

Stitching is the act of actually combining your components, forms, and other scenes to form a web page. In this project, we pretty much have 3 scenes:

- Landing / Auth
- Task List Per Date
- Task Form Per Date

## Stitching Landing Page

First, export the orange tie icon from the Adobe XD file into an SVG and paste it to to the folder of the scene `App/Client/Features/Landing/Scenes/Landing`. Then update `LandingScene.jsx`'s content to:

```jsx
import React from 'react';
import { ReactComponent as Logo } from './bus-tie-orange.svg';
import GoogleLoginButton from 'App/Client/Features/Landing/Components/GoogleLoginButton';
import './style.css';

const LandingScene = () => (
    <div className="landing-scene">
        <Logo />
        <h1>To Do Tasks by Ground Gurus</h1>
        <GoogleLoginButton />
    </div>
);

export default LandingScene;
```

... then let's create styling by creating the file `style.css` in the same folder with the contents:

```css
.landing-scene {
    margin-top: 50px;
    text-align: center;
}
```

... and we're done! Let's move on to the next component

## Stitching Task List Per Date

Now this is a bit complicated than earlier. To the left is the `VerticalDateNavigator` and the main content at the right/center is composed of a title, a button, and the `TaskList` component.

First, let's use a grid system that's available to react by default instead of making our own manually:

(If you already installed react-flexbox-grid earlier, you don't need to execute the script below)
```bash
npm install react-flexbox-grid
```

### Demonstrating the Flexbox

Update your `TaskListPerDateScene.jsx` to the code below:

```jsx
import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';

class TaskListPerDateScene extends React.Component {
    render() {
        return (
            <Grid>
                <Row>
                    <Col sm={12} md={4}>
                        <h1>Hi I'm the left panel</h1>
                    </Col>
                    <Col sm={12} md={8}>
                        <h1>Hi I'm the right panel</h1>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default TaskListPerDateScene;
```

... and test in your browser to see the panels divided.

Now let's actually stitch the components while using demo data.

File `TaskListPerDateScene.jsx`
```jsx
import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Link } from 'react-router-dom';
import Button from 'App/Client/Common/Components/Button';
import VerticalDateNavigator from 'App/Client/Features/Calendar/Components/VerticalDateNavigator';
import TaskList from 'App/Client/Features/Tasks/Components/TaskList';
import './style.css';

class TaskListPerDateScene extends React.Component {
    render() {
        return (
            <Grid>
                <Row>
                    <Col sm={12} md={4}>
                        <VerticalDateNavigator selectedDate={new Date()} />
                    </Col>
                    <Col sm={12} md={8}>
                        <div class="task-list-header">
                            <h1>Tasks</h1>
                            <Link to="/tasks/create">
                                <Button size="large">+ Create New</Button>
                            </Link>
                        </div>
                        <TaskList tasks={demoData} />
                    </Col>
                </Row>
            </Grid>
        );
    }
}

const demoData = [
    { text: 'Meeting with client @ 10 AM', status: 'done' },
    { text: 'Dentist appointment @ 2 PM', status: 'open' },
    { text: 'Ask about PC problems before going home', status: 'open' }
];

export default TaskListPerDateScene;
```

Now your scene should look real:

![task list scene](/img/task-list-per-date-scene.png)

## Stitching Task Form Per Date

We'll be doing pretty much the same thing earlier but with different components.
Update `TaskFormPerDateScene.jsx` file to:

```jsx
import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import VerticalDateNavigator from 'App/Client/Features/Calendar/Components/VerticalDateNavigator';
import TaskForm from 'App/Client/Features/Tasks/Forms/Task';

class TaskFormPerDateScene extends React.Component {
    render() {
        return (
            <Grid>
                <Row>
                    <Col sm={12} md={4}>
                        <VerticalDateNavigator selectedDate={new Date()} />
                    </Col>
                    <Col sm={12} md={8}>                        
                        <TaskForm />
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default TaskFormPerDateScene;
```

## Adding Behavior and Upper Level State Management

Normally, if you're developing a website you can just make use of React Context ([documentation here](https://reactjs.org/docs/context.html)) but since we have data that can go to and from many places, deciding to use Redux in this case is not a bad idea.

[Click here to navigate to next lesson](/modules/todo/applying-redux.md) discussing about how we can apply Redux.