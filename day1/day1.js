const fs = require("node:fs/promises");

async function puzzle1() {
  const input = await fs.readFile("input.txt", { encoding: "utf8" });

  const leftNumbers = [];
  const rightNumbers = [];

  input.split("\n").forEach((line) => {
    const twoHalfsOfLine = line.split("   ");
    leftNumbers.push(twoHalfsOfLine[0]);
    rightNumbers.push(twoHalfsOfLine[1]);
  });

  leftNumbers.sort((a, b) => a - b);
  rightNumbers.sort((a, b) => a - b);

  let totalDifference = 0;

  for (let i = 0; i < leftNumbers.length; i++) {
    totalDifference += Math.abs(leftNumbers[i] - rightNumbers[i]);
  }

  console.log(totalDifference);
}
puzzle1();

async function puzzle2() {
  const input = await fs.readFile("input.txt", { encoding: "utf8" });

  const leftNumbers = [];
  const rightNumbers = [];

  input.split("\n").forEach((line) => {
    const twoHalfsOfLine = line.split("   ");
    leftNumbers.push(twoHalfsOfLine[0]);
    rightNumbers.push(twoHalfsOfLine[1]);
  });

  let similarityScore = 0;

  for (let i = 0; i < leftNumbers.length; i++) {
    for (let j = 0; j < leftNumbers.length; j++) {
      if (Number(leftNumbers[i]) == Number(rightNumbers[j])) {
        similarityScore += Number(leftNumbers[i]);
      }
    }
  }

  console.log(similarityScore);
}
puzzle2();
