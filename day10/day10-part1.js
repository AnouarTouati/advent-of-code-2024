const fs = require("node:fs/promises");

let grid = [];

let rowsCount = 0;
let columnsCount = 0;

const getData = async () => {
  let input = await fs.readFile("input.txt", { encoding: "utf8" });
  input = input.replaceAll("\r", "").split("\n");
  input.forEach((row) => {
    grid.push(row.split(""));
  });

  rowsCount = grid.length;
  columnsCount = grid[0].length;
  for (let i = 0; i < rowsCount; i++) {
    for (let j = 0; j < columnsCount; j++) {
      grid[i][j] = Number(grid[i][j]);
    }
  }
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

let trailsCount = 0;
function dfs(start, lastValue, depth, reachedSet) {
  if (grid[start[0]][start[1]] == 9 && depth === 9) {
    if (!reachedSet.has(start[0] + "," + start[1])) {
      trailsCount++;
      reachedSet.add(start[0] + "," + start[1]);
    }
    return;
  } else if (depth === 9) {
    return;
  }

  const nodes = getAdjacencyList(...start);
  nodes.forEach((node) => {
    if (grid[node[0]][node[1]] === lastValue + 1) {
      dfs(node, grid[node[0]][node[1]], depth + 1, reachedSet);
    }
  });
}
async function puzzle() {
  await getData();
  grid.forEach((row, i) => {
    row.forEach((node, j) => {
      if (node === 0) {
        dfs([i, j], 0, 0, new Set());
      }
    });
  });
  console.log("total valid trails is : " + trailsCount);
}
puzzle();
