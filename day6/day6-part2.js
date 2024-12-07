const fs = require("node:fs/promises");
const { default: test } = require("node:test");

async function getData() {
  let input = await fs.readFile("input.txt", { encoding: "utf8" });
  input = input.replaceAll("\r", "").split("\n");
  let rows = [];
  input.forEach((str) => {
    rows.push(str.split(""));
  });
  return rows;
}
async function part2() {
  let numberOfPossibleObstacle = 0;
  let rows = await getData();
  console.log("number of rows " + rows.length);
  console.log("number of columns " + rows[0].length);
  console.log("total grids to check " + rows.length * rows[0].length);

  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[0].length; j++) {
      if (rows[i][j] !== "#" && rows[i][j] !== "^") {
        // console.log("currenting checking " + (i * 130 + (j + 1)));
        // console.log("i:" + i + " j:" + j);
        // console.log(
        //   "Number of possible loop causing obstacles is : " +
        //     numberOfPossibleObstacle
        // );
        let newRows = structuredClone(rows);
        newRows[i][j] = "O";
        if (testForLoop(newRows)) {
          numberOfPossibleObstacle++;
        }
      }
    }
  }

  console.log(
    "Number of possible loop causing obstacles is : " + numberOfPossibleObstacle
  );
}
function testForLoop(rows) {
  let currentPositionX = -1;
  let currentPositionY = -1;
  //find starting position
  rows.forEach((row, index) => {
    if (row.indexOf("^") !== -1) {
      currentPositionX = index;
      currentPositionY = row.indexOf("^");
    }
  });

  let isInBound = true;
  let directionChanges = new Map();
  while (isInBound) {
    if (directionChanges.keys.length > 25) return false;
    let keysIterator = directionChanges.keys();
    let key = keysIterator.next();

    let numberOfCornersTakenTwice = 0;
    let numberOfCornersTakenSixTime = 0;
    while (!key.done) {
      if (directionChanges.get(key.value) >= 2) {
        numberOfCornersTakenTwice++;
      }
      if (directionChanges.get(key.value) >= 6) {
        numberOfCornersTakenSixTime++;
      }
      key = keysIterator.next();
    }

    if (numberOfCornersTakenTwice >= 4 || numberOfCornersTakenSixTime >= 2)
      return true;
    const guard = rows[currentPositionX][currentPositionY];
    // if (directionChanges.size === 144) {
    //   console.log(
    //     currentPositionX + 1 + " " + (currentPositionY + 1) + " " + guard
    //   );
    // }
    let nextPositionX = currentPositionX;
    let nextPositionY = currentPositionY;
    //get coordinate of next position
    switch (guard) {
      case "^":
        nextPositionX = currentPositionX - 1;
        break;
      case ">":
        nextPositionY = currentPositionY + 1;
        break;
      case "v":
        nextPositionX = currentPositionX + 1;
        break;
      case "<":
        nextPositionY = currentPositionY - 1;
        break;
      default:
        console.log("something went wrong");
        break;
    }
    //check if next position is out of bounds. meaning guard left, aka puzzle end
    if (
      nextPositionX < 0 ||
      nextPositionX > rows.length - 1 ||
      nextPositionY < 0 ||
      nextPositionY > rows[0].length - 1
    ) {
      //game ends
      isInBound = false;
    } else {
      //we are still in the game
      //check if we hit an obstacle
      if (
        rows[nextPositionX][nextPositionY] === "#" ||
        rows[nextPositionX][nextPositionY] === "O"
      ) {
        // changing direction
        // console.log("direction change");
        if (directionChanges.has(currentPositionX + "" + currentPositionY)) {
          let currentValue = directionChanges.get(
            currentPositionX + "" + currentPositionY
          );

          directionChanges.set(
            currentPositionX + "" + currentPositionY,
            currentValue + 1
          );
        } else {
          directionChanges.set(currentPositionX + "" + currentPositionY, 1);
        }

        switch (guard) {
          case "^":
            rows[currentPositionX][currentPositionY] = ">";
            break;
          case ">":
            rows[currentPositionX][currentPositionY] = "v";
            break;
          case "v":
            rows[currentPositionX][currentPositionY] = "<";
            break;
          case "<":
            rows[currentPositionX][currentPositionY] = "^";
            break;
          default:
            console.log("something went wrong 2");
            break;
        }
      } else {
        //move the guard to the next position
        rows[currentPositionX][currentPositionY] = "X";
        rows[nextPositionX][nextPositionY] = guard;

        currentPositionX = nextPositionX;
        currentPositionY = nextPositionY;
      }
    }
  }

  //guard left the grid
  return false;
}

part2();
