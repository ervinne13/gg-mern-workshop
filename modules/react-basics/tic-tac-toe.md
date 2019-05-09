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

## Making an Interactive Component

Let’s fill the Square component with an “X” when we click it. First, change the button tag that is returned from the Square component’s `render()` function to run a function that will run a local function:

```jsx
class Square extends React.Component {
    markWith() {    
        alert('Square clicked');
    }

    render() {
        return (
            <button className="square" onClick={ this.markWith }>
                { this.props.markedBy }
            </button>
        );
    }
}
```

This is so that we can first make sure that the `onClick` really works. Make sure that you pass the function as a value and not actually run the function. Otherwise will make react run the `markWith` function infinitely as the function is being run as the component is being read. The same would happen if you try to pass the `alert('...')` right away.

As a next step, we want the Square component to “remember” that it got clicked, and fill it with an “X” mark. To “remember” things, components use __`state`__.

React components can have state by setting `this.state` in their constructors. `this.state` should be considered as private to a React component that it’s defined in. Let’s store the current value of the Square in `this.state`, and change it when the Square is clicked.

```jsx
class Square extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markedBy: null,
        };
    }

    markWith() {        
        this.setState({ markedBy: "X" });
    }

    render() {
        return (
            <button className="square" onClick={ this.markWith.bind(this) }>
                { this.state.markedBy }
            </button>
        );
    }
}
```

There are 3 changes here in total:

- Add the constructor and set the initial state
- Update the children of the `button` element so that it references the state and not the props anymore
- Doing an explicit binding in the `this.markWith` function called in the `onClick` which we learned in our earlier sessions.

Tip: in cases like the `onClick`, without doing an explicit `this` binding, the `this` keyword is either `null` or `undefined` as there can't be any implicit binding and default binding can't happen as in the spec of ES6, ES6 modules is always in strict mode. Read more [here](https://stackoverflow.com/questions/31685262/not-recommended-to-use-use-strict-in-es6).

Now try clicking on any square in the UI and it should mark everything you clicked:

![tic tac toe progress 5](/img/tic-tac-toe-prog5.png)

By calling `this.setState` from an onClick handler in the Square’s render method, we tell React to re-render that Square whenever its `<button>` is clicked. After the update, the Square’s `this.state.markedBy` will be 'X', so we’ll see the X on the game board. If you click on any Square, an X should show up.

When you call setState in a component, React automatically updates the child components inside of it too.

But how about "O"?

## Lifting State Up

Currently, each Square component maintains the game’s state. To check for a winner, we’ll maintain the value of each of the 9 squares in one location.

We may think that `Board` should just ask each `Square` for the `Square’s` state. Although this approach is possible in React, the __instructor discourages it because the code becomes difficult to understand, susceptible to bugs, and hard to refactor.__ __Instead, the best approach is to store the game’s state in the parent Board component instead of in each `Square`.__ The Board component can tell each `Square` what to display by passing a prop, just like we did when we passed a number to each `Square`.

Update the board to maintain the state of 9 squares:

```jsx
class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //  TODO: remote later and set everything to 
            //  `null` after we check the UI updates
            squareMarks: [
                'O', null, 'X',
                'X', 'X', 'O',
                'O', null, null,
            ],
        };
    }

    //  ...
```

Then we update the `renderRow` function to assign the `markedBy` properties to the appropriate squares:

```jsx
    renderRow(key, squareIndices) {
        return (
            <div className="board-row" key={key} >
                {squareIndices.forEach(squareIndex => (
                    <Square key={squareIndex} markedBy={ this.state.squareMarks[squareIndex] }/>
                ))}                
            </div>
        );
    }
```

This update would allow us to dynamically create `Square`s by simply setting which indices they should consume in the `squareMarks` array in our `state`.

Of course, we have to update the `render` function to assign the indices to each row rendered:

```jsx
    render() {
        const status = 'Next player: X';

        return (
            <div>
                <div className="status">{status}</div>
                {this.renderRow(0, [0, 1, 2])}
                {this.renderRow(1, [3, 4, 5])}
                {this.renderRow(2, [6, 7, 8])}
            </div>
        );
    }
```

But after all these changes, nothing happens. This is because we haven't updated the `Square` component to accept the `markedBy` property again. Simply reverting or `Square` component should now display our initial data:

```jsx
class Square extends React.Component {
    render() {
        return (
            <button className="square" onClick={ () => this.props.onClick() }>
                { this.props.markedBy }
            </button>
        );
    }
}
```

Note that we have to "raise" the `onClick` to the `Square` since the `Square` component doesnt actually have an `onClick`. If it's set, we delegate the event to the actual `onClick` in the `button`.

Tip: You don't actually have to name it `onClick` but for consistency's sake, we just name it the same as the prop it's delegating to.

Now that we know that our state from our board is working, let's clear it up:

```jsx
    constructor(props) {
        super(props);
        this.state = {
            squareMarks: Array(9).fill(null)
        };
    }
```

Now our board should be empty.

## Adding Events on the Board Instead of each Squares

Add a new function called `onSquareClickedOnIndex` and pass a function that will invoke this new function in the `onClick` of each `Square`:

```jsx
    onSquareClickedOnIndex(index) {
        //  ...
    }

    renderRow(key, squareIndices) {
        return (
            <div className="board-row" key={key} >
                {squareIndices.map(squareIndex => (
                    <Square 
                        key={squareIndex} 
                        markedBy={ this.state.squareMarks[squareIndex] }
                        onClick={ () => this.onSquareClickedOnIndex(squareIndex) }
                        />
                ))}                
            </div>
        );
    }
```

Notice though that we're not doing an explicit `this` binding here. Instead, we can use implicit binding since we wrapped the `this.onSquareClickedOnIndex(squareIndex)` call in another function where the `this` keyword referes to the `Board` class' instance.

Fill up the `onSquareClickedOnIndex` function with the following:

```jsx
    onSquareClickedOnIndex(index) {
        const squareMarks = [...this.state.squareMarks];
        squareMarks[index] = 'X';
        this.setState({ squareMarks });
    }
```

This should set any square we click into "X".

__Line by line explanation:__

```jsx
const squareMarks = [...this.state.squareMarks];
```

React normally uses functional programming, thus stateless and pure functions are preferred, so to avoid side effects, we create a copy of the `squareMarks` state first before doing mutation.

```jsx
squareMarks[index] = 'X';
```

This one is pretty self explanatory, no switching between "X" and "O" yet, let's just first mark things with "X".

```jsx
this.setState({ squareMarks });
```

... is actually the same as:

```jsx
this.setState({ squareMarks: squareMarks });
```

... but since the names of the key and value are the same, we use the shorthand method of assigning to keys.

__Testing__

Test in your browser and you should now see that you can set anything you click into "X".

## Save Point & Refactoring

Let's declare our current progress as a save point. Do your commits here and we will be inspecting our code for things that we can improve.

One thing is that we can change the `Square` component to be a functional component instead of class based as we don't really need the other functionality aside from rendering:

so from:

```jsx
import React from 'react';

class Square extends React.Component {
    render() {
        return (
            <button className="square" onClick={ () => this.props.onClick() }>
                { this.props.markedBy }
            </button>
        );
    }
}

export default Square;
```

... you may modify this to:

```jsx
import React from 'react';

const Square = (props) => (
    <button className="square" onClick={ () => props.onClick() }>
        { props.markedBy }
    </button>
);
```

Notice that we changed `this.props` to just `props` as properties are merely assigned to function components.

We can "improve" this further by "resting" the props right away (this is more like a preference of the instructor than an actual improvement since I don't actually know if there's a reasonable performance improvement and the syntax is kinda arguable)

```jsx
import React from 'react';

const Square = ({ markedBy, onClick }) => (
    <button className="square" onClick={ () => onClick() }>
        { markedBy }
    </button>
);

export default Square;
```

It's in your preference too if you want to do pass and explictly bind `this` or wrap the function in another function to do implict binding:

```jsx
//  What we're doing now:
//  Implict `this` binding
<button className="square" onClick={ () => onClick() }>
    { markedBy }
</button>
```

```jsx
//  Optionally:
//  Explicit `this` binding
<button className="square" onClick={ onClick.bind(this) }>
    { markedBy }
</button>
```

## Game Continued: Taking Turns

We will now fix an obvious defect in our tic-tac-toe game: the “O”s cannot be marked on the board.

We’ll set the first move to be “X” by default. We can set this default by modifying the initial state in our Board constructor:

```jsx
class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squareMarks: Array(9).fill(null),
            nextPlayer: null
        };
    }
    //...
```

Then we introduce a new function get the next player depending on what is currently set:

```jsx
    getNextPlayer() {
        return this.state && this.state.nextPlayer === "O" ? "X" : "O";
    }
```

Then finally, utilize `getNextPlayer` everytime a square is clicked and set the state:

```jsx
    onSquareClickedOnIndex(index) {
        const squareMarks = [...this.state.squareMarks];
        
        squareMarks[index] = this.state.nextPlayer;

        const nextPlayer = this.getNextPlayer();
        this.setState({ squareMarks, nextPlayer });
    }
```

With this change, “X”s and “O”s can take turns. Try it!

Let’s also change the “status” text in Board’s render so that it displays which player has the next turn:

```jsx
const status = `Next Player: ${this.state.nextPlayer}`;
```

## Preventing Overriding Squares

There should be a bug in our board which is when you click on a square that's already set, clicking on it again will overwrite its original value, prevent it by updating our `onSquareClickedOnIndex`:

```jsx
    onSquareClickedOnIndex(index) {
        const squareMarks = [...this.state.squareMarks];
        
        if (squareMarks[index] != null) {
            return; //  do not proceed if square already has mark
        }

        squareMarks[index] = this.state.nextPlayer;

        const nextPlayer = this.getNextPlayer();
        this.setState({ squareMarks, nextPlayer });
    }
```

## Declaring a Winner

Let's create a function that tests the current state of the board if there is a winner:

```jsx
    checkBoardAndGetWinner(squareMarks) {
        const horizontalLines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
        ];

        const verticalLines = [
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
        ];

        const crossLines = [
            [0, 4, 8],
            [2, 4, 6],
        ];

        const winningLines = [...horizontalLines, ...verticalLines, ...crossLines];

        for (let i = 0; i < winningLines.length; i++) {
            const [firstIndex] = winningLines[i];
            const markBeingTested = squareMarks[firstIndex];
            if (this.isValuesOnIndicesTheSame(squareMarks, winningLines[i])) {
                return markBeingTested;
            }
        }

        return null;
    }

    isValuesOnIndicesTheSame(list, indices) {
        const [a, b, c] = indices;
        return list[a] 
            && list[a] === list[b] 
            && list[a] === list[c];
    }
```

Note that `isValuesOnIndicesTheSame` is just a utility function that, as it says, checks if the values inside a list in a given indices are all the same.

Let's now create a state where we can store a winning mark:

```jsx
    constructor(props) {
        super(props);
        this.state = {
            squareMarks: Array(9).fill(null),
            nextPlayer: this.getNextPlayer(),
            winner: null
        };
    }
```

We now invoke the `checkBoardAndGetWinner` function whenever a change is detected and set a the winner if there is any. We'll also stop the click events when a there's already a winner.

```jsx
    onSquareClickedOnIndex(index) {
        const squareMarks = [...this.state.squareMarks];

        if (squareMarks[index] != null || this.state.winner != null) {
            return; //  do not proceed if square already has mark or there's a winner
        }

        squareMarks[index] = this.state.nextPlayer;

        const winner = this.checkBoardAndGetWinner(squareMarks);
        const nextPlayer = this.getNextPlayer();
        this.setState({ squareMarks, nextPlayer, winner });
    }
```

Finally, declare a winner by displaying it in the status:

```jsx
    renderStatus(nextPlayer, winner) {
        let status = `Next Player: ${this.state.nextPlayer}`;
        if (winner) {            
            status = `Winner: ${winner}`;
        }

        return <div className="status">{ status }</div>
    }

    render() {
        return (
            <div>
                {this.renderStatus(this.state.nextPlayer, this.state.winner)}
                {this.renderRow(0, [0, 1, 2])}
                {this.renderRow(1, [3, 4, 5])}
                {this.renderRow(2, [6, 7, 8])}
            </div>
        );
    }
```

Your board should now be:

```jsx
import React from 'react';
import Square from 'Components/Square';

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squareMarks: Array(9).fill(null),
            nextPlayer: this.getNextPlayer(),
            winner: null
        };
    }

    getNextPlayer() {
        return this.state && this.state.nextPlayer === "X" ? "O" : "X";
    }

    onSquareClickedOnIndex(index) {
        const squareMarks = [...this.state.squareMarks];

        if (squareMarks[index] != null || this.state.winner != null) {
            return; //  do not proceed if square already has mark or there's a winner
        }

        squareMarks[index] = this.state.nextPlayer;

        const winner = this.checkBoardAndGetWinner(squareMarks);
        const nextPlayer = this.getNextPlayer();
        this.setState({ squareMarks, nextPlayer, winner });
    }

    checkBoardAndGetWinner(squareMarks) {
        const horizontalLines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
        ];

        const verticalLines = [
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
        ];

        const crossLines = [
            [0, 4, 8],
            [2, 4, 6],
        ];

        const winningLines = [...horizontalLines, ...verticalLines, ...crossLines];

        for (let i = 0; i < winningLines.length; i++) {
            const [firstIndex] = winningLines[i];
            const markBeingTested = squareMarks[firstIndex];
            if (this.isValuesOnIndicesTheSame(squareMarks, winningLines[i])) {
                return markBeingTested;
            }
        }

        return null;
    }

    isValuesOnIndicesTheSame(list, indices) {
        const [a, b, c] = indices;
        return list[a] 
            && list[a] === list[b] 
            && list[a] === list[c];
    }

    renderRow(key, squareIndices) {
        return (
            <div className="board-row" key={key} >
                {squareIndices.map(squareIndex => (
                    <Square 
                        key={squareIndex} 
                        markedBy={ this.state.squareMarks[squareIndex] }
                        onClick={ () => this.onSquareClickedOnIndex(squareIndex) }
                        />
                ))}                
            </div>
        );
    }    

    renderStatus(nextPlayer, winner) {
        let status = `Next Player: ${nextPlayer}`;
        if (winner) {            
            status = `Winner: ${winner}`;
        }

        return <div className="status">{ status }</div>
    }

    render() {
        return (
            <div>
                {this.renderStatus(this.state.nextPlayer, this.state.winner)}
                {this.renderRow(0, [0, 1, 2])}
                {this.renderRow(1, [3, 4, 5])}
                {this.renderRow(2, [6, 7, 8])}
            </div>
        );
    }
}

export default Board;
```

## Refactoring & Implementing Semantic Markup

In this state, the source code still looks like it needs more work. We can extract some functionalities and do semantic markup so for better readability.

[Click here for the lesson](/modules/react-basics/tic-tac-toe-semantic.md)

## Better Data Movement Provided by React & Pure Functions

Since we used pure functions in the component behavior we can easily have the ability to do "state tracking". The most important implementation is the possibility of doing "undo":

[Click here for the lesson](/modules/react-basics/tic-tac-toe-time-traveling.md)