const fs = require("node:fs/promises");

let grid = [];
let rowsCount = 0;
let columnsCount = 0;
const getData = async () => {
    let input = await fs.readFile("input.txt", {encoding: "utf8"});
    input = input.replaceAll("\r", "").split("\n");
    grid = []
    input.forEach((row) => grid.push(row.split("")));
    grid.forEach((row) => row.map(Number))
    rowsCount = grid.length;
    columnsCount = grid[0].length;
};

const getAdjacencyList = (i, j) => {
    const adjacencyList = [];
    if (i + 1 < rowsCount) {
        adjacencyList.push([Number(i) + 1, j]);
    }
    if (i - 1 >= 0) {
        adjacencyList.push([Number(i) - 1, j]);
    }
    if (j + 1 < columnsCount) {
        adjacencyList.push([i, Number(j) + 1]);
    }
    if (j - 1 >= 0) {
        adjacencyList.push([i, Number(j) - 1]);
    }
    return adjacencyList;
};
const dfs = (start, previousValue, visited) => {

    if (visited.has(start[0] + "," + start[1])) {
        return;
    } else {
        visited.add(start[0] + "," + start[1]);
        grid[start[0]][start[1]] = ".";
    }

    const nodes = getAdjacencyList(...start);
    nodes.forEach((node) => {
        if (grid[node[0]][node[1]] === previousValue) {
            dfs(node, previousValue, visited);
        }
    });
};
const getBorders = (i, j) => {
    let borders = []
    if (i + 1 < rowsCount) {
        if (grid[i][j] !== grid[i + 1][j]) {
            borders.push([Number(i) + 1, j, "horizontal-bottom"])
        }
    } else {
        borders.push([Number(i) + 1, j, "horizontal-bottom"])
    }

    if (i - 1 >= 0) {
        if (grid[i][j] !== grid[i - 1][j]) {
            borders.push([Number(i) - 1, j, "horizontal-top"])
        }
    } else {
        borders.push([Number(i) - 1, j, "horizontal-top"])
    }

    if (j + 1 < columnsCount) {
        if (grid[i][j] !== grid[i][j + 1]) {
            borders.push([Number(i), j + 1, "vertical-right"])
        }
    } else {
        borders.push([Number(i), j + 1, "vertical-right"])
    }
    if (j - 1 >= 0) {
        if (grid[i][j] !== grid[i][j - 1]) {
            borders.push([Number(i), j - 1, "vertical-left"])
        }
    } else {
        borders.push([Number(i), j - 1, "vertical-left"])
    }
    return borders

}
const removeExcessHorizontalBorders = (borders, borderType) => {
    for (let x = -1; x < rowsCount + 1; x++) {
        let temp = []

        for (let y = -1; y < columnsCount + 1; y++) {
            let index = borders.findIndex((value, index) => {
                return value[0] === x && value[1] === y && value[2] === borderType
            })
            if (index !== -1) {
                temp.push(index)
            } else {
                //end of consecutive borders
                temp.pop()//keep one border
                temp.forEach((borderIndex) => borders[borderIndex] = [null, null, null])//delete the others
                temp = []
            }
        }
    }
}
const removeExcessVerticalBorders = (borders, borderType) => {
    for (let x = -1; x < rowsCount + 1; x++) {
        let temp = []

        for (let y = -1; y < columnsCount + 1; y++) {
            let index = borders.findIndex((value, index) => {
                return value[0] === y && value[1] === x && value[2] === borderType
            })
            if (index !== -1) {
                temp.push(index)
            } else {
                temp.pop()//keep one border
                temp.forEach((borderIndex) => borders[borderIndex] = [null, null, null])
                temp = []
            }
        }
    }
}

async function puzzle() {
    await getData();
    let regionsSet = new Set();

    for (let i = 0; i < rowsCount; i++) {
        for (let j = 0; j < columnsCount; j++) {
            if (grid[i][j] !== ".") {
                let visited = new Set();
                dfs([i, j], grid[i][j], visited);
                regionsSet.add(visited);
            }
        }
    }
    await getData();
    let totalPrice = 0
    regionsSet.forEach((region) => {
        let borders = []
        region.forEach((plant) => {
            let [i, j] = plant.split(",").map(Number)
            borders.push(...getBorders(i, j))
        })

        removeExcessHorizontalBorders(borders, "horizontal-top")
        removeExcessHorizontalBorders(borders, "horizontal-bottom")
        removeExcessVerticalBorders(borders, "vertical-right")
        removeExcessVerticalBorders(borders, "vertical-left")


        let numberOfBorders = 0
        borders.forEach((border) => {
            if (border[0] !== null) {
                numberOfBorders++
            }

        })

        totalPrice += region.size * (numberOfBorders)

    })

    console.log(`total price ${totalPrice}`)
}

puzzle();
