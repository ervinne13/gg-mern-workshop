# Refactoring & Implementing Semantic Markup

## Semantic Markup

As you learn about HTML and the Web you may find that you encounter one specific word repeatedly that is often left undefined. That word is semantic. You may read statements such as “we went looking for a semantic element” or “We try and be as semantic as we can”, yet never get a clear picture of what the word semantic means. In this article, we'll explore the world of semantic markup, come up with a working definition of the term, and apply the concept to the way we write HTML markup.

Read more: https://html.com/semantic-markup/#ixzz5nOZa4sfF

In the article above, it's trying to make the slements as semantic as possible without the help of defining their own custom markup tags. Something that us React developers can easily do!

Revisit the `render` function of the `Board.jsx`, it's not very semantic is it?

From:

```jsx
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

We would like it to look something like:

```jsx
    render() {
        return (
            <div>
                <BoardStatus nextPlayer={ this.state.nextPlayer } winner={ this.state.winner } />
                <BoardRow key={ 0 } squareIndices={ [0, 1, 2] } />
                <BoardRow key={ 1 } squareIndices={ [3, 4, 5] } />
                <BoardRow key={ 2 } squareIndices={ [6, 7, 8] } />
            </div>
        );
    }
```

Which looks more like a descriptive markup now.

To do this, let's extract the functions `renderStatus` and `renderRow` to be their own components. Tip: you don't have to write new files for them, it's perfectly fine to put these in the same file IF this file is the only file that uses them anyway:

Below the `Board` class in the `Board.jsx` file, add the following lines:

```jsx
const BoardRow = ({ key, squareIndices, squareMarks, onSquareClickedOnIndex }) => (
    <div className="board-row" key={key} >
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
```

... and of course, remove the old functions `renderStatus` and `renderRow` in the `Board` class. Then, update your render function like so:

```jsx
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
                    key={ matrixIndex } 
                    squareIndices={ squareIndices } 
                    squareMarks={ this.state.squareMarks }
                    onSquareClickedOnIndex={ this.onSquareClickedOnIndex.bind(this) }
                    />
                )}
            </div>
        );
    }
```

Notice that to avoid duplicates, we set our values in a matrix beforehand and looped through the matrix instead of manually specifying 3 `BoardRow`s

Test your application and it should still behave the same way.

## Function Extraction

While many of the logic here is bound to the UI and thus belongs to a React component, determining how a board is won is (arguably) not part of that. We can opt to separate the logic by creating a new file called `Board.js` with the following contents:

```js

const indices = {
    horizontalLines: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
    ],
    verticalLines: [
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
    ],
    crossLines: [
        [0, 4, 8],
        [2, 4, 6],
    ]
};

const isValuesOnIndicesTheSame = (list, indices) => {
    const [a, b, c] = indices;
    return list[a] 
        && list[a] === list[b] 
        && list[a] === list[c];
};

export const checkSquareMarksAndGetWinner = squareMarks => {
    const winningLines = [
        ...indices.horizontalLines,
        ...indices.verticalLines,
        ...indices.crossLines,
    ];

    for (let i = 0; i < winningLines.length; i++) {
        const [firstIndex] = winningLines[i];
        const markBeingTested = squareMarks[firstIndex];
        if (isValuesOnIndicesTheSame(squareMarks, winningLines[i])) {
            return markBeingTested;
        }
    }

    return null;
};

const Board = {
   checkSquareMarksAndGetWinner
};

export default Board;
```

There are several things that we did here:

- Moved the functions `checkBoardAndGetWinner` and `isValuesOnIndicesTheSame`
- Discovered that `checkBoardAndGetWinner` is not very appropriate so we rename it to `checkSquareMarksAndGetWinner`
- Extracted the large setting up of lines into one readable variable
- Updated `checkSquareMarksAndGetWinner` to use the new `indices` variable
- Exposed a "module" called "Board"
- Exposed an optional function `checkSquareMarksAndGetWinner` if the user wants to use the function directly.

With this, the user of this "module" has two options:

__Option 1__
```jsx
import Board from './Board';

const winner = Board.checkSquareMarksAndGetWinner(/* ... */);
```

__Option 2__
```jsx
import { checkSquareMarksAndGetWinner } from './Board';

const winner = checkSquareMarksAndGetWinner(/* ... */);
```

We'll update `Board.jsx` and opt with option 2.

In `Board.jsx`:

- Remove the functions `checkBoardAndGetWinner` and `isValuesOnIndicesTheSame`.
- Import `checkSquareMarksAndGetWinner` using option `
- Finally, update `onSquareClickedOnIndex` to use `checkSquareMarksAndGetWinner` and not `this.checkBoardAndGetWinner`

You should end up with something like:

```jsx
import React from 'react';
import Square from 'Components/Square';
import { checkSquareMarksAndGetWinner } from './Board';

class Board extends React.Component {
    // ...

    onSquareClickedOnIndex(index) {
        const squareMarks = [...this.state.squareMarks];

        if (squareMarks[index] != null || this.state.winner != null) {
            return; //  do not proceed if square already has mark or there's a winner
        }

        squareMarks[index] = this.state.nextPlayer;

        const winner = checkSquareMarksAndGetWinner(squareMarks);
        const nextPlayer = this.getNextPlayer();
        this.setState({ squareMarks, nextPlayer, winner });
    }
    // ...
```

## Conflicts and Error on Page

You should notice that there's an error in the page:

<div style="font-size: 2em; font-family: sans-serif; color: rgb(206, 17, 38); white-space: pre-wrap; margin: 0px 2rem 0.75rem 0px; flex: 0 0 auto; max-height: 50%; overflow: auto;">
Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.
</div>

This is because `App.js` is trying to get `Board` but is getting the `Board.js` and not the `Board.jsx`. We have a conflict here. We can resolve this by renaming `Board.jsx` to `BoardComponent.jsx` since it's more appropriate to keep `Board.js`, then udate references in `App.js`.

We're not gonna do that though, we will be doing an update that will have very minimal impact and wound not require us to change anything in the `App.js`

Create a new folder `/src/components/Board/`, move both `Board.js` and `Board.jsx` inside it and create a new file called `package.json` with the contents:

```json
{
    "main": "./Board.jsx"
}
```

The file `package.json` serves as what we call a "Directory Descriptor" which babel recognizes and will ask to point which file should be imported to which we specified "./Board.jsx".

Test your application again and now it should work.

## Other Options

Instead of creating a directory descriptor, you may also rename `Board.jsx` to `index.jsx` or `index.js` and babel will still automatically locate the file.

There's a problem with this though. If you try to search (using `Ctrl`+`P`) "Board" in vscode and you intend to find the component, you will not be able to do so right away since it's now renamed as `index`. Moreover, your application will be flooded by lots of `index.js`/`index.jsx` files!

Of course, you will be flooded by `package.json` in our current implementation, but I would like to argue that you will search for components more than you would search a `package.json` file which is located a the root of the application anyway. It's now up to you what implementation you want to adapt, but the instructor recommends this way.

Moreover, this method will greatly benefit your structure when you decide integrate `Redux` into the application later on. (More on this on upcoming lessons).