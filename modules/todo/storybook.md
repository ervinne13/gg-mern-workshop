# Building React User Interfaces Following Atomic Design

We've learned in the previous sessions that in developing React based applications, we need to be "thinking in react". In summary, that means we think of our interface as blocks of reusable components that we can just "stitch".

Open this [link](https://xd.adobe.com/view/cdc8394c-8a65-42ad-56af-3d559771ce3e-bbf9/) to view the user interface plan.

## Identifying the Components

Follow along the instructor as he walks you through the XD file that contains the sample user interface. In summary, the components that we should be able to produce are the following:

__Splash/Login Feature__
- Logo & Title
- Bordered Button

__Calendar Feature__
- Calendar Link Item
- Vertical Date Navigator

__TODO/Tasks Feature__
- Main Header
- Primary Button
- Task
- Task Form
- Confirm Delete Modal

## State Shape Planning

Now that we have the components, we have to determine the properties that such components should be given or maintain as a state of its own.

### Calendar Feature State Shapes

__`CalendarLinkItem`__

![Calendar link item](/img/calendar-link-item.png)

Both the day of week (Monday, Tuesday, etc.) and the day of month (1st, 2nd, 6th, etc) can be displayed by a single `Date` object so let's have that.

As for the message (5 Tasks Open, No Tasks, etc.) let's just make this a free text where we can change the highlight.

We'll also need to account for when this component is "selected" or highlighted so let's introduce an `isActive` property that just defautls to false.

```js
const props = {
    taskHighlight: [String one of "primary"|"info"],
    taskMessage: [String],
    date: [Date],
    isActive: [Boolean]
};
```

__`VerticalDateNavigator`__

![Vertical Date Navigator](/img/vertical-date-navigator.png)

For the calendar feature, we'll obviously need some sort of array of dates. We can also integrate the some sort of "task summary" but integrating that directly would very likely make it difficult later on when we try to query.

What we can do is let the `VerticalDateNavigator` component manage the dates itself and we just pass in an array of "task summary" objects that it can match against dates.

So internally it would have something like:
```js
const internalState = {
    referenceDate: [Date],
    displayDateSet: [Array of Date]
}
```

And as props:
```js
const props = {
    selectedDate: [Date],
    tasksSummary: [
        {date: '2019-05-01',taskCount: 5,doneTaskCount: 0},
        {date: '2019-05-02',taskCount: 0,doneTaskCount: 0},
        {date: '2019-05-03',taskCount: 6,doneTaskCount: 3},
        …  
    ]
};
```

Then we can just pre-process each `taskSummary` object before passing anything in the `CalendarLinkItem` 

### ToDo/Tasks Feature State Shapes

__`Task`__

![Task](/img/task.png)

A task can be "Open" or "Done" where the text is striked through. This is actually pretty easy, we just need a text to display about the task and its status:

```js
const props = {
    text: [String],
    status: [String one of "Open"|"Done"]
};
```

The same props/state apply to the form.


## Creating the Palette through Storybook

Install Storybook for React with:

```bash
npm install -D @storybook/react
```

Make sure that you have react, react-dom, @babel/core, and babel-loader in your dependencies as well because we list these as a peer dependencies:

Then add a script in your `package.json` file:

```json
{
    "scripts": {
        "storybook": "start-storybook"
    }
}
```

For a basic Storybook configuration, the only thing you need to do is tell Storybook where to find stories.

To do that, create a file at `.storybook/config.js` with the following content:

```jsx
import { configure } from '@storybook/react';
import 'App/Client/index.css';

function loadStories() {
  require('./stories/buttons.js');
  // You can require as many stories as you need.
}

configure(loadStories, module);
```

That’ll load stories in `.storybook/stories/buttons.js`. You can choose where to place stories, you can co-locate them with source files, or place them in an other directory.

Lets now write our first story, a logo for the application:

```jsx
import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Button', module)
    .add('bordered (Google Login)', () => (
        <h1>Hello, I'm just a placeholder component, replace me later :)</h1>
    ));
```

Then run our storybook with:

```bash
npm run storybook
```

As it is, it can only display the actual component, we can step this up further by making use of storybook infos. Install:

```bash
npm i -D @storybook/addon-info
```

Then update your `.storybook/config.js` to apply global configurations:

```jsx
import { configure, addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import 'App/Client/index.css';

function loadStories() {
    require('./stories/index.js');
    // You can require as many stories as you need.
}

addDecorator(
    withInfo({
        inline: true, 
        header: false, 
        source: true,
    })
);

configure(loadStories, module);
```

You may also apply configuration per story. If you're interested in that, see this reference: [Storybook Addons Info](https://github.com/storybooks/storybook/tree/master/addons/info)

All in all, you should see something like:

![Storybook 1](/img/storybook-01.png)

## Our First Component: Bordered Button

Create the component `App/Client/Common/Components/BorderedButton.jsx`

```jsx
import React from 'react';
import './style.css';

const BorderedButton = ({ children, ...props }) => (
    <button className="bordered-btn -color-main" { ...props }>
        {children}
    </button>
);

export default BorderedButton;
```

Create its style by creating a `style.css` file next to it with the contents

```css
.bordered-btn.-color-main {
    border: 2px solid #F28123;
    border-radius: 6px;
    background: white;

    padding: 8px;
    cursor: pointer;
}

.bordered-btn.-color-main:active {
    background: whitesmoke;
    border: 2px solid #DF6E11;
    outline: none;
}

.bordered-btn.-color-main:focus {    
    outline: none;
}
```

Lastly, enable importing this component using the folder by creating a directory descriptor - `package.json` next to it:

```json
{
    "main": "./BorderedButtonComponent.jsx"
}
```

With this, you may import the `BorderedButton` this way:

```jsx
//  Good!
import BorderedButton from 'App/Client/Common/Components/BorderedButton';
```

instead of the longer and repititive:

```jsx
//  Bad!
import BorderedButton from 'App/Client/Common/Components/BorderedButton/BorderedButtonComponent';
```

## Protecting Components with Prop Types

First, install prop types with:

(If you've already installed prop-types, you don't need to execute the script below)
```bash
npm install prop-types
```

We may require the border button's content by making the "children" required:

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

const BorderedButton = ({ children, ...props }) => (
    <button className="bordered-btn -color-main" { ...props }>
        {children}
    </button>
);

BorderedButton.propTypes = {
    children: PropTypes.node.isRequired
};

export default BorderedButton;
```

## Updating Storybook

Let's display the buttons by updating our `buttons.js` storybook file:

```jsx
import React from 'react';
import { storiesOf } from '@storybook/react';
import BorderedButton from 'App/Client/Common/Components/BorderedButton';

storiesOf('Bordered Button', module)
    .add('with plain text', () => (
        <BorderedButton >Hi I'm Bordered Button</BorderedButton>
    ))
    .add('with on click', () => (
        <BorderedButton onClick={ () => alert('do something here') }>
            Click Me!
        </BorderedButton>
    ))
```

If you try to open this in storybook or just start the storybook, it's very likely that you'll encounter an error. If you do, that's because storybook does not know where to look for imports starting at `App/Client` etc.

We can tell storybook about it by adding a webpack config for it. Create the file `.storybook/webpack.config.js` with the contents:

```js
const path = require('path');

module.exports = {
    resolve: {
        modules: [path.resolve(__dirname, "../src"), "node_modules"],
    },
    module: {
        rules: [
            {
                test: /\.svg$/,
                loader: 'raw-loader',
                include: path.resolve(__dirname, '../')
            }
        ]
    }
   
}
```

`resolve.modules` add `../src` to the folders that will be read by Storybook's Webpack and `module.rules` will add svg support which we will be needing later on.

Restart your storybook and it should should look something like:

![Storybook 02](/img/storybook-02.png)

## Implementing Google Auth Button From Bordered Button

If you use Adobe XD, you can select icons that we've imported there and export them as SVG. We can then use them in our application.

Create a new folder `App/Client/Features/Landing/Components/GoogleLoginButton` and paste the svg icon there. In the same folder, create the component `GoogleLoginButtonComponent.jsx` and the directory descriptor similar to what we did before.

File `GoogleLoginButtonComponent.jsx`:
```jsx
import React from 'react';
import BorderedButton from 'App/Client/Common/Components/BorderedButton';
import { ReactComponent as Logo } from './google-icon.svg';
import './style.css';

const GoogleLoginButton = () => (
    <BorderedButton size="large" className="google-auth-btn" onClick={() => handleGoogleAuthentication()}>
        Sign In with Google <Logo />
    </BorderedButton>
);

const handleGoogleAuthentication = () => {
    console.log('Pending Feature :)');
};

export default GoogleLoginButton;
```

File `style.css`

```css
.google-auth-btn svg {
    vertical-align: middle;
    margin-left: 10px;
    height: 16px;
    width: 16px;    
}

.google-auth-btn {    
    min-width: 30%;
}
```

Present the component in the Storybook by adding:
```jsx
.add('google login', () => (
        <GoogleLoginButton size="large" />
    ), {
        info: {
            text: "Try resizing the container, this button's width is 30% of the parent"
        }
    })
```

## Adding a Primary Button

We can just create a new component called `PrimaryButton` to implement this but you should notice that it's functionality is pretty much the same as the `BorderedButton`.
We will be repeating code if we did that.

What we can do instead is refactor. Change `BorderedButton` into something more generic and parameterize the style. The property `style` is reserved though so we can use something like fill="border|background" instead.

### Refactoring `BorderedButton`

Create a new component `App/Client/Common/Components/Button/ButtonComponent` with the content:

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

const Button = ({ children, fill, size, className, ...props }) => (
    <button className={`round-corner-btn fill-${fill} -color-main -size-${size} ${className}`} {...props}>
        {children}
    </button>
);

Button.defaultProps = {
    size: 'regular',
    className: '',
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    fill: PropTypes.oneOf(['border', 'background']),
    size: PropTypes.oneOf(['regular', 'large']),
};

export default Button;
```

Its `style.css` should be:
```css

button.fill-border.-color-main {
    border: 2px solid #F28123;
    border-radius: 6px;
    background: white;

    padding: 8px;
    cursor: pointer;
}

button.fill-border.-large {
    padding: 14px;
}

button.fill-border.-color-main:active {
    background: whitesmoke;
    border: 2px solid #DF6E11;
    outline: none;
}

button.fill-border:focus {    
    outline: none;
}
```

Update your Storybook file `buttons.js` to use `Button` instead of `BorderedButton`:

```jsx
import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from 'App/Client/Common/Components/Button';
import GoogleLoginButton from 'App/Client/Features/Landing/Components/GoogleLoginButton';

storiesOf('Button', module)
    .add('bordered with plain text', () => (
        <Button fill="border">Hi I'm Bordered Button</Button>
    ))
    .add('bordered size = large', () => (
        <Button fill="border" size="large">Hi I'm Bordered Button</Button>
    ))
    .add('bordered with on click', () => (
        <Button fill="border" onClick={() => alert('do something here')}>
            Click Me!
        </Button>
    ))
    .add('google login', () => (
        <GoogleLoginButton size="large" />
    ), {
        info: {
            text: "Try resizing the container, this button's width is 30% of the parent"
        }
    })
```

Then update `GoogleLoginButton` to ditch `BorderedButton` as well.

```jsx
import React from 'react';
import Button from 'App/Client/Common/Components/Button';
import { ReactComponent as Logo } from './google-icon.svg';
import './style.css';

const GoogleLoginButton = () => (
    <Button fill="border" size="large" className="google-auth-btn" onClick={() => handleGoogleAuthentication()}>
        Sign In with Google <Logo />
    </Button>
);

const handleGoogleAuthentication = () => {
    console.log('Pending Feature :)');
};

export default GoogleLoginButton;
```

And finally, delete the `App/Client/Common/Components/BorderedButton`. We should be able to achieve the same results.

### Implementing fill="background"

Let's update our `buttons.js` Storybook file and add the following:

```jsx
.add('primary button', () => (
        <Button fill="background">Primary Filled Button</Button>
    ))
```

This will then add an unstyled button in our Storybook. Let's also refactor our CSS so that the generic styles are put to the new class `.round-corner-btn` we introduced earlier

```css

button.round-corner-btn.-size-regular {
    border-radius: 6px;
    padding: 8px;
}

button.round-corner-btn.-size-large {
    border-radius: 4px;
    font-weight: bold;
    padding-top: 14px;
    padding-bottom: 14px;
    padding-left: 20px;
    padding-right: 20px;
    outline: none;
}

button.round-corner-btn:focus, button.round-corner-btn:active{
    outline: none;
}

button.round-corner-btn.-color-main:active {
    color: white;
    background: #DF6E11;
    border: 2px solid #DF6E11;
}

button.fill-border.-color-main {
    border: 2px solid #F28123;    
    background: white;    
}

button.fill-background.-color-main {    
    color: white;
    border: 2px solid #F28123;
    background: #F28123;

    -webkit-box-shadow: none;
	-moz-box-shadow: none;
	box-shadow: none;
}
```

We can also add some defaults to the button so that if we don't specify a fill, it will default to "background":

```js
Button.defaultProps = {
    fill: 'background',
    size: 'regular',
    className: '',
};
```

## Flat Buttons

These are the buttons next to a task. We can't put this in the same `Button` component as this has less properties required. Create the component in `App/Client/Common/Components/FlatButton` and create the files:

File `package.json`:
```json
{
    "main": "./FlatButtonComponent.jsx"
}
```

File `style.css`:
```css

button.round-corner-btn.-size-regular {
    border-radius: 6px;
    padding: 8px;
}

button.round-corner-btn.-size-large {
    border-radius: 4px;
    font-weight: bold;
    padding-top: 14px;
    padding-bottom: 14px;
    padding-left: 20px;
    padding-right: 20px;
    outline: none;
}

button.round-corner-btn:focus, button.round-corner-btn:active{
    outline: none;
}

button.round-corner-btn.-color-main:active {
    color: white;
    background: #DF6E11;
    border: 2px solid #DF6E11;
}

button.fill-border.-color-main {
    border: 2px solid #F28123;    
    background: white;    
}

button.fill-background.-color-main {    
    color: white;
    border: 2px solid #F28123;
    background: #F28123;

    -webkit-box-shadow: none;
	-moz-box-shadow: none;
	box-shadow: none;
}
```

File `FlatButtonComponent.jsx`:
```jsx
import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

const FlatButtonComponent = ({ children, type, ...props }) => (
    <button className={`flat-btn -${type} -color-main`} {...props}>
        {children}
    </button>
);

FlatButtonComponent.defaultProps = {
    type: 'primary'
};

FlatButtonComponent.propTypes = {
    children: PropTypes.node.isRequired,
    type: PropTypes.oneOf(['primary', 'info', 'danger', 'grey'])
};

export default FlatButtonComponent;
```

This button will only need a child node and the type.

# Handling Composite Components

Most of the time, you'll have to deal with components that can work as a unit and as a group to compose one more component. A good example of this is the `CalendarLinkItem` (unit) and the `VerticalDateNavigator` (composite) components.

__`CalendarLinkItem`__

![Calendar link item](/img/calendar-link-item.png)

__`VerticalDateNavigator`__

![Vertical Date Navigator](/img/vertical-date-navigator.png)

## Adding Dependencies

You should notice that there are date formatting functionalities here. To make things easier for us, let's use the "Moment" library:

(If you've already installed moment, you don't need to do the commadn below)
```bash
npm install moment react-moment
```

## Building the Components

We'll always have to start from smallest component to the largest. Before that though, let's create a space for us to test in the Storybook. Create a new file `./storybook/stories/calendar.jsx`. Make sure to require this in the `config.js`

File `./storybook/stories/calendar.js`:

```jsx
import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Calendar Link Item', module)
    .add('demo', () => (
        <h1>I'm just a placeholder</h1>
    ))

storiesOf('Vertical Date Navigator', module)
    .add('demo', () => (
        <h1>I'm just a placeholder</h1>
    ))
```

Create a new folder `App/Client/Features/Calendar/Components/CalendarLinkItem` with the following files:

File `package.json`:
```json
{
    "main": "./CalendarLinkItemComponent.jsx"
}
```

File `style.css`:
```css
.calendar-link-item {
    padding-top: 14px;
    padding-bottom: 14px;

    padding-left: 36px;
    padding-right: 22px;

    overflow: auto;
    color: black;
    cursor: pointer;
}

.calendar-link-item-content {
    display: inline-block;
}

.calendar-link-item-content > .day-of-week {
    display: block;
    font-size: 22px;
    font-weight: semibold;
}

.calendar-link-item-content > .task {
    display: block;
    font-size: 16px;
}

.calendar-link-item-content > .task.-info {
    color: #2394F2
}

.calendar-link-item-content > .task.-primary {
    color: #F28123
}

.calendar-link-item > .day-of-month {
    float: right;
    font-size: 42px;
    font-weight: bold;

    color: #8D8D8D;
}

.calendar-link-item.-is-active,
.calendar-link-item.-is-active .day-of-month, 
.calendar-link-item.-is-active .task {
    background-color: #019fe9;
    color: white;
}
```

File `CalendarLinkItemComponent.jsx`:
```jsx
import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import './style.css';

import looseDate from 'App/Client/Common/PropTypes/looseDate';

const CalendarLinkItemComponent = ({ taskMessage, taskHighlight, date, isActive }) => {
    const dateObj = new Date(date);

    return (
        <div className={`calendar-link-item ${isActive ? "-is-active" : ""}`}>
            <div className="calendar-link-item-content">
                <DayOfWeek date={dateObj} />
                <TaskStatus highlight={taskHighlight}>{taskMessage}</TaskStatus>
            </div>
            <DayOfMonth date={dateObj} />
        </div>
    );
};

const DayOfWeek = ({ date }) => {
    return (
        <span className="day-of-week">
            <Moment format="dddd">{date}</Moment>
        </span>
    );
};

const TaskStatus = ({ children, highlight }) => {
    return (
        <span className={`task -${highlight}`}>{children}</span>
    );
};

const DayOfMonth = ({ date }) => {
    /**
     * TODO: Check if this should be moved to domain later
     */
    const getOrdinal = (number) => {
        if (number > 3 && number < 21) return 'th';
        switch (number % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    };

    const dateOfMonth = date.getDate();
    const displayText = `${dateOfMonth}${getOrdinal(dateOfMonth)}`;

    return (
        <span className="day-of-month">{displayText}</span>
    );
}

CalendarLinkItemComponent.defaultProps = {
    taskHighlight: 'info',
    isActive: false
};

CalendarLinkItemComponent.propTypes = {
    taskMessage: PropTypes.node.isRequired,
    taskHighlight: PropTypes.oneOf(['primary', 'info']),
    date: looseDate
};


export default CalendarLinkItemComponent;
```

Notice that we used a custom `PropType` called `looseDate` here. Implement it by creating a new file `App/Client/Common/PropTypes/looseDate` with the contents:

```js

const looseDate = (props, propName, componentName) => {
    componentName = componentName || 'ANONYMOUS';

    const value = props[propName];
    const dateProp = new Date(value);
    const isValidDate = Object.prototype.toString.call(dateProp) === "[object Date]" && !isNaN(dateProp.getTime());

    if (!isValidDate) {
        return new Error(`The property ${ propName } of component ${ componentName } is required and must be an instance of Date or is a string with a valid date format (yyyy-mm-dd)`);
    }

    //  no problem
    return null;
};

export default looseDate;
```

The `PropType` `looseDate` accepts either a `Date` object or a string with a valid date format of `YYYY-MM-dd`.

## Displaying the Component

Now we can update our `calendar.jsx` Storybook and add the `CalendarLinkItem` component. Here we also add a `decorator` so that the components won't occupy the whole space and would add a border that will be added by the parent of this component.

```jsx
storiesOf('Calendar Link Item', module)
    .addDecorator(storyFn => <div style={{ width: '400px', borderTop: '1px #7E7E7E solid', borderBottom: '1px #7E7E7E solid'  }} children={storyFn()} />)}} children={storyFn()} />)
    .add('using date object', () => (
        <CalendarLinkItem
            taskMessage="All Tasks Done"
            date={new Date('2019-05-01')}
        />
    ))
```

Since we used `looseDate` as prop type for the date, we can also provide strings to the `date` prop:

```jsx
    .add('using date string', () => (
        <CalendarLinkItem
            taskHighlight="primary"
            taskMessage="5 Tasks Open"
            date="2019-05-01"
        />
    ))
```

Let's also add another component that displays a "warning message" about open tasks:

```jsx
    .add('with open tasks', () => (
        <CalendarLinkItem
            taskHighlight="primary"
            taskMessage="5 Tasks Open"
            date={new Date('2019-05-01')}
        />
    ))
```

Finally, we should also be able to showcase a "selected"/"highlighted" `CalendarLinkItem`

```jsx
    .add('using highlighted with open tasks', () => (
        <CalendarLinkItem
            taskHighlight="primary"
            taskMessage="5 Tasks Open"
            date={new Date('2019-05-01')}
            isActive={true}
        />
    ))
    .add('using highlighted with all tasks done', () => (
        <CalendarLinkItem
            taskHighlight="info"
            taskMessage="All Tasks Done"
            date={new Date('2019-05-01')}
            isActive={true}
        />
    ))
```

## Building the `VerticalDateNavigator`'s Navigation Icons

This composite component still lacks something to be complete, the button to navigate down and up (caret). Let's build that first

Use this SVG to and save it into a file called `caret-up.svg` inside the folder `App/Client/Common/Icons/Caret`

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1753.274" height="947.274" viewBox="0 0 1753.274 947.274"><g transform="translate(883.137 429.637)"><line y1="1231" x2="8" transform="translate(22.896 -394.053) rotate(45)" fill="none" stroke="#707070" stroke-width="120"/><line y1="1231" x2="8" transform="translate(834.553 476.396) rotate(135)" fill="none" stroke="#707070" stroke-width="120"/></g></svg>
```

In the `Caret` folder, create the following files:

File `package.json`
```json
{
    "main": "./VerticalDateNavigatorComponent.jsx"
}
```

File `CaretComponent.jsx`
```jsx
import React from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as Logo } from './caret-up.svg';

