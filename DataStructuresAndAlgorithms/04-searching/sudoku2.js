class SudokuGame {
    constructor(state) {
        this.board = new SudokuBoard(state);
    }
}

class SudokuBoard {
    constructor(initialState) {
        if (!initialState.isValid()) {
            throw new Error('Invalid initial game state.');
        }
        this.state = initialState ? initialState : new SudokuBoardState();
        this.initialiseSquaresAndGroups(initialState);
    }
    toString() {
        return this.state.toString();
    }
    initialiseSquaresAndGroups(initialState) {
        this.zeroToEight = [0,1,2,3,4,5,6,7,8];

        this.squares = [];
        this.zeroToEight.forEach((i) => {
            this.zeroToEight.forEach((j) => {
                const indexOfSquare = this.squareToEntryIndex(i, j);
                this.squares[indexOfSquare] = new SudokuBoardSquare(initialState.entries[indexOfSquare]);
            });
        });

        this.groups = [];
        this.zeroToEight.forEach((i) => {
            // group for row i
            const squaresInRow = [];
            this.zeroToEight.forEach((j) => {
                // square in column j of row i
                const indexOfSquare = this.squareToEntryIndex(i, j);
                squaresInRow.push(this.squares[indexOfSquare]);
            });
            this.groups.push(new SudokuBoardGroup(squaresInRow));

            // group for column i
            const squaresInColumn = [];
            this.zeroToEight.forEach((j) => {
                // square in row j of column i
                const indexOfSquare = this.squareToEntryIndex(j, i);
                squaresInColumn.push(this.squares[indexOfSquare]);
            });
            this.groups.push(new SudokuBoardGroup(squaresInColumn));

            // group for big (3x3) square i
            const squaresInBigSquare = [];
            const topLeftSquareRow = 3 * Math.floor(i / 3);
            const topLeftSquareColumn = 3 * (i % 3);
            this.zeroToEight.forEach((j) => {
                // square j of big square i
                const squareRowWithinBigSquare = Math.floor(j / 3);
                const squareColumnWithinBigSquare = j % 3;
                const indexOfSquare = this.squareToEntryIndex(topLeftSquareRow + squareRowWithinBigSquare, topLeftSquareColumn + squareColumnWithinBigSquare);
                squaresInBigSquare.push(this.squares[indexOfSquare]);
            });
            this.groups.push(new SudokuBoardGroup(squaresInBigSquare));
        });
    }

    squareToEntryIndex(row, column) {
        return row * 9 + column;
    }

    solveDFS() {
        const branches = [];
        while (branches.length > 0) {


            const state = new SudokuBoardState(this.helper);
            state.entries = statesToExplore.pop();
            // console.log(statesToExplore.length);
            if (state.isValid()) {
                if (state.isSolved()) {
                    console.log("Solution found");
                    console.log(state.getAllEmptyIndexes());
                    console.log(state.entries);
                    console.log("" + state);
                    return state;
                }
                // console.log('State is valid but not solved.');
                const emptyIndexes = state.getAllEmptyIndexes();
                // console.log(emptyIndexes);
                for (let i = 0; i < emptyIndexes.length; i ++) {
                    const emptyIndex = emptyIndexes[i];
                    for (let entryToTry = 1; entryToTry <= 9; entryToTry ++) {
                        // console.log("Trying state with value",entryToTry,"at index",emptyIndex);
                        // const stateWithNewEntry = this.clone();
                        // stateWithNewEntry.entries[emptyIndex] = entryToTry;
                        const newEntriesToTry = state.entries.slice();
                        newEntriesToTry[emptyIndex] = entryToTry;
                        statesToExplore.push(newEntriesToTry);
                    }
                }
                // console.log("There are now", statesToExplore.length, "states to explore");
            }
        }
        return undefined;
    }
}

class SudokuBoardState {
    constructor(helper) {
        this.zeroToEight = [0,1,2,3,4,5,6,7,8];
        this.oneToNine = [1,2,3,4,5,6,7,8,9];
        this.entries = new Array(81).fill(undefined);
        this.helper = helper;
    }

    getAllEmptyIndexes() {
        return this.entries.reduce((allEmptyIndexes, entry, index) => {
            if (entry === undefined) {
                allEmptyIndexes.push(index);
            }
            return allEmptyIndexes;
        }, []);
    }

