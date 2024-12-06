const fs = require("node:fs/promises");

async function puzzle() {
  let input = await fs.readFile("input.txt", { encoding: "utf8" });
  input = input.replaceAll("\r", "").split("\n");
  let rows = [];
  input.forEach((str) => {
    rows.push(str.split(""));
  });

  let visitedCoordinates = [];
  //find starting position
  rows.forEach((row, index) => {
    if (row.indexOf("^") !== -1) {
      visitedCoordinates.push([index, row.indexOf("^")]);
    }
  });

  let isInBound = true;
  let index = 0;
  while (isInBound) {
    const guard =
      rows[visitedCoordinates[index][0]][visitedCoordinates[index][1]];
    let nextPosition = [-1, -1];
    // console.log(guard);
    switch (guard) {
      case "^":
        nextPosition = [
          visitedCoordinates[index][0] - 1,
          visitedCoordinates[index][1],
        ];
        break;
      case ">":
        nextPosition = [
          visitedCoordinates[index][0],
          visitedCoordinates[index][1] + 1,
        ];
        break;
      case "v":
        nextPosition = [
          visitedCoordinates[index][0] + 1,
          visitedCoordinates[index][1],
        ];
        break;
      case "<":
        nextPosition = [
          visitedCoordinates[index][0],
          visitedCoordinates[index][1] - 1,
        ];
        break;
      default:
        // console.log("something went wrong");
        break;
    }

    if (
      nextPosition[0] < 0 ||
      nextPosition[0] > rows.length - 1 ||
      nextPosition[1] < 0 ||
      nextPosition[1] > rows[0].length - 1
    ) {
      isInBound = false;
    } else {
      if (rows[nextPosition[0]][nextPosition[1]] === "#") {
        // console.log("changing direction");
        switch (guard) {
          case "^":
            rows[visitedCoordinates[index][0]][visitedCoordinates[index][1]] =
              ">";
            break;
          case ">":
            rows[visitedCoordinates[index][0]][visitedCoordinates[index][1]] =
              "v";
            break;
          case "v":
            rows[visitedCoordinates[index][0]][visitedCoordinates[index][1]] =
              "<";
            break;
          case "<":
            rows[visitedCoordinates[index][0]][visitedCoordinates[index][1]] =
              "^";
            break;
          default:
            console.log("something went wrong2");
            break;
        }
      } else {
        // console.log("not changing direction");

        rows[visitedCoordinates[index][0]][visitedCoordinates[index][1]] = "X";

        rows[nextPosition[0]][nextPosition[1]] = guard;

        visitedCoordinates.push(nextPosition);
        index++;
      }
    }
  }

  // rows.forEach((row) => {
  //   console.log(JSON.stringify(row));
  //   console.log("\n");
  // });

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