const CaretComponent = ({ direction, ...props }) => {
    const size = '54px';
    const transformationsPerDirection = {
        "up": "rotate(0)",
        "down": "rotate(180)",
    };
    const transform = transformationsPerDirection[direction];

    return (
        <Logo { ...props } width={ size } height={ size } transform={ transform } />
    );
};

CaretComponent.propTypes = {
    direction: PropTypes.oneOf(['up', 'down'])
};

export default CaretComponent;
```

Notice that here, we can specify the direction of the caret. This will make it more efficient as we are only using 1 SVG file and we are merely rotating it depending on the direction. This will also future proof this icon should we need a caret left and caret right.

## Building the `VerticalDateNavigator`

Now, we can stitch two components together, create the new folder `App/Client/Features/Calendar/Components/VerticalDateNavigator`. Create the files inside it:

File `style.css`
```css
.vertical-date-navigator > li {
    /* Overlapping borders  */
    border-top: 1px #7E7E7E solid;
    border-bottom: 1px #7E7E7E solid;
    margin-bottom: -1px;
}

.vertical-date-navigator {
    list-style: none;
    padding: 0;
    margin: 0;
}

.navigation-btn {
    border: none;
    background: inherit;
    width: 100%;
}

.navigation-btn:active, 
.navigation-btn:focus {
    border: none;
    outline: none;
}

