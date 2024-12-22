const fs = require("node:fs/promises");

let grid = [];
let rowsCount = 0;
let columnsCount = 0;
let moves = [];
let currentPosition = {i: 0, j: 0};
const getGrid = async () => {
    let input = await fs.readFile("grid.txt", {encoding: "utf8"});
    input = input.replaceAll("\r", "").split("\n");

    input.forEach((row) => {
        let doubledRow = [];
        let chars = row.split("");
        chars.forEach((char) => {
            if (char === "#") {
                doubledRow.push("#");
                doubledRow.push("#");
            }
            if (char === "O") {
                doubledRow.push("[");
                doubledRow.push("]");
            }
            if (char === ".") {
                doubledRow.push(".");
                doubledRow.push(".");
            }
            if (char === "@") {
                doubledRow.push("@");
                doubledRow.push(".");
            }
        });
        grid.push(doubledRow);
    });
    rowsCount = grid.length;
    columnsCount = grid[0].length;
    for (let i = 0; i < rowsCount; i++) {
        for (let j = 0; j < columnsCount; j++) {
            if (grid[i][j] === "@") {
                currentPosition = {i, j};
                break;
            }
        }
    }
};

const getMoves = async () => {
    let input = await fs.readFile("moves.txt", {encoding: "utf8"});
    input = input.replaceAll("\r", "").replaceAll("\n", "");
    moves = input.split("");
};
const directions = new Map();
directions.set(">", {i: 0, j: 1});
directions.set("v", {i: 1, j: 0});
directions.set("<", {i: 0, j: -1});
directions.set("^", {i: -1, j: 0});

const step = (move) => {

    let gridCopy = structuredClone(grid)
    let currentPositionBackup = structuredClone(currentPosition)
    if (moveBox(move, {i: currentPosition.i, j: currentPosition.j}, gridCopy, new Set(), 1)) {
        grid = gridCopy
    } else {
        currentPosition = currentPositionBackup
    }
};

const moveBox = (move, boxPosition, gridCopy, visited, depth) => {

    let nexPositionCoordinate = {
        i: boxPosition.i + directions.get(move).i,
        j: boxPosition.j + directions.get(move).j,
    };
    let valueAtNextPosition =
        gridCopy[nexPositionCoordinate.i][nexPositionCoordinate.j];

    if (valueAtNextPosition === "#") {
        return false;
    }

    if (valueAtNextPosition === ".") {

        gridCopy[nexPositionCoordinate.i][nexPositionCoordinate.j] = gridCopy[boxPosition.i][boxPosition.j];
        gridCopy[boxPosition.i][boxPosition.j] = ".";
        currentPosition = nexPositionCoordinate
        return true;
    }

    if (valueAtNextPosition === "[" || valueAtNextPosition === "]") {
        if (move === "^" || move === "v") {
            if (visited.has(nexPositionCoordinate.i + "" + nexPositionCoordinate.j)) {
                return true;
            } else {
                visited.add(nexPositionCoordinate.i + "" + nexPositionCoordinate.j);
            }
            let positionSecondPieceOfBox = null;
            if (gridCopy[nexPositionCoordinate.i][nexPositionCoordinate.j] === "[") {
                positionSecondPieceOfBox = {i: nexPositionCoordinate.i, j: nexPositionCoordinate.j + 1};
            }
            if (gridCopy[nexPositionCoordinate.i][nexPositionCoordinate.j] === "]") {
                positionSecondPieceOfBox = {i: nexPositionCoordinate.i, j: nexPositionCoordinate.j - 1};
            }
            if (positionSecondPieceOfBox !== null) {
                if (visited.has(positionSecondPieceOfBox.i + "" + positionSecondPieceOfBox.j) === false) {
                    //if can't move the second piece and the ones next to it we return false
                    if (moveBox(move, structuredClone(positionSecondPieceOfBox), gridCopy, visited, depth + 1) === false) {
                        return false
                    }
                }
            }
        }


        if (moveBox(move, structuredClone(nexPositionCoordinate), gridCopy, visited, depth + 1)) {
            gridCopy[nexPositionCoordinate.i][nexPositionCoordinate.j] = gridCopy[boxPosition.i][boxPosition.j];
            gridCopy[boxPosition.i][boxPosition.j] = ".";
            currentPosition = nexPositionCoordinate
            return true;
        }
        return  false

    }
};

async function puzzle() {
    await getGrid();
    await getMoves();

    grid.forEach((row) => {
        // console.log(JSON.stringify(row));
    });
    moves.forEach((move) => {
        step(move);
    });

    let gpsSum = 0
    for (let i = 0; i < rowsCount; i++) {
        for (let j = 0; j < columnsCount; j++) {
            if (grid[i][j] === "[") {
                gpsSum += 100 * i + j
            }
        }
    }

    console.log(`GPS sum is : ${gpsSum}`)
}

puzzle();
