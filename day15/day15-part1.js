const fs = require("node:fs/promises");

let grid = [];
let rowsCount = 0
let columnsCount = 0
let moves = []
let currentPosition = {i: 0, j: 0}
const getGrid = async () => {

    let input = await fs.readFile("grid.txt", {encoding: "utf8"});
    input = input.replaceAll("\r", "").split("\n");

    input.forEach((row) => {

        grid.push(row.split(""))
    })
    rowsCount = grid.length
    columnsCount = grid[0].length
    for (let i = 0; i < rowsCount; i++) {
        for (let j = 0; j < columnsCount; j++) {
            if (grid[i][j] === "@") {
                currentPosition = {i, j}
                break
            }
        }
    }
};

const getMoves = async () => {

    let input = await fs.readFile("moves.txt", {encoding: "utf8"});
    input = input.replaceAll("\r", "").replaceAll("\n", "");
    moves = input.split("")
};
const directions = new Map()
directions.set(">", {i: 0, j: 1})
directions.set("v", {i: 1, j: 0})
directions.set("<", {i: 0, j: -1})
directions.set("^", {i: -1, j: 0})

const step = (move) => {
    let nexPositionCoordinate = {
        i: currentPosition.i + directions.get(move).i,
        j: currentPosition.j + directions.get(move).j
    }
    let valueAtNextPosition = grid[nexPositionCoordinate.i][nexPositionCoordinate.j]

    if (valueAtNextPosition === "#") {
        return
    }

    if (valueAtNextPosition === ".") {
        grid[nexPositionCoordinate.i][nexPositionCoordinate.j] = "@"
        grid[currentPosition.i][currentPosition.j] = "."
        currentPosition = nexPositionCoordinate
    }
    if (valueAtNextPosition === "O") {
        if(moveBox(move,structuredClone(nexPositionCoordinate))){
            //successfully moved the box
            //now we can do the move we came for
            step(move)
        }
    }
}

const moveBox = (move,boxPosition) => {
    let nexPositionCoordinate = {
        i: boxPosition.i + directions.get(move).i,
        j: boxPosition.j + directions.get(move).j
    }
    let valueAtNextPosition = grid[nexPositionCoordinate.i][nexPositionCoordinate.j]

    if (valueAtNextPosition === "#") {
        return false
    }

    if (valueAtNextPosition === ".") {
        grid[nexPositionCoordinate.i][nexPositionCoordinate.j] = "O"
        grid[boxPosition.i][boxPosition.j] = "."
        return true
    }

    if (valueAtNextPosition === "O") {
        return moveBox(move,nexPositionCoordinate)
    }
}

async function puzzle() {

    await getGrid();
    await getMoves()

    moves.forEach((move) => {
        step(move)
        // console.log(`Move ${move}:`)
        grid.forEach((row)=>{
            // console.log(JSON.stringify(row))
        })
    })
    let gpsSum= 0
    for (let i = 0; i < rowsCount; i++) {
        for (let j = 0; j < columnsCount; j++) {
            if(grid[i][j]==="O"){
                gpsSum += 100 * i + j
            }
        }
    }

    console.log(`GPS sum is : ${gpsSum}`)
}

puzzle();