.navigation-btn:active {
    background: rgb(238, 236, 236);    
}
```

We put negative margin in either top or bottom to simulate overlapping borders.

We'll also create styles for navigation buttons and the vertical date navigator list.

File `package.json`
```json
{
    "main": "./VerticalDateNavigatorComponent.jsx"
}
```

And finally, we'll have to create the actual component `VerticalDateNavigatorComponent.jsx`:

```jsx
import React, { Fragment } from 'react';
import './style.css';
import CalendarLinkItem from 'App/Client/Features/Calendar/Components/CalendarLinkItem';
import Caret from 'App/Client/Common/Icons/Caret';

import optionalLooseDate from 'App/Client/Common/PropTypes/optionalLooseDate';

/**
 *  @prop selectedDate     (Optional) The date that should be highlighted
 */
class VerticalDateNavigatorComponent extends React.Component {
    state = {
        displayDateSet: [],
        referenceDate: new Date()
    }

    componentDidMount() {
        this.refreshDisplayedDateSet();
    }

    triggerOnDateClicked(date) {
        if (this.props.onDateClicked) {
            this.props.onDateClicked(date);
        }
    }

    triggerOnDatesDisplayedChanged(datesDisplayed) {
        if (this.props.onDatesDisplayedChanged) {
            this.props.onDatesDisplayedChanged(datesDisplayed);
        }
    }

    refreshDisplayedDateSet() {
        const { selectedDate } = this.props;
        const referenceDate = selectedDate ? new Date(selectedDate) : new Date();

        this.setDisplayedDateSet(referenceDate);
    }

    navigate(direction) {
        let referenceDate = new Date(this.state.referenceDate);
        const addend = direction === 'up' ? -1 : 1;

        referenceDate.setDate(referenceDate.getDate() + addend);
        this.setDisplayedDateSet(referenceDate);
    }

    setDisplayedDateSet(referenceDate) {
        const displayDateSet = this.generateWeekDatesBasedOnDate(referenceDate);
        this.setState({ referenceDate, displayDateSet });

        this.triggerOnDatesDisplayedChanged(displayDateSet);
    }

    generateWeekDatesBasedOnDate(referenceDate) {
        let weekDayDateSet = [];

        //  -3 = let's start 3 days before today
        for (let counter = -3; counter <= 3; counter++) {
            const date = new Date(referenceDate);
            date.setDate(referenceDate.getDate() + counter);
            weekDayDateSet.push(date);
        }

        return weekDayDateSet;
    }

    render() {
        const { displayDateSet } = this.state;
        const { selectedDate, tasksSummary } = this.props;

        return (
            <Fragment>
                <Navigator direction="up" onClick={() => this.navigate("up")} />
                <ul className="vertical-date-navigator">
                    {displayDateSet && displayDateSet.map(date => 
                        <CalendarLinkItemListItem 
                            selectedDate={selectedDate} 
                            date={date} 
                            tasksSummary={tasksSummary} />)}
                </ul>
                <Navigator direction="down" onClick={() => this.navigate("down")} />
            </Fragment>
        );
    }
}