    // Recursive, DFS
    findSolution() {
        // const emptyIndexes = this.getAllEmptyIndexes();
        // for (let emptyIndex = 0; emptyIndex < emptyIndexes.length; emptyIndex ++) {
        //     for (let entry = 1; entry <= 9; entry ++) {
        //         const stateWithNewEntry = this.clone();
        //         stateWithNewEntry.entries[emptyIndex] = entry;
        //         if (stateWithNewEntry.isValid()) {
        //             if (stateWithNewEntry.isSolved()) {
        //                 return stateWithNewEntry;
        //             }
        //             const solution = stateWithNewEntry.findSolution();
        //             if (solution !== undefined) {
        //                 return solution;
        //             }
        //         }
        //     }
        // }

        // let solutionState = undefined;
        // this.getAllEmptyIndexes().some((emptyIndex) => {
        //     return this.oneToNine.some((entryToTry) => {
        //         const stateWithNewEntry = this.clone();
        //         stateWithNewEntry.entries[emptyIndex] = entryToTry;
        //         if (stateWithNewEntry.isValid()) {
        //             if (stateWithNewEntry.isSolved()) {
        //                 solutionState = stateWithNewEntry;
        //                 console.log('Found solution');
        //                 return true;
        //             } else {
        //                 solutionState = stateWithNewEntry.findSolution();
        //             }
        //         }
        //     });
        // });
        //
        // return solutionState;
    }

    findSolutionDFS() {
        const statesToExplore = [this.entries];
        while (statesToExplore.length > 0) {
            const state = new SudokuBoardState(this.helper);
            state.entries = statesToExplore.pop();
            // console.log(statesToExplore.length);
            if (state.isValid()) {
                if (state.isSolved()) {
                    console.log("Solution found");
                    console.log(state.getAllEmptyIndexes());
                    console.log(state.entries);
                    console.log("" + state);
                    return state;
                }
                // console.log('State is valid but not solved.');
                const emptyIndexes = state.getAllEmptyIndexes();
                // console.log(emptyIndexes);
                for (let i = 0; i < emptyIndexes.length; i ++) {
                    const emptyIndex = emptyIndexes[i];
                    for (let entryToTry = 1; entryToTry <= 9; entryToTry ++) {
                        // console.log("Trying state with value",entryToTry,"at index",emptyIndex);
                        // const stateWithNewEntry = this.clone();
                        // stateWithNewEntry.entries[emptyIndex] = entryToTry;
                        const newEntriesToTry = state.entries.slice();
                        newEntriesToTry[emptyIndex] = entryToTry;
                        statesToExplore.push(newEntriesToTry);
                    }
                }
                // console.log("There are now", statesToExplore.length, "states to explore");
            }
        }
        return undefined;
    }

    setEntry(row, column, entry) {
        this.entries[this.squareToEntryIndex(row, column)] = entry;
    }

    getEntry(row, column) {
        return this.entries[this.squareToEntryIndex(row, column)];
    }

    clone() {
        const clonedState = new SudokuBoardState();
        clonedState.entries = this.entries.fill(undefined);
        clonedState.helper = this.helper;
        return clonedState;
    }

    squareToEntryIndex(row, column) {
        return row * 9 + column;
    }

    isValid() {
        return this.helper.isStateValid(this);
    }

    isSolved() {
        return this.helper.isStateSolved(this);
    }

    toString() {
        let string = '';
        this.zeroToEight.forEach((row) => {
            this.zeroToEight.forEach((column) => {
                const index = this.squareToEntryIndex(row, column);
                const entry = this.entries[index];
                string += '|' + (entry === undefined ? ' ' : entry);
            });
            string += "|\n";
        });
        return string;
    }
}

class SudokuBoardGroup {
    constructor(squares = []) {
        this.squares = squares;
        this.initialiseAllSquares();
    }
    initialiseAllSquares() {
        this.squares.forEach((square, index) => {
            square.addGroup(this, index);
        });
    }
    registerValue(value) {
        this.squares.forEach((square) => {
            square.removePotentialValue(value);
        });
    }
    cloneWithValueAtIndex(value, index) {
        const clone = Object.assign({}, this);
        clone.squares = this.squares.map((square) => {
            return square.cloneWithNewGroup(group);
        });

        return clone;
    }
}

class SudokuBoardSquare {
    constructor(value = undefined) {
        this.groups = [];
        this.value = value;
        this.potentialValues = [
            true, true, true,
            true, true, true,
            true, true, true
        ];
    }
    addGroup(group, idWithinGroup) {
        this.groups[idWithinGroup] = group;
    }
    setValue(value) {
        if (this.value === undefined) {
            throw new Error('Square already has value');
        }
        this.value = value;
        this.groups.forEach((group) => {
            group.registerValue(value);
        });
    }
    hasValue() {
        return this.value === undefined;
    }
    potentialValues() {
        if (this.hasValue()) {
            return [];
        } else {
            return this.potentialValues;
        }
    }
    removePotentialValue(value) {
        delete this.potentialValues[value];
    }
    cloneWithValue(value) {
        this.groups.forEach((group, idWithinGroup) => {

        })
    }
}

class SudokuBoardStateHelper {
    constructor() {
        this.zeroToEight = [0,1,2,3,4,5,6,7,8];
        this.oneToNine = [1,2,3,4,5,6,7,8,9];
        this.groupings = [];

        this.zeroToEight.forEach((rowNumber) => {
            // grouping for row i
            this.groupings.push(this.zeroToEight.map((columnNumber) =>
                this.squareToEntryIndex(rowNumber, columnNumber)
            ));

            // grouping for column i
            this.groupings.push(this.zeroToEight.map((columnNumber) =>
                this.squareToEntryIndex(columnNumber, rowNumber)
            ));

            // grouping for big (3x3) square i
            const bigSquareTopLeftSquareIndex = this.squareToEntryIndex(3 * Math.floor(rowNumber / 3), 3 * (rowNumber % 3));
            this.groupings.push(this.zeroToEight.map((columnNumber) =>
                bigSquareTopLeftSquareIndex + 9 * Math.floor(columnNumber / 3) + (columnNumber % 3)
            ));
        });
    }

    squareToEntryIndex(row, column) {
        return row * 9 + column;
    }

    isStateValid(state) {
        return !this.groupings.some((grouping) => {
            const foundEntries = [];
            return grouping.some((index) => {
                const entry = state.entries[index];
                if (entry !== undefined) {
                    if (foundEntries.includes(entry)) {
                        return true;
                    }
                    foundEntries.push(entry);
                }
            });
        });
    }

    isStateSolved(state) {
        return this.isStateValid(state) && (state.getAllEmptyIndexes().length === 0);
    }

    groupingsToStrings() {
        return this.groupings.map((grouping) => {
            let groupingString = '';
            this.zeroToEight.forEach((row) => {
                this.zeroToEight.forEach((column) => {
                    const index = this.squareToEntryIndex(row, column);
                    groupingString += grouping.includes(index) ? 'X' : '.';
                });
                groupingString += "\n";
            });
            return groupingString;
        });
    }
}

const initialState = new SudokuBoardState(new SudokuBoardStateHelper());
initialState.setEntry(0, 5, 2);
initialState.setEntry(0, 6, 1);

initialState.setEntry(1, 2, 4);
initialState.setEntry(1, 5, 8);
initialState.setEntry(1, 6, 7);

initialState.setEntry(2, 1, 2);
initialState.setEntry(2, 3, 3);
initialState.setEntry(2, 6, 9);

initialState.setEntry(3, 0, 6);
initialState.setEntry(3, 2, 2);
initialState.setEntry(3, 5, 3);
initialState.setEntry(3, 7, 4);

initialState.setEntry(5, 1, 5);
initialState.setEntry(5, 3, 6);
initialState.setEntry(5, 6, 3);
initialState.setEntry(5, 8, 1);

initialState.setEntry(6, 2, 3);
initialState.setEntry(6, 5, 5);
initialState.setEntry(6, 7, 8);

initialState.setEntry(7, 2, 8);
initialState.setEntry(7, 3, 2);
initialState.setEntry(7, 6, 5);

initialState.setEntry(8, 2, 9);
initialState.setEntry(8, 3, 7);

console.log('Starting game with state:');
console.log(initialState.toString());
const game = new SudokuGame(initialState);

// console.log('Empty indexes are:');
// console.log(initialState.getAllEmptyIndexes());

console.log('Solution:');
console.log("" + initialState.findSolutionDFS());
console.log('Done.');
