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
    }

    toString() {
        return this.state.toString();
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

    findSolutionDFS() {
        let deadEnds = 0;
        let statesExplored = 0;
        const statesToExplore = [this.entries];
        while (statesToExplore.length > 0) {
            const state = new SudokuBoardState(this.helper);
            state.entries = statesToExplore.pop();
            // process.stdout.write(`\rchecked ${++statesExplored} (${statesBlocked} blocked)`);
            const emptyIndexes = state.getAllEmptyIndexes();
            if (emptyIndexes.length === 0) {
                // console.log("Solution found");
                // console.log(state.getAllEmptyIndexes());
                // console.log(state.entries);
                // console.log("" + state);
                return state;
            }
            let numberOfBranchedStates = 0;
            for (let i = 0; i < emptyIndexes.length; i ++) {
                const emptyIndex = emptyIndexes[i];
                for (let entryToTry = 1; entryToTry <= 9; entryToTry ++) {
                    if (state.canIndexBeGivenValue(emptyIndex, entryToTry)) {
                        const newEntriesToTry = state.entries.slice();
                        newEntriesToTry[emptyIndex] = entryToTry;
                        statesToExplore.push(newEntriesToTry);
                        numberOfBranchedStates++;
                    }
                }
            }
            if (numberOfBranchedStates === 0) {
                // console.log(++deadEnds);
                // console.log('Dead end:');
                // console.log(state.toString());
            }
        }
        return undefined;
    }

    findSolutionBFS() {
        let deadEnds = 0;
        let statesExplored = 0;
        const statesToExplore = [this.entries];
        while (statesToExplore.length > 0) {
            const state = new SudokuBoardState(this.helper);
            state.entries = statesToExplore.pop();
            // process.stdout.write(`\rchecked ${++statesExplored} (${statesBlocked} blocked)`);
            const emptyIndexes = state.getAllEmptyIndexes();
            if (emptyIndexes.length === 0) {
                // console.log("Solution found");
                // console.log(state.getAllEmptyIndexes());
                // console.log(state.entries);
                // console.log("" + state);
                return state;
            }
            let numberOfBranchedStates = 0;
            for (let i = 0; i < emptyIndexes.length; i ++) {
                const emptyIndex = emptyIndexes[i];
                for (let entryToTry = 1; entryToTry <= 9; entryToTry ++) {
                    if (state.canIndexBeGivenValue(emptyIndex, entryToTry)) {
                        const newEntriesToTry = state.entries.slice();
                        newEntriesToTry[emptyIndex] = entryToTry;
                        statesToExplore.unshift(newEntriesToTry);
                        numberOfBranchedStates++;
                    }
                }
            }
            if (numberOfBranchedStates === 0) {
                // console.log(++deadEnds);
                // console.log('Dead end:');
                // console.log(state.toString());
            }
        }
        return undefined;
    }

    canIndexBeGivenValue(index, value) {
        const groupingsOfIndex = this.helper.groupingsForIndex[index];
        const someEntryInSomeGroupingOfIndexAlreadyHasValue = groupingsOfIndex.some((indexesOfGrouping) => {
            // return true iff the current grouping already contains the value
            const someEntryInGroupAlreadyHasValue = indexesOfGrouping.some((indexToCheckForValue) => {
                // return true iff the index contains the value
                const valueAlreadyAtIndex = this.entries[indexToCheckForValue];
                return valueAlreadyAtIndex === value;
            });
            return someEntryInGroupAlreadyHasValue;
        });
        return !someEntryInSomeGroupingOfIndexAlreadyHasValue;
    }

    setEntry(row, column, entry) {
        this.entries[this.squareToEntryIndex(row, column)] = entry;
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

class SudokuBoardStateHelper {
    constructor() {
        this.zeroToEight = [0,1,2,3,4,5,6,7,8];
        this.oneToNine = [1,2,3,4,5,6,7,8,9];
        this.groupings = [];
        this.groupingsForIndex = [... new Array(81).keys()].map(() => []);

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

        // set up index to groupings map
        this.groupings.forEach((indexesInGrouping) => {
            // console.log('---');
            // console.log(indexesInGrouping);
            indexesInGrouping.forEach((indexInGrouping) => {
                this.groupingsForIndex[indexInGrouping].push(indexesInGrouping);
            });
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

// initialState.setEntry(0, 0, 7);
// initialState.setEntry(0, 1, 8);
// initialState.setEntry(0, 2, 5);
// initialState.setEntry(0, 3, 9);
// initialState.setEntry(0, 4, 6);
// initialState.setEntry(0, 7, 3);
// initialState.setEntry(0, 8, 4);

initialState.setEntry(1, 2, 4);
initialState.setEntry(1, 5, 8);
initialState.setEntry(1, 6, 7);

// initialState.setEntry(1, 0, 9);
// initialState.setEntry(1, 1, 3);
// initialState.setEntry(1, 3, 5);
// initialState.setEntry(1, 4, 1);
// initialState.setEntry(1, 7, 6);
// initialState.setEntry(1, 8, 2);

initialState.setEntry(2, 1, 2);
initialState.setEntry(2, 3, 3);
initialState.setEntry(2, 6, 9);

// initialState.setEntry(2, 0, 1);
// initialState.setEntry(2, 2, 6);
// initialState.setEntry(2, 4, 4);
// initialState.setEntry(2, 5, 7);
// initialState.setEntry(2, 7, 5);
// initialState.setEntry(2, 8, 8);

initialState.setEntry(3, 0, 6);
initialState.setEntry(3, 2, 2);
initialState.setEntry(3, 5, 3);
initialState.setEntry(3, 7, 4);

// initialState.setEntry(3, 1, 9);
// initialState.setEntry(3, 3, 1);
// initialState.setEntry(3, 4, 7);
// initialState.setEntry(3, 6, 8);
// initialState.setEntry(3, 8, 5);

// initialState.setEntry(4, 0, 3);
// initialState.setEntry(4, 1, 4);
// initialState.setEntry(4, 2, 1);
// initialState.setEntry(4, 3, 8);
// initialState.setEntry(4, 4, 5);
// initialState.setEntry(4, 5, 9);
// initialState.setEntry(4, 6, 2);
// initialState.setEntry(4, 7, 7);
// initialState.setEntry(4, 8, 6);

initialState.setEntry(5, 1, 5);
initialState.setEntry(5, 3, 6);
initialState.setEntry(5, 6, 3);
initialState.setEntry(5, 8, 1);

// initialState.setEntry(5, 0, 8);
// initialState.setEntry(5, 2, 7);
// initialState.setEntry(5, 4, 2);
// initialState.setEntry(5, 5, 4);
// initialState.setEntry(5, 7, 9);

initialState.setEntry(6, 2, 3);
initialState.setEntry(6, 5, 5);
initialState.setEntry(6, 7, 8);

// initialState.setEntry(6, 0, 2);
// initialState.setEntry(6, 1, 1);
// initialState.setEntry(6, 3, 4);
// initialState.setEntry(6, 4, 9);
// initialState.setEntry(6, 6, 6);
// initialState.setEntry(6, 8, 7);

initialState.setEntry(7, 2, 8);
initialState.setEntry(7, 3, 2);
initialState.setEntry(7, 6, 5);

// initialState.setEntry(7, 0, 4);
// initialState.setEntry(7, 1, 7);
// initialState.setEntry(7, 4, 3);
// initialState.setEntry(7, 5, 6);
// initialState.setEntry(7, 7, 1);
// initialState.setEntry(7, 8, 9);

initialState.setEntry(8, 2, 9);
initialState.setEntry(8, 3, 7);

// initialState.setEntry(8, 0, 5);
// initialState.setEntry(8, 1, 6);
// initialState.setEntry(8, 4, 8);
// initialState.setEntry(8, 5, 1);
// initialState.setEntry(8, 6, 4);
// initialState.setEntry(8, 7, 2);
// initialState.setEntry(8, 8, 3);

console.log('Starting game with state:');
console.log(initialState.toString());
const game = new SudokuGame(initialState);

// initialState.helper.groupingsToStrings().forEach((groupingString) => {
//     console.log(groupingString);
// });
// process.exit();

// console.log('Empty indexes are:');
// console.log(initialState.getAllEmptyIndexes());

const solution = initialState.findSolutionBFS();

if (solution !== undefined) {
    console.log("Found a solution:");
    console.log(solution.toString());
} else {
    console.log("Unsolvable");
}