const Navigator = ({ direction, onClick }) => (
    <button className="navigation-btn" onClick={onClick} >
        <Caret direction={direction} />
    </button>
);

const CalendarLinkItemListItem = ({ selectedDate, date, tasksSummary }) => {
    const taskSummary = tasksSummary.find(ts => testDateMatch(ts.date, date));    

    if (taskSummary) {
        const {taskMessage, taskHighlight} = makeTaskSummaryDisplayable(taskSummary);
        return (
            <li key={date.toString()} onClick={() => this.triggerOnDateClicked(date)} >
                <CalendarLinkItem
                    date={date}
                    taskMessage={taskMessage}
                    taskHighlight={taskHighlight}
                    isActive={testDateMatch(selectedDate, date)}
                />
            </li>
        );
    } else {
        return (
            <li key={date.toString()} onClick={() => this.triggerOnDateClicked(date)} >
                <CalendarLinkItem
                    date={date}
                    isActive={testDateMatch(selectedDate, date)}
                />
            </li>
        );
    }
    
};

const makeTaskSummaryDisplayable = taskSummary => {
    const { taskCount, doneTaskCount } = taskSummary;
    const tasksRemaining = taskCount - doneTaskCount;
    let taskMessage, taskHighlight = 'info';

    if (taskCount <= 0) {
        taskMessage = 'No Tasks';
    } else if (tasksRemaining > 0) {
        taskMessage = `${tasksRemaining} Tasks Open`;
        taskHighlight = 'primary';
    } else if (tasksRemaining <= 0) {
        taskMessage = "All Tasks Done";
    } else {
        //  TODO: throw exception here, for now let's log
        console.error("Unable to determine task message", taskSummary);
    }

    return { taskMessage, taskHighlight };
};

