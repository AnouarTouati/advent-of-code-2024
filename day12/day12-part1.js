const fs = require("node:fs/promises");

let grid = [];
let rowsCount = 0;
let columnsCount = 0;
const getData = async () => {
  let input = await fs.readFile("input.txt", { encoding: "utf8" });
  input = input.replaceAll("\r", "").split("\n");
  grid =[]
  input.forEach((row) => grid.push(row.split("")));
  grid.forEach((row)=> row.map(Number))
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
  let totalPrice=0
  regionsSet.forEach((region)=>{
   let borders=0
    region.forEach((plant)=>{
      let [i,j]=plant.split(",").map(Number)
      let adjacencyList= getAdjacencyList(i,j)
       borders+= (4-adjacencyList.length)//adjacency list does not include borders with the grid, we have to account for that
       adjacencyList.forEach((neighbour)=>{
        if(grid[i][j]!==grid[neighbour[0]][neighbour[1]]){
          borders++
        }
      })
    })
    totalPrice+=region.size*borders

  })

console.log(`total price ${totalPrice}`)
}
puzzle();
