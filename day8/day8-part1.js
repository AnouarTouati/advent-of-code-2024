const fs = require("node:fs/promises");

const getData = async () => {
  let input = await fs.readFile("input.txt", { encoding: "utf8" });
  input = input.replaceAll("\r", "").split("\n");
  let grid = [];
  input.forEach((row) => grid.push(row.split("")));
  return grid;
};
const createAntinodesGrid = (grid) => {
  let antinodesGrid = [];
  for (let i = 0; i < grid.length; i++) {
    let tmp = [];
    for (let j = 0; j < grid[0].length; j++) {
      tmp.push(".");
    }
    antinodesGrid.push(tmp);
  }
  return antinodesGrid;
};
const calculateResult = (antinodesGrid) => {
  let numberOfAntinodes = 0;
  for (let i = 0; i < antinodesGrid.length; i++) {
    for (let j = 0; j < antinodesGrid[0].length; j++) {
      if (antinodesGrid[i][j] === "#") {
        numberOfAntinodes++;
      }
    }
  }
  return numberOfAntinodes;
};
const createVisitedMap = (grid) => {
  let visitedMap = new Map();
  for (let i = 0; i < grid.length; i++) {
    visitedMap.set(i, []);
  }
  return visitedMap;
};

const processBottomLeftToTopRightDiagonal = (
  currentNodeX,
  currentNodeY,
  otherNodeX,
  otherNodeY,
  distanceX,
  distanceY,
  antinodesGrid
) => {
  let firstAntinodeX = otherNodeX + distanceX;
  let firstAntinodeY = otherNodeY - distanceY;

  if (
    0 <= firstAntinodeX &&
    firstAntinodeX < antinodesGrid.length &&
    0 <= firstAntinodeY &&
    firstAntinodeY < antinodesGrid[0].length
  ) {
    antinodesGrid[firstAntinodeX][firstAntinodeY] = "#";
  }

  let secondAntinodeX = currentNodeX - distanceX;
  let secondAntinodeY = currentNodeY + distanceY;

  if (
    0 <= secondAntinodeX &&
    secondAntinodeX < antinodesGrid.length &&
    0 <= secondAntinodeY &&
    secondAntinodeY < antinodesGrid[0].length
  ) {
    antinodesGrid[secondAntinodeX][secondAntinodeY] = "#";
  }
};
const processTopLeftToBottomRightDiagonal = (
  currentNodeX,
  currentNodeY,
  otherNodeX,
  otherNodeY,
  distanceX,
  distanceY,
  antinodesGrid
) => {
  let firstAntinodeX = otherNodeX + distanceX;
  let firstAntinodeY = otherNodeY + distanceY;

  if (
    0 <= firstAntinodeX &&
    firstAntinodeX < antinodesGrid.length &&
    0 <= firstAntinodeY &&
    firstAntinodeY < antinodesGrid[0].length
  ) {
    antinodesGrid[firstAntinodeX][firstAntinodeY] = "#";
  }

  let secondAntinodeX = currentNodeX - distanceX;
  let secondAntinodeY = currentNodeY - distanceY;

  if (
    0 <= secondAntinodeX &&
    secondAntinodeX < antinodesGrid.length &&
    0 <= secondAntinodeY &&
    secondAntinodeY < antinodesGrid[0].length
  ) {
    antinodesGrid[secondAntinodeX][secondAntinodeY] = "#";
  }
};
const processFrequencyNode = (
  grid,
  currentNode,
  currentNodeX,
  currentNodeY,
  visitedMap,
  antinodesGrid
) => {
  for (let otherNodeX = 0; otherNodeX < grid.length; otherNodeX++) {
    for (let otherNodeY = 0; otherNodeY < grid[0].length; otherNodeY++) {
      if (visitedMap.has(otherNodeX)) {
        if (visitedMap.get(otherNodeX).indexOf(otherNodeY) !== -1) {
          break;
        }
      }
      const otherNode = grid[otherNodeX][otherNodeY];
      if (currentNode === otherNode) {
        const distanceX = Math.abs(currentNodeX - otherNodeX);
        const distanceY = Math.abs(currentNodeY - otherNodeY);
        if (otherNodeY < currentNodeY) {
          //bottom left to top right diagonal || horizontal line

          processBottomLeftToTopRightDiagonal(
            currentNodeX,
            currentNodeY,
            otherNodeX,
            otherNodeY,
            distanceX,
            distanceY,
            antinodesGrid
          );
        } else {
          //bottom right to top left diagonal || vertical line

          processTopLeftToBottomRightDiagonal(
            currentNodeX,
            currentNodeY,
            otherNodeX,
            otherNodeY,
            distanceX,
            distanceY,
            antinodesGrid
          );
        }
      }
    }
  }
};
async function puzzle() {
  let grid = await getData();
  let antinodesGrid = createAntinodesGrid(grid);
  let visitedMap = createVisitedMap(grid);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const node = grid[i][j];
      if (node !== ".") {
        visitedMap.get(i).push(j);
        processFrequencyNode(grid, node, i, j, visitedMap, antinodesGrid);
      }
    }
  }

  console.log("number of antinodes : " + calculateResult(antinodesGrid));
}
puzzle();