const testDateMatch = (date1, date2) => {
    if (!(date1 && date2)) {
        return false;
    }

    const date1Obj = new Date(date1);
    const date2Obj = new Date(date2);

    return date1Obj.getFullYear() === date2Obj.getFullYear()
        && date1Obj.getDate() === date2Obj.getDate()
        && date1Obj.getMonth() === date2Obj.getMonth();
};

VerticalDateNavigatorComponent.defaultProps = {
    tasksSummary: []
};

VerticalDateNavigatorComponent.propTypes = {
    selectedDate: optionalLooseDate
};

export default VerticalDateNavigatorComponent;
```

Follow along the instructor as he discuss about the slightly complex logic on producing the component.

Generally you should look at `setDisplayedDateSet` and `generateWeekDatesBasedOnDate`. These functions generate a list of dates based on a "reference date". From that date, we list 3 days before it and 3 days after making it the "center" of the date set. With that, we can render 7 `CalendarLinkItem` components in a loop.

The `Navigator` component is a button that has a `Caret` icon inside it. These will be displayed before and after the list of `CalendarLinkItem`s

### Optional Loose Date Custom PropType

We'll also need a new custom PropType `optionalLooseDate` to enable loose dates that are optional. Create the file `App/Client/Common/PropTypes/optionalLooseDate.js` with the contents:

```js
import looseDate from './looseDate';

const optionalLooseDate = (props, propName, componentName) => {
    if (props[propName]) {
        return looseDate(props, propName, componentName);
    }

    //  no problem
    return null;
};

export default optionalLooseDate;
```

Now let's display them in the Storybook:

```jsx
storiesOf('Vertical Date Navigator', module)
    .addDecorator(storyFn => <div style={{ width: '400px' }} children={storyFn()} />)
    .add('no selected date', () => (
        <VerticalDateNavigator />
    ))
    .add('with selected date', () => (
        <VerticalDateNavigator selectedDate="2019-05-01" />
    ))
    .add('on date selected', () => (
        <VerticalDateNavigator selectedDate="2019-05-01" onDateClicked={date => alert(date)} />
    ), {
            info: {
                text: "The `selectedDate` can only be set from the properties. This is so that we'll have the opportunity later on to wait for events when `onDateClicked` is triggered, and then, set the `selectedDate` afterwards to refresh the state"
            }
        })
    .add('on dates displayed changed', () => (
        <VerticalDateNavigator selectedDate="2019-05-01" onDatesDisplayedChanged={console.log} />
    ), {
            info: {
                text: "Check the console for the current dates displayed. This will be useful for querying the tasks for every date that's currently being displayed."
            }
        })
    .add('demo VerticalDateNavigator user', () => (
        <DemoVerticalDateNavigatorUser />
    ), {
            info: {
                text: "See the source code `./storybook/stories/calendar.jsx`'s DemoVerticalDateNavigatorUser"
            }
        })
    .add('with task data', () => (
        <VerticalDateNavigator selectedDate="2019-05-01" tasksSummary={mockTaskSummaryPerDateData} />
    ))
    ;

class DemoVerticalDateNavigatorUser extends React.Component {
    state = {
        selectedDate: new Date()
    }

    onDateClicked(selectedDate) {
        this.setState({ selectedDate });
    }

    render() {
        return <VerticalDateNavigator
            selectedDate={this.state.selectedDate}
            onDateClicked={selectedDate => this.onDateClicked(selectedDate)} />
    }
}

const mockTaskSummaryPerDateData = [
    { date: '2019-05-01', taskCount: 5, doneTaskCount: 0 },
    { date: '2019-05-02', taskCount: 0, doneTaskCount: 0 },
    { date: '2019-05-03', taskCount: 6, doneTaskCount: 3 },
    { date: '2019-05-04', taskCount: 4, doneTaskCount: 4 },
    { date: '2019-05-05', taskCount: 0, doneTaskCount: 0 },
    { date: '2019-05-06', taskCount: 0, doneTaskCount: 0 },
    { date: '2019-05-07', taskCount: 0, doneTaskCount: 0 },
];
```

We need to demostrate how a parent component can modify the `selectedDate` of the `VerticalDateNavigator`, so we created the `DemoVerticalDateNavigatorUser`. We currently have no efficient way to display this though other than copy and pasting it to the info text so let's direct the user instead to the code (this is intended for developers anyway).

## ToDo Components: Task Item

Create a new component (our usual set, (ComponentName)Component.jsx, package.json, and style.css) `App/Client/Features/Tasks/Components/Task` with the following files:

File `package.json`:
```json
{
    "main": "./TaskComponent.jsx"
}
```

File `style.css`:
```
.task {
    display: flex;
    overflow: auto;
    align-items: center;
    justify-content: space-between
}

.task.-done > .task-text {
    text-decoration: line-through;
}
```

File `TaskComponent.jsx`:
```jsx
import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'App/Client/Common/Components/FlatButton';
import './style.css';

class Task extends React.Component {

    triggerRemove(task) {
        if (this.props.onRemove) {
            this.props.onRemove(task);
        }
    }

    triggerToggle(task) {
        if (this.props.onToggle) {
            this.props.onToggle(task);
        }
    }

