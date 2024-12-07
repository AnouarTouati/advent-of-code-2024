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
const isTherePatternOfRepeatedlyHitCorners = (directionChanges) => {
  let keysIterator = directionChanges.keys();
  let key = keysIterator.next();

  let numberOfDistinctCornersTakenTwice = 0; //for 4 corner loop
  let numberOfDistinctCornersTakenThreeTimes = 0; //for line loop i.e 2 corners
  while (!key.done) {
    if (directionChanges.get(key.value) >= 2) {
      numberOfDistinctCornersTakenTwice++;
    }
    if (directionChanges.get(key.value) >= 3) {
      numberOfDistinctCornersTakenThreeTimes++;
    }
    key = keysIterator.next();
  }

  if (
    numberOfDistinctCornersTakenTwice >= 4 ||
    numberOfDistinctCornersTakenThreeTimes >= 2
  ) {
    return true;
  }
  return false;
};
const addDirectionChangeToTheList = (
  directionChanges,
  positionX,
  positionY
) => {
  if (directionChanges.has(positionX + "" + positionY)) {
    let currentValue = directionChanges.get(positionX + "" + positionY);

    directionChanges.set(positionX + "" + positionY, currentValue + 1);
  } else {
    directionChanges.set(positionX + "" + positionY, 1);
  }
};
function testForLooping(rows) {
  let numberOfRows = rows.length;
  let numbrOfColumns = rows[0].length;
  let [currentPositionX, currentPositionY] = getStartingPosition(rows);

  let guardLeft = false;
  let directionChanges = new Map();
  while (guardLeft === false) {
    if (isTherePatternOfRepeatedlyHitCorners(directionChanges)) {
      return true;
    }
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
      if (
        rows[nextPositionX][nextPositionY] === "#" ||
        rows[nextPositionX][nextPositionY] === "O"
      ) {
        addDirectionChangeToTheList(
          directionChanges,
          currentPositionX,
          currentPositionY
        );
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
      //guard left i.e no loop
      return false;
    }
  }
}
async function getData() {
  let input = await fs.readFile("input.txt", { encoding: "utf8" });
  input = input.replaceAll("\r", "").split("\n");
  let rows = [];
  input.forEach((str) => {
    rows.push(str.split(""));
  });
  return rows;
}
async function puzzle() {
  let numberOfPossibleObstacle = 0;
  let rows = await getData();
  console.log("number of rows " + rows.length);
  console.log("number of columns " + rows[0].length);
  console.log("total grids to check " + rows.length * rows[0].length);

  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[0].length; j++) {
      if (rows[i][j] !== "#" && rows[i][j] !== "^") {
        // console.log("currenting checking " + (i * 130 + (j + 1)));

        let newRows = structuredClone(rows);
        newRows[i][j] = "O";
        if (testForLooping(newRows)) {
          numberOfPossibleObstacle++;
        }
      }
    }
  }

  console.log(
    "Number of possible loop causing obstacles is : " + numberOfPossibleObstacle
  );
}
puzzle();
