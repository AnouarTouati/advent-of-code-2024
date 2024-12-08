const fs = require("node:fs/promises");
function dec2bin(dec, numberOfOperators) {
  return (dec >>> 0).toString(2).padStart(numberOfOperators, "0");
}

async function puzzle() {
  let input = await fs.readFile("input.txt", { encoding: "utf8" });
  input = input.replaceAll("\r", "").replaceAll(":", "").split("\n");

  let rows = [];
  input.forEach((str) => {
    rows.push(str.split(" "));
  });
  rows.forEach((row) => row.map(Number));

  let totalSum = 0;
  rows.forEach((row) => {
    let numberOfOperands = row.length - 1;
    let numberOfOperators = numberOfOperands - 1;

    for (let i = 0; i < Math.pow(2, numberOfOperators); i++) {
      let operatorsTable = dec2bin(i, numberOfOperators).split("").map(Number);

      let result = Number(row[1]);
      operatorsTable.forEach((operator, index) => {
        if (operator === 0) {
          result = Number(result) + Number(row[index + 2]);
        } else if (operator === 1) {
          result = Number(result) * Number(row[index + 2]);
        }
      });

      if (result === Number(row[0])) {
        totalSum += result;
        break;
      }
    }
  });
  console.log("calibration value is : " + totalSum);
}

puzzle();