    render() {
        const { task } = this.props;
        const isTaskOpen = task.status === 'open';
        const toggleButtonClass = isTaskOpen ? 'grey' : 'info';
        const toggleButtonText = isTaskOpen ? 'Open' : 'Done';

        return (
            <div className={`task -${task.status}`}>
                <span className="task-text">{task.text}</span>
                <span className="task-actions">
                    <FlatButton type={toggleButtonClass} onClick={() => this.triggerToggle(task)}>{toggleButtonText}</FlatButton>
                    <FlatButton type="danger" onClick={() => this.triggerRemove(task)}>Remove</FlatButton>
                </span>
            </div>
        );
    }
}

Task.propTypes = {
    task: PropTypes.shape({
        text: PropTypes.string,
        status: PropTypes.oneOf(['open', 'done'])
    }).isRequired
};

export default Task;
```

... and add the possible usage in the Storybook by creating a new story `tasks.jsx` and requiring it in the config:

File `tasks.jsx`:
```jsx
import React from 'react';
import { storiesOf } from '@storybook/react';
import Task from 'App/Client/Features/Tasks/Components/Task';

storiesOf('Tasks', module)
    .addDecorator(storyFn => <div style={{ width: '600px', borderBottom: '1px solid #7E7E7E', borderTop: '1px solid #7E7E7E', margin: 'auto' }} children={storyFn()} />)
    .add('default/open task', () => (
        <Task task={{ text: 'Dentist appointment @ 2PM', status: 'open' }} />
    ))
    .add('one task', () => (
        <Task task={{ text: 'Dentist appointment @ 2PM', status: 'done' }} />
    ))
    .add('on toggle open', () => (
        <Task onToggle={task => alert(`Toggle task status: ${task.status}`)} task={{ text: 'Dentist appointment @ 2PM', status: 'open' }} />
    ))
    .add('on toggle done', () => (
        <Task onToggle={task => alert(`Toggle task status: ${task.status}`)} task={{ text: 'Dentist appointment @ 2PM', status: 'done' }} />
    ))
    .add('on remove', () => (
        <Task onRemove={task => alert(`Will delete task: ${task.text}`)} task={{ text: 'Dentist appointment @ 2PM', status: 'open' }} />
    ))
```

Finally, let's create a task list component that will house multiple tasks and add border to each.

Create a new component `App/Client/Features/Tasks/Components/TaskList` with the files:

File `package.json`:
```json
{
    "main": "./TaskListComponent.jsx"
}
```

File `style.css`:
```css
.task {
    display: flex;
    overflow: auto;
    align-items: center;
    justify-content: space-between
}

.task.-done > .task-text {
    text-decoration: line-through;
}
```

File `TaskListComponent.jsx`:
```jsx
import React from 'react';
import Task from 'App/Client/Features/Tasks/Components/Task';
import './style.css';

const TaskListComponent = ({ tasks, on }) => (
    <ul className="task-list">        
        {tasks.map(task => <li><Task task={task} /></li>)}
    </ul>
);

export default TaskListComponent;
```

... then add the task list to the Storybook:

```jsx
storiesOf('Task List', module)
    .add('mixed status', () => (
        <TaskList tasks={demoTasks} />
    ))
;

const demoTasks = [
    { text: 'Meeting with client @ 10 AM', status: 'done' },
    { text: 'Dentist appointment @ 2 PM', status: 'open' },
    { text: 'Ask about PC problems before going home', status: 'open' },
];
```

# Modals in React

Here's one interesting component you'll likely have problems in the future. Implementing modals in React.

Let's first create a `<Modal>` component by creating `App/Client/Common/Components/Modal` with the following files:

File `package.json`:
```json
{
    "main": "./ModalComponent.jsx"
}
```

File `style.css`:
```css
.lite-modal-bg {
    position: fixed;
    top: 0;
    left: 0;
    padding: 10px;
    background: rgba(0,0,0,0.5);
    width: 100%;
    height: 100%;
    
    display: none;
    justify-content: center;
    padding-top: 5%;
}

.lite-modal-bg.-active {
    display: flex;
    z-index: 9999;
}

.lite-modal-content {
    background: #fff;
    max-width: 685px;
    width: 100%;    
    position: relative;
    padding: 0;
}

.lite-modal-exit {
    color: #444;
    display: inline-block;
    height: 30px;
    width: 30px;
    padding: 0;    
    outline: none;
    background: transparent;
    border: none;
}

.lite-modal-exit:hover {
    background: #adadad;    
}

.lite-modal-btn-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    height: 30px;
    width: 30px;
}
```

File `ModalComponent.jsx`
```jsx
import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

const Modal = ({ children, isOpen, onCloseModalRequested }) => (
    <div className={`lite-modal-bg ${isOpen ? '-active' : ''}`}>
        <div className="lite-modal-content">
            <div className="lite-modal-btn-wrapper">
                <button className="lite-modal-exit" onClick={onCloseModalRequested} >
                    &times;
                </button>
            </div>
            {children}
        </div>
    </div>
);

Modal.defaultProps = {
    isOpen: false
};

Modal.propTypes = {
    isOpen: PropTypes.bool
};

export default Modal;
```

This modal, however, cannot close by itself despite having a close button. It can only notify the parent that a close action is requested.

This is because overwriting the props passed to a component is not a good practice as it will create confusion in your states in the long run.

For ease of use, we can put the modal's open state on Redux.

## Deletion Confirm

Create this component in `App/Clients/Features/Tasks/Components/ConfirmDeletion` with the files:

File `package.json`:
```json
{
    "main": "./ConfirmDeletionComponent.jsx"
}
```

File `style.css`:
```css
.confirm-deletion-prompt {    
    text-align: center;
    color: #707070;
}

.confirm-deletion-prompt .message {
    margin-top: 60px;
    margin-bottom: 40px;
    margin-left: 20px;
    margin-right: aut20pxo;
}

