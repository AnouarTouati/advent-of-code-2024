const fs = require("node:fs/promises");

async function puzzle() {
  let input = await fs.readFile("input.txt", { encoding: "utf8" });
  const rows = input.split("\n");

  let occurrences = 0;
  for (let i = 0; i < rows.length - 2; i++) {
    for (let j = 0; j < rows.length - 2; j++) {
      let threeByThreeMatrix = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ];
      threeByThreeMatrix[0][0] = rows[i][j];
      threeByThreeMatrix[0][1] = rows[i][j + 1];
      threeByThreeMatrix[0][2] = rows[i][j + 2];

      threeByThreeMatrix[1][0] = rows[i + 1][j];
      threeByThreeMatrix[1][1] = rows[i + 1][j + 1];
      threeByThreeMatrix[1][2] = rows[i + 1][j + 2];

      threeByThreeMatrix[2][0] = rows[i + 2][j];
      threeByThreeMatrix[2][1] = rows[i + 2][j + 1];
      threeByThreeMatrix[2][2] = rows[i + 2][j + 2];

      occurrences += threeByThreeScanner(threeByThreeMatrix);
    }
  }

  console.log("Number of XMAS/SAMX : " + occurrences);
}

const threeByThreeScanner = (matrix) => {
  let diagonal1 = matrix[0][0] + matrix[1][1] + matrix[2][2];
  let diagonal2 = matrix[0][2] + matrix[1][1] + matrix[2][0];
  if (numberOfOccurrences(diagonal1) && numberOfOccurrences(diagonal2)) {
    return 1;
  } else {
    return 0;
  }
};
const numberOfOccurrences = (str) => {
  return (
    (count = (str.match(/MAS/g) || []).length) +
    (count = (str.match(/SAM/g) || []).length)
  );
};

puzzle();
