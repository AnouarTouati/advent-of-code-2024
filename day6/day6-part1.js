const fs = require("node:fs/promises");

const getStartingPosition = (rows) => {
  let position = [];
  rows.forEach((row, index) => {
    if (row.indexOf("^") !== -1) {
      position[0] = index;
      position[1] = row.indexOf("^");
    }
  });
  return position;
};

const getNextPosition = (
  currentPositionX,
  currentPositionY,
  guardDirection
) => {
  let nextPositionX = currentPositionX;
  let nextPositionY = currentPositionY;
  switch (guardDirection) {
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
  return [nextPositionX, nextPositionY];
};

const checkIfGuardLeft = (
  nextPositionX,
  nextPositionY,
  numberOfRows,
  numberOfColumns
) => {
  return (
    nextPositionX < 0 ||
    nextPositionX > numberOfRows - 1 ||
    nextPositionY < 0 ||
    nextPositionY > numberOfColumns - 1
  );
};

const changeDirection = (
  rows,
  guardDirection,
  currentPositionX,
  currentPositionY
) => {
  switch (guardDirection) {
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
};

const moveGuarToNextPosition = (
  rows,
  guardDirection,
  currentPositionX,
  currentPositionY,
  nextPositionX,
  nextPositionY
) => {
  rows[currentPositionX][currentPositionY] = "X";
  rows[nextPositionX][nextPositionY] = guardDirection;

  return [nextPositionX, nextPositionY];
};
async function puzzle() {
  let input = await fs.readFile("input.txt", { encoding: "utf8" });
  input = input.replaceAll("\r", "").split("\n");
  let rows = [];
  input.forEach((str) => {
    rows.push(str.split(""));
  });

  let numberOfRows = rows.length;
  let numbrOfColumns = rows[0].length;
  let [currentPositionX, currentPositionY] = getStartingPosition(rows);

  let guardLeft = false;

  while (guardLeft === false) {
    const guardDirection = rows[currentPositionX][currentPositionY];

    let [nextPositionX, nextPositionY] = getNextPosition(
      currentPositionX,
      currentPositionY,
      guardDirection
    );

    if (
      checkIfGuardLeft(
        nextPositionX,
        nextPositionY,
        numberOfRows,
        numbrOfColumns
      ) === false
    ) {
      //puzzle not solved yet, keep going

      //check if we hit an obstacle
      if (rows[nextPositionX][nextPositionY] === "#") {
        changeDirection(
          rows,
          guardDirection,
          currentPositionX,
          currentPositionY
        );
      } else {
        [currentPositionX, currentPositionY] = moveGuarToNextPosition(
          rows,
          guardDirection,
          currentPositionX,
          currentPositionY,
          nextPositionX,
          nextPositionY
        );
      }
    } else {
      //puzzle ends
      guardLeft = true;
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
