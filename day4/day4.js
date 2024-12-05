const fs = require("node:fs/promises");

async function puzzle1() {
  let input = await fs.readFile("input.txt", { encoding: "utf8" });
  const rows = input.split("\n");

  let horiontalOccurrences = 0;
  //horizontal
  rows.forEach((row) => {
    horiontalOccurrences += numberOfOccurrences(row);
  });
  //   console.log("horiontal occurrences : " + horiontalOccurrences);

  //vertical
  let verticalOccurrences = 0;
  for (let j = 0; j < rows.length; j++) {
    let column = "";
    for (let i = 0; i < rows.length; i++) {
      column += rows[i][j];
    }
    verticalOccurrences += numberOfOccurrences(column);
  }
  //   console.log("Vertical Occurrences : " + verticalOccurrences);
  //diagonals
  //sweep the big matrix with 4x4 matrix. 4 is the length of XMAS
  let diagonalOccurrences = 0;
  for (let i = 0; i < rows.length - 3; i++) {
    for (let j = 0; j < rows.length - 3; j++) {
      let fourByFourMatrix = [
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
      ];
      fourByFourMatrix[0][0] = rows[i][j];
      fourByFourMatrix[0][1] = rows[i][j + 1];
      fourByFourMatrix[0][2] = rows[i][j + 2];
      fourByFourMatrix[0][3] = rows[i][j + 3];

      fourByFourMatrix[1][0] = rows[i + 1][j];
      fourByFourMatrix[1][1] = rows[i + 1][j + 1];
      fourByFourMatrix[1][2] = rows[i + 1][j + 2];
      fourByFourMatrix[1][3] = rows[i + 1][j + 3];

      fourByFourMatrix[2][0] = rows[i + 2][j];
      fourByFourMatrix[2][1] = rows[i + 2][j + 1];
      fourByFourMatrix[2][2] = rows[i + 2][j + 2];
      fourByFourMatrix[2][3] = rows[i + 2][j + 3];

      fourByFourMatrix[3][0] = rows[i + 3][j];
      fourByFourMatrix[3][1] = rows[i + 3][j + 1];
      fourByFourMatrix[3][2] = rows[i + 3][j + 2];
      fourByFourMatrix[3][3] = rows[i + 3][j + 3];

      diagonalOccurrences += fourByFourScanner(fourByFourMatrix);
    }
  }
  //   console.log("diagonal occurrences : " + diagonalOccurrences);
  console.log(
    "Number of XMAS/SAMX : " +
      (horiontalOccurrences + verticalOccurrences + diagonalOccurrences)
  );
}
const fourByFourScanner = (matrix) => {
  let count = 0;
  let diagonal1 = matrix[0][0] + matrix[1][1] + matrix[2][2] + matrix[3][3];
  let diagonal2 = matrix[0][3] + matrix[1][2] + matrix[2][1] + matrix[3][0];
  if (numberOfOccurrences(diagonal1)) {
    count++;
  }
  if (numberOfOccurrences(diagonal2)) {
    count++;
  }

  return count;
};
const numberOfOccurrences = (str) => {
  return (
    (count = (str.match(/XMAS/g) || []).length) +
    (count = (str.match(/SAMX/g) || []).length)
  );
};

puzzle1();
