const fs = require("node:fs/promises");
function dec2bin(dec, numberOfOperators) {
  return (dec >>> 0).toString(3).padStart(numberOfOperators, "0");
}

async function puzzle() {
  let input = await fs.readFile("input.txt", { encoding: "utf8" });
  input = input.replaceAll("\r", "").split("\n");

  let rows = [];
  let results = [];
  input.forEach((str) => {
    let [result, operands] = str.split(": ");

    results.push(result);
    rows.push(operands.split(" "));
  });

  rows.forEach((row) => row.map(Number));
  results.forEach(Number);

  let totalSum = 0;
  rows.forEach((row, rowIndex) => {
    let numberOfOperands = row.length;
    let numberOfOperators = numberOfOperands - 1;
    // loop to test all possible combinations
    for (let i = 0; i < Math.pow(3, numberOfOperators); i++) {
      //create combinations in binary form
      let operatorsTable = dec2bin(i, numberOfOperators).split("").map(Number);

      let result = Number(row[0]);
      operatorsTable.forEach((operator, index) => {
        if (operator === 0) {
          result = Number(result) + Number(row[index + 1]);
        } else if (operator === 1) {
          result = Number(result) * Number(row[index + 1]);
        } else if (operator === 2) {
          result = Number(result + "" + row[index + 1]);
        }
      });

      if (result === Number(results[rowIndex])) {
        totalSum += result;
        break;
      }
    }
  });
  console.log("calibration value is : " + totalSum);
}

puzzle();
