# UI First Development

In this project, we'll assume the work of a frontend developer first. Merely putting mocks and test data to display and will not care about the backend and data storage (for now).

For this project, we'll be using a real world application to develop, a work logger. This worklogs application is used to get the number of hours spent by a resource (employee) for a certain project. Data from this application can then be tested against the actual project contracts and test whether the company is getting profit from a certain project or is already losing (If actual man hours spent is greater than estimated).

## The UI Plan

The instructor initially proposed a user interface looking simlar to below:

![Worklogs](/img/worklogs-draft-ui-01.png)

With the main panel further improved by our UI/UX team:

![Worklogs Improved](/img/worklogs-draft-ui-02.png)

## The UI Library

In react, as long as a UI plan is given, we can do atomic design and establish a UI library where we can just take components from.

__Let's create a route for a UI library that will house our components:__

```jsx
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import UILibrary from 'App/Client/UILibrary';

const App = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/ui-library" component={ UILibrary } />
        </Switch> 
    </BrowserRouter>
);

export default App;
```

__Then let's create our UILibrary__

File `/src/App/Client/UILibrary.jsx`:
```jsx
import React from 'react';
import CalendarLinkItemComponent from 'App/Client/Features/Calendar/CalendarLinkItemComponent';

const UILibrary = () => (
    <div className="container">
        <h1>Worklogs UI Library</h1>

        <h3>Calendar Link Item</h3>        
        {calendarLinkItemDataSamples.map((data, key) => (
            <div className="bordered-overlapping" key={ key } style={{ width: '40%' }}>
                <CalendarLinkItemComponent { ...data } />
            </div>
        ))}        

    </div>
);

const calendarLinkItemDataSamples = [
    {
        loggedMins: 72,
        date: '2019-05-06'
    },
    {
        loggedMins: 6 * 60,
        date: '2019-05-07'
    }
];

export default UILibrary;
```

__... and our first component:__

File `/src/App/Client/Features/Calendar/CalendarLinkItemComponent.jsx`:
