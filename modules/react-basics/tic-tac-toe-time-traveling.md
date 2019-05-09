# Adding "Time Travel"

As a final exercise, let’s make it possible to “go back in time” to the previous moves in the game.

## Storing a History of Moves

If we mutated the `squareMarks` array, implementing time travel would be very difficult.

However, we used spread operation `...` to create a new copy of the `squareMarks` array after every move, and treated it as immutable. This will allow us to store every past version of the `squareMarks` array, and navigate between the turns that have already happened.

We’ll store the past `squareMarks` arrays in another array called `history`. The `history` array represents all board states, from the first to the last move, and has a shape like this:

```js
history = [
  // Before first move
  {
    squareMarks: [
      null, null, null,
      null, null, null,
      null, null, null,
    ]
  },
  // After first move
  {
    squareMarks: [
      null, null, null,
      null, 'X', null,
      null, null, null,
    ]
  },
  // After second move
  {
    squareMarks: [
      null, null, null,
      null, 'X', null,
      null, null, 'O',
    ]
  },
  // ...
]
```

Now we need to decide which component should own the `history` state.

## Lifting State Up, Again

We’ll want the top-level `App` component to display a list of past moves. It will need access to the `history` to do that, so we will place the `history` state in the top-level `App` component.

First, we’ll set up the initial state for the `App` component within its constructor, then pass the last state in the history in the board for it to use as its state:

```jsx
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                { squareMarks: Array(9).fill(null) }
            ],
        };
    }    

    onSquareMarked(squareMarks) {
        let history = this.state.history;
        history.push({ squareMarks });
        this.setState({ history });        
    }

    render() {
        const history = this.state.history;
        const latestState = history[history.length - 1];

        return (
            <div className="game">
                <div className="game-board">
                    <Board squareMarks={ latestState.squareMarks } onSquareMarked={ squareMarks => this.onSquareMarked(squareMarks) } />
                </div>
                <div className="game-info">                    
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}
```

We'll have the `App` component listen to square mark events from the `Board` and let it update the history.

Then, we'll delegate `squareMarks` updates from the `Board` up to the `App` component. As a side effect, this will also re-render the `Board` everytime an update happens. The steps to update the `Board.jsx` is as follows:

- Remove `squareMarks` state in the constructor as this is not a state handled by this component anymore.
- All parts of the `Board` referencing `this.state.squareMarks` should be updated to `this.props.squareMarks`.
- Remove `squareMarks` in when updating state in `this.setState` on `onSquareClickedOnIndex`; and finally
- Add the code below to trigger a property set event whenever a square is marked:

```jsx
    const onSquareMarkedCallback = this.props.onSquareMarked;
    if (onSquareMarkedCallback) {
        onSquareMarkedCallback(squareMarks);
    } 
```

Updates to `Board.jsx`:

```jsx
import React from 'react';
import Square from 'Components/Square';
import { checkSquareMarksAndGetWinner } from './Board';

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nextPlayer: this.getNextPlayer(),
            winner: null
        };
    }

    getNextPlayer() {
        return this.state && this.state.nextPlayer === "X" ? "O" : "X";
    }

    onSquareClickedOnIndex(index) {
        const squareMarks = [...this.props.squareMarks];

        if (squareMarks[index] != null || this.state.winner != null) {
            return; //  do not proceed if square already has mark or there's a winner
        }

        squareMarks[index] = this.state.nextPlayer;

        const winner = checkSquareMarksAndGetWinner(squareMarks);
        const nextPlayer = this.getNextPlayer();
        this.setState({ nextPlayer, winner });

        const onSquareMarkedCallback = this.props.onSquareMarked;
        if (onSquareMarkedCallback) {
            onSquareMarkedCallback(squareMarks);
        } 
    }

    render() {
        const nextPlayer = this.state.nextPlayer;
        const winner = this.state.winner;
        const squareIndexMatrix = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8]
        ];

        return (
            <div>
                <BoardStatus nextPlayer={ nextPlayer } winner={ winner } />
                {squareIndexMatrix.map((squareIndices, matrixIndex) => 
                <BoardRow 
                    id={ matrixIndex } 
                    key={ matrixIndex } 
                    squareIndices={ squareIndices } 
                    squareMarks={ this.props.squareMarks }
                    onSquareClickedOnIndex={ this.onSquareClickedOnIndex.bind(this) }
                    />
                )}
            </div>
        );
    }
}

const BoardRow = ({ id, squareIndices, squareMarks, onSquareClickedOnIndex }) => (
    <div className="board-row" key={id} >
        {squareIndices.map(squareIndex => (
            <Square 
                key={squareIndex} 
                markedBy={ squareMarks[squareIndex] }
                onClick={ () => onSquareClickedOnIndex(squareIndex) }
                />
        ))}                
    </div>
);

const BoardStatus = ({ nextPlayer, winner }) => (
    <div className="status">
        { winner ? `Winner: ${winner}` : `Next Player: ${nextPlayer}` }
    </div>
);

export default Board;
```

## Displaying Moves

Let's create a new component called `MoveHistory` in `/src/components` with the contents:

```jsx
import React from 'react';

const MoveHistory = ({ moves, onGoToMoveIndex }) => {    
    const moveIndices = Array.from(moves.keys());
    return (
        <ul>
            {   
                moveIndices.map(index => 
                    <li key={ index }>
                        <MoveButton 
                            moveIndex={ index } 
                            onClick={ () => onGoToMoveIndex(index) } 
                            />
                    </li>
                    ) 
            }
        </ul>
    );
};

const MoveButton = ({ moveIndex, onClick }) => (
    <button key={ moveIndex } onClick={ () => onClick() }>
        { moveIndex > 0 ? `Go to move ${moveIndex}` : 'Reset Game' }
    </button>
);

export default MoveHistory;
```

In this component, we are displaying buttons for each state the board is in. We are exposing a property function onGoToMoveIndex that is triggered each time any button is clicked.

Update `App.js`'s `render` function to display the move history inside `.game-info`:

```jsx
    <div className="game">
        <div className="game-board">
            <Board squareMarks={ latestState.squareMarks } onSquareMarked={ squareMarks => this.onSquareMarked(squareMarks) } />
        </div>
        <div className="game-info">                    
            <MoveHistory moves={ history } onGoToMoveIndex={ index => this.onGoToMoveIndex(index) } />
        </div>
    </div>
```

... and finally, add the `onGoToMoveIndex` that will rever the state to the index given:

```jsx
    onGoToMoveIndex(index) {
        const history = this.state.history.slice(0, index + 1);
        this.setState({ history });
    }
```

__`App.js` Result:__

```jsx
import React from 'react';
import Board from 'Components/Board';
import MoveHistory from 'Components/MoveHistory';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                { squareMarks: Array(9).fill(null) }
            ],
        };
    }    

    onSquareMarked(squareMarks) {
        let history = this.state.history;
        history.push({ squareMarks });
        this.setState({ history });

        console.log(history);
    }

    onGoToMoveIndex(index) {
        const history = this.state.history.slice(0, index + 1);
        this.setState({ history });
    }

    render() {
        const history = this.state.history;
        const latestState = history[history.length - 1];

        return (
            <div className="game">
                <div className="game-board">
                    <Board squareMarks={ latestState.squareMarks } onSquareMarked={ squareMarks => this.onSquareMarked(squareMarks) } />
                </div>
                <div className="game-info">                    
                    <MoveHistory moves={ history } onGoToMoveIndex={ index => this.onGoToMoveIndex(index) } />
                </div>
            </div>
        );
    }
}

export default App;
```