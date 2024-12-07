const fs = require("node:fs/promises");

async function puzzle() {
  let input = await fs.readFile("input.txt", { encoding: "utf8" });
  input = input.replaceAll("\r", "").split("\n");
  let rows = [];
  input.forEach((str) => {
    rows.push(str.split(""));
  });

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

  while (isInBound) {
    const guard = rows[currentPositionX][currentPositionY];

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
      if (rows[nextPositionX][nextPositionY] === "#") {
        // changing direction
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

  let visited = 0;

  rows.forEach((row) => {
    row.forEach((char) => {
      if (char === "X") {
        visited++;
      }
    });
  });

  console.log("visited " + (visited + 1));
}

puzzle();
