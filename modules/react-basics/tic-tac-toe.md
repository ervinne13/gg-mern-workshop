# Tic Tac Toe Game

When the total markup is relatively small, we can create non react test markup first before converting it to an actual react application.

## Creating the Board

Let's first write some dummy markup for now so we can better visualize what we're about to do:

Create a new folder called `tic-tac-toe-draft`, inside it, two new files called `index.html` and `style.css`.

Visualizing the output, we want something like 9 clickable squares in a grid:

![tic tac toe](/img/tic-tac-toe-grid.png)

In general, what we can make up with this is we need a "button" component and a row that encapsulates 3 buttons at a time.

With this in mind, update the `index.html` file and put the following markup:

File `index.html`:
```html
<html>
    <head>
        <title>Tic Tac Toe</title>
        <link rel="stylesheet" href="styles.css" />
    </head>
    <body>
        <div class="game">
            <div class="game-board">                
                <div class="board-row">
                    <button class="square"></button>
                    <button class="square"></button>
                    <button class="square"></button>
                </div>
                <div class="board-row">
                    <button class="square"></button>
                    <button class="square"></button>
                    <button class="square"></button>
                </div>
                <div class="board-row">
                    <button class="square"></button>
                    <button class="square"></button>
                    <button class="square"></button>
                </div>
            </div>                  
        </div> 
    </body>
</html>
```

Open `index.html` in your browser and you should get something like:

![tic tac toe progress 1](/img/tic-tac-toe-prog1.png)

Let's get to styling things.

## Styling the Board

Let's try turning the buttons (with class `square`) into actual squares. Add the following in the `style.css` file:

```css
.square {
    background: #fff;
    border: 1px solid #999;
}
```

This will turn the buttons into a rectangle, now we want to fix the height and the width so it would look like an actual square. In the `.square` class in your css, add the following:

```css
.square {
    /* ... */
    height: 34px;
    width: 34px;
}
```

Your grid should now look something like:

![tic tac toe progress 2](/img/tic-tac-toe-prog2.png)

Looks good! Let's try "sticking" them together. We can do this by removing all the padding and margins.

```css
.square {
    /* ... */
    margin: 0;
    padding: 0;
}
```

Check your page and weirdly enough, not much seems to change.

### Understanding Displays in CSS

This is because the parent is displaying objects in `block` or `inline` which is the default way an element is displayed. With this, HTML treats any whitespace between elements as actual space between them. That is regardless if its an actual space or a new line.

For Example, all the following markup will result in a space between the elements:

```html
<div style="display: inline">
    <button>Dummy Button</button>
    Dummy Text
</div>

<div style="display: block ">
    <button>Dummy Button</button>
    Dummy Text
</div>

<div style="display: block ">
    <button>Dummy Button</button> Dummy Text
</div>

<div style="display: block ">
    <button>Dummy Button</button>       Dummy Text
</div>
```

But if you remove the space and forcefully "stick" the elements together, we could achieve the "sticking" effect that we wanted.

For 4x

#### Display: Block Sample

Let's change that by adding:

```css
.board-row {
    display: table;
}
```

The property `display: table` will force non-table elements to behave like table-elements.

Refresh your page and the squares should now "stick" together.

There's still one problem though, it seems as though the borders inside the grid are thicker. This is because each square boxes have their own borders. We can "fix" this by setting (cheating) margin to the negative value of the border which is 1px;

```css
.square {
    /* ... */
    margin: 1px;
    /* ... */
}
```

This would then allow us to emulate our objective view. It's not over yet though, we still have to test what happens if the view now has content of X and O.

### Retaining the Style After Updating Content

Try updating your markup and randomly add some `X` and `O`s like so:

```html
<!-- ... -->
    <div class="game-board">                
        <div class="board-row">                    
            <button class="square">X</button>
            <button class="square">O</button>
            <button class="square"></button>
        </div>
        <div class="board-row">
            <button class="square"></button>
            <button class="square">O</button>
            <button class="square"></button>
        </div>
        <div class="board-row">
            <button class="square"></button>
            <button class="square"></button>
            <button class="square"></button>
        </div>
    </div> 
<!-- ... -->
```

Test it in the browser and you should see that our boxes are broken:

![Broken tic tac toe](/img/tic-tac-toe-prog3.png)

This is caused by `vertical-align: baseline;` which is the default vertical align of elements. Notice that the "base" of the other buttons are trying to align at the center of the text of the button(s). This is the effect of baseline in this case. 

We can experiment further by testing how empty and non empty buttons work when displayed beside text while in `vertical-align: baseline`:

