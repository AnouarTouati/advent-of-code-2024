const fs = require("node:fs/promises");
const _ = require("lodash");

const getData = async () => {
  let input = await fs.readFile("input.txt", { encoding: "utf8" });
  input = input.replaceAll("\r", "").split(" ");
  let numbers = [];
  input.forEach((element) => numbers.push(Number(element)));
  return numbers;
};

const countNumberOfDigits = (value) => {
  let numberOfDigits = 1;

  while (Math.floor(value / 10) > 0) {
    numberOfDigits++;
    value = Math.floor(value / 10);
  }
  return numberOfDigits;
};

const modifiedDFS = _.memoize(
  (stone, depth) => {
    if (depth === 75) {
      return 1;
    }
    if (stone === 0) {
      return modifiedDFS(1, depth + 1);
    }
    if (countNumberOfDigits(stone) % 2 === 0) {
      let str = stone.toString();
      let stone1 = Number(str.substring(0, str.length / 2));
      let stone2 = Number(str.substring(str.length / 2, str.length));
      return modifiedDFS(stone1, depth + 1) + modifiedDFS(stone2, depth + 1);
    }
    return modifiedDFS(stone * 2024, depth + 1);
  },
  (stone, depth) => `${stone}-${depth}`
);
async function puzzle() {
  let data = await getData();
  let numberOfStones = 0;
  data.forEach(
    (number) => (numberOfStones = numberOfStones + modifiedDFS(number, 0))
  );
  console.log("Number of stone is  : " + numberOfStones);
}

puzzle();