.confirm-deletion-prompt .actions {
    display: flex;    
}

.confirm-deletion-prompt .actions button {
    width: 50%;
}
```

File `ConfirmDeletionComponent.jsx`:
```
import React from 'react';
import FlatButton from 'App/Client/Common/Components/FlatButton';
import './style.css';

const ConfirmDeletionComponent = ({ onConfirm, onCancel }) => (
    <div className="confirm-deletion-prompt">
        <div className="message">
            <h1>Are you sure you want to remove this task?</h1>
            <p>This action cannot be undone</p>
        </div>
        <div className="actions">
            <FlatButton type="danger" onClick={() => onConfirm()}>Remove</FlatButton>
            <FlatButton type="grey" onClick={() => onCancel()}>Cancel</FlatButton>
        </div>
    </div>
);

export default ConfirmDeletionComponent;
```

Add this component to the Storybook with:

```jsx
storiesOf('Confirm Deletion', module)
    .addDecorator(storyFn => <div style={{ width: '600px', margin: 'auto' }} children={storyFn()} />)
    .add('ui only', () => (
        <ConfirmDeletion />
    ))
    .add('inside modal', () => (
        <Modal isOpen>
            <ConfirmDeletion 
                onConfirm={() => console.log('confirmed deletion')} 
                onCancel={() => console.log('canceled deletion')} 
                />
        </Modal>
    ))
```

## Implementing Task Input

Now we have one last component to implement the large input element for writing the tasks. This component is just one element though. In cases such as these, you'll have to decide if it's really necessary to create a separate component for it at all. Here's your checklist:

- Is the component a combination of multiple elements?
- Can you extract a more specific functionality from this element?
- Does the component have a set of configuration options that either change behavior or UI?

If you answer yes in any of these, create a component to wrap the element. If not, go back to the UI/UX plan by one level and check the next component housing this candidate component against the same checklist.

In this case, it seems that the input alone does not pass the checklist as we will only be using it as a plain input. We'll have to check the UI/UX plan and get the next candidate component which is the form that contains the input, which passes the checklist.

Let's create our form in `App/Clients/Features/Tasks/Forms/Task` with the following files:

File `package.json`
```json
{
    "main": "./TaskForm.jsx"
}
```

File `style.css`:
```css

.task-form {
    overflow: auto;
}

.task-form h1 {
    color: #707070;
}

#task-text-input {
    margin-top: 20px;
    margin-bottom: 30px;

    font-size: 24px;

    width: 100%;

    border: 0;
    outline: 0;
    background: transparent;
    border-bottom: 2px solid #707070;
}

.task-form button[type=submit] {
    float: right;
}
```

File `TaskForm.jsx`:
```jsx
import React from 'react';
import PropTypes from 'prop-types';
import Button from 'App/Client/Common/Components/Button';
import './style.css'

class TaskForm extends React.Component {
    constructor(props) {
        super(props);

        const task = props.task ? props.task : { text: '', status: 'open' };
        this.state = {
            task,
            errorMessage: '',
            headerText: this.resolveHeaderText(task),
            submitActionText: this.resolveSubmitActionText(task)
        };
    }

    resolveHeaderText = (task) => {
        const { id: taskId } = task;
        if (taskId) {
            return `Updating Task (${taskId})`;
        } else {
            return "Creating new Task";
        }
    }

    resolveSubmitActionText = (task) => {
        const { id: taskId } = task;
        if (taskId) {
            return `Update Task`;
        } else {
            return "Create Task";
        }
    }

    onTextChange = (event) => {
        const task = { ...this.state.task };
        task.text = event.target.value;
        this.setState({ task, errorMessage: '' });
    }

    triggerSaveTask = (event) => {
        event.preventDefault();
        if (!this.validateTask(this.state.task)) {
            return;
        }

        if (this.props.onSaveTask) {
            this.props.onSaveTask(this.state.task);
        }
    }

    /**
     * This normally belongs to a "Domain" object but since 
     * it's alone (for now at least), let's leave this here
     */
    validateTask = (task) => {
        const isTaskTextProvided = String(task.text).trim() !== '';

        if (!isTaskTextProvided) {
            this.setState({ errorMessage: "Task text is required!" });
        }

        return isTaskTextProvided;
    }

    render() {
        const { headerText, submitActionText, errorMessage } = this.state;
        return (
            <form className="task-form" onSubmit={this.triggerSaveTask}>
                <h1>{headerText}</h1>

                <div className="task-text-input-wrapper">
                    <input
                        id="task-text-input"
                        type="text"
                        placeholder="Enter Task"
                        value={this.state.task.text}
                        onChange={this.onTextChange}
                    />
                </div>
                <div className="task-text-error-wrapper">
                    <label
                        className="error-text"
                        for="task-text-input">
                        {errorMessage}
                    </label>
                </div>

                <Button size="regular" type="submit">
                    {submitActionText}
                </Button>
            </form>
        );
    }
}

TaskForm.propTypes = {
    task: PropTypes.shape({
        id: PropTypes.any.isRequired,
        text: PropTypes.string.isRequired,
        status: PropTypes.oneOf(['open', 'done']).isRequired
    })
};

export default TaskForm;
```

Notice that we are using a different convention here. We are categorizing the form as something different than a component. We will do this with something like a scene as well later on. We are also not putting the suffix "Component" anymore, instead, we suffix it with "Form".

This form is made to be ready for not just creating tasks but also accepting existing tasks and updating it. Basic validations are in place as well.

# On to Stitching Scenes

Now that we've pretty much completed our components, we can now "stitch" them together. Click [here](/modules/todo/stitching.md) for the next lesson about stitching.