```html
<button class="button">X</button>
<button class="button"></button>
Test Text  
```

This should output something like:

![Effect of Vertical Align: Baseline](/img/baseline-valign.PNG)

We can conclude with this test that if a button does not have content, the "base" of that button will align to any text existing in the same line. On the other hand, if the button has text content as well, it will try to align its text content's "base" to the text of the other elements (or no elements, just text).

To fix this, instead of aligining texts and buttons by their "base" with the `baseline` value of `vertical-align`, we tell the buttons to align itself with the `middle` like so:

```css
.square {
    /* ... */
    vertical-align: middle;
}
```

Check to see that our view is now correct:

![Broken tic tac toe](/img/tic-tac-toe-prog4.png)

## Creating the Project in React

Create your project with the command:

```bash
npx create-react-app tic-tac-toe
```

Tip: we use `npx` not `npm`. Think of `npx` as something similar to `npm run`, it's used to run some package that is usually installed globally.

## Cleaning Up

Remove the files inside the `src` folder by:

```bash
rm -rf tic-tac-toe/src/*
```

Note that you have to run this inside git bash if you're on windows as this is linux syntax, if you're on windows, just delete everything inside the src folder or run in cmd:

```bash
del tic-tac-toe/src/*
```

## Creating Our Components

Since our UI is small, there's not much need to do a component sheet/library for it so we implement the UI directly.

Let's create our `square` component by creating a new file called `Square.jsx` in our `/src/` folder.

File `Square.jsx`:

```jsx
import React from 'react';

class Square extends React.Component {
    render() {
        return (
            <button className="square">
                {/* TODO */}
            </button>
        );
    }
}

export default Square;
```

We'll also create actual board (combination of squares) component. Create the file `Board.jsx` in the `/src/` folder.

```jsx
import React from 'react';
import Square from './Square';

class Board extends React.Component {
    renderRow(key) {
        return (
            <div className="board-row" key={key} >
                <Square />
                <Square />
                <Square />
            </div>
        );
    }

    render() {
        const status = 'Next player: X';

        return (
            <div>
                <div className="status">{status}</div>
                {this.renderRow(0)}
                {this.renderRow(1)}
                {this.renderRow(2)}
            </div>
        );
    }
}

export default Board;
```

Create our app or entry point component which we will be adding some mark up as well later by creating a new file `App.jsx` in the `/src/` folder.

File `App.jsx`:
```jsx
import React from 'react';
import Board from './Board';

class App extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
            </div>
        );
    }
}

export default App;
```

Finally, we'll create the entry point js that we deleted earlier. Create the file `index.js` in `/src/`:

File `index.js`:
```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
```

Now try running the application with:

```bash
npm start
```

... and your browser should be opened on location `http://localhost:3000`. You will be able to see the application, but of course, without styling yet. 

### Adding a Global Styling in React

This is pretty simple and would follow what we've learned on webpack earlier.

Create a new file `index.css` in  `/src/` with the contents of our work on testing the styles earlier:

File `index.css`:
```css
.board-row {
    display: table;
}

.square {
    background: #fff;
    border: 1px solid #999;    
    height: 34px;
    width: 34px;

    margin: -1px;    
    padding: 0;

    vertical-align: middle;
}
```

... then let `index.js` import this file by adding:

```js
import './index.css';
```

... save and the page should automatically refresh applying our changes earlier.

## Fixing Our Structure

While our application may be small, cramming everything in the `/src/` folder looked ugly. What if we wanted to add some services later? Adding them again in the same folder will make a mess. To remedy this, move all the components to a new `/src/components/` folder and update the reference to `App.jsx` in `index.js` from `./App` to `./components/App`.

When you do changes in directory, webpack's watcher may not be able to detect the changes right away. Restart the server by pressing `Ctrl`+`C` in the terminal where you ran `npm start` and run it again.

## Passing Data Through Props

Let's enable marking squares by adding the ability to set it in each square through setting `props`.

Update the `Square.jsx`'s render method by adding the `{ this.props.markedBy }`.

```jsx
render() {
    return (
        <button className="square">
            { this.props.markedBy }
        </button>
    );
}
```

Experiment a bit and update any `Square` in the `Board` and add `markedBy="X"` and `markedBy="O"`.

In the `render` function of `Board.jsx`:

```jsx
renderRow(key) {
    return (
        <div className="board-row" key={key} >
            <Square markedBy="X" />
            <Square markedBy="O" />
            <Square />
        </div>
    );
}
```