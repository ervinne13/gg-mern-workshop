# Create React App - Structure

## `src` Folder

ES6 `imports` cannot load components or js files outside of this folder. All of your js code should exist here. You may also load it like you normally would in the public folder but __please__ dont.

## `public` Folder

This is your usual public folder where you may put your assets.

## `public/index.html` File

Open this file, this is the file that `webpack dev server` will load when you access your application in the browser. Your react components will be loaded in the:

```html
<div id="root"></div>
```

Part of the code inside body of this file.

## `public/manifest.json` File

This is your usual [web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) file.

Web app manifests are part of a collection of web technologies called [progressive web apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps), which are websites that can be installed to a device’s homescreen without an app store, along with other capabilities like working offline and receiving push notifications.

## `src/index.js` File

This is the first JS file loaded when React is starting up. The code:

```jsx
ReactDOM.render(<App />, document.getElementById('root'));
```

... will run whatever component you pass it (1st param) and render it to the specified element (2nd param). This is why your JSX code will run on the ``<div id="root"></div>`` code of `index.html`.

There are other ways to load React/JSX components onto the DOM like `ReactDOM.renderToString` but we'll get to those later.

## `src/App.js` and `src/App.css` Files

The code in `src/App.js` is your first `class-based` JSX code. You may also create components using only a function that we'll demonstrate later. Notice that it it's paired with its own css in `src/App.css` where the styling for this component is contained.

This might make you uncomfortable especially if you're good with css already because the *cascading* effect of CSS is not used anymore with js-css pairs instead of one global css (or multiple css compiled to one) that *cascades* through all of the elements.

## `src/App.test.js` File

This is the automated unit test for the `App.js`. When writing components, you may put the test for that component in the same folder and the command `npm run test` will automatically find all tests for you. We'll try to get up to unit testing in this workshop.