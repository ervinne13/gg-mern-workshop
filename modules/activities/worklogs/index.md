# Projects & Tasks

In this activity, we'll make use of our knowledge in React, Redux, and Firebase to build a simple application to track projects & tasks.

Create a new project with create react app:

```bash
create-react-app projects
```

Importing libraries we'll need later:

```bash
cd projects
npm install react-router-dom redux react-redux redux-thunk prop-types
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

## Building the App Structure/Framework

Create a new folder inside `/src/` called `App/Client` and move `App.js`, `index.css`, and `serviceWorker.js` there.

Update `index.js` so that the references are adjusted:

File `index.js`:
```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import 'App/Client/index.css';
import App from 'App/Client/App';
import * as serviceWorker from 'App/Client/serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
```

This won't work yet though, we need to tell React to load resources at the root folder (notice we're not using relative paths anymore).

Create a new file called `jsconfig.json` at the root of your application and add the contents:

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

Changes may not apply yet so restart webpack dev server by pressing `Ctrl`+`C` in the terminal where you ran `npm start` then run `npm start` again.

## Building the UI