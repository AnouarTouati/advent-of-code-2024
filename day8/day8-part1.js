const fs = require("node:fs/promises");

async function puzzle() {
  let input = await fs.readFile("input.txt", { encoding: "utf8" });
  input = input.replaceAll("\r", "").split("\n");
  let grid = [];
  input.forEach((row) => grid.push(row.split("")));

  let visited = new Map();

  let antinodes = [];
  for (let i = 0; i < grid.length; i++) {
    visited.set(i, []);
    let tmp = [];
    for (let j = 0; j < grid[0].length; j++) {
      tmp.push(".");
    }
    antinodes.push(tmp);
  }

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const currentFrequency = grid[i][j];
      if (currentFrequency !== ".") {
        visited.get(i).push(j);
        checkForMatchingFrequency(
          grid,
          currentFrequency,
          i,
          j,
          visited,
          antinodes
        );
      }
    }
  }

  // antinodes.forEach((row)=> console.log(JSON.stringify(row)))
  let numberOfAntinodes = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (antinodes[i][j] === "#") {
        numberOfAntinodes++;
      }
    }
  }
  console.log("number of antinodes : " + numberOfAntinodes);
}

const checkForMatchingFrequency = (
  grid,
  currentFrequency,
  currentFrequencyI,
  currentFrequencyJ,
  visited,
  antinodes
) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (visited.has(i)) {
        if (visited.get(i).indexOf(j) !== -1) {
          break;
        }
      }
      const matchingFrequency = grid[i][j];
      if (currentFrequency === matchingFrequency) {
        const distanceX = Math.abs(currentFrequencyI - i);
        const distanceY = Math.abs(currentFrequencyJ - j);
        if (j < currentFrequencyJ) {
          //bottom left to top right diagonal
          let antinode1I = i + distanceX;
          let antinode1J = j - distanceY;

          if (
            0 <= antinode1I &&
            antinode1I < grid.length &&
            0 <= antinode1J &&
            antinode1J < grid[0].length
          ) {
            antinodes[antinode1I][antinode1J] = "#";
          }

          let antinode2I = currentFrequencyI - distanceX;
          let antinode2J = currentFrequencyJ + distanceY;

          if (
            0 <= antinode2I &&
            antinode2I < grid.length &&
            0 <= antinode2J &&
            antinode2J < grid[0].length
          ) {
            antinodes[antinode2I][antinode2J] = "#";
          }
        } else {
          //bottom right to top left diagonal or vertical / horizontal
          let antinode1I = i + distanceX;
          let antinode1J = j + distanceY;

          if (
            0 <= antinode1I &&
            antinode1I < grid.length &&
            0 <= antinode1J &&
            antinode1J < grid[0].length
          ) {
            antinodes[antinode1I][antinode1J] = "#";
          }

          let antinode2I = currentFrequencyI - distanceX;
          let antinode2J = currentFrequencyJ - distanceY;

          if (
            0 <= antinode2I &&
            antinode2I < grid.length &&
            0 <= antinode2J &&
            antinode2J < grid[0].length
          ) {
            antinodes[antinode2I][antinode2J] = "#";
          }
        }
      }
    }
  }
};
puzzle();
