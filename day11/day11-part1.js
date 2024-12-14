const fs = require("node:fs/promises");

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
async function puzzle() {
  let data = await getData();

  for (let blinks = 0; blinks < 25; blinks++) {
    for (let i = 0; i < data.length; i++) {
      if (data[i] === 0) {
        data[i] = 1;
      } else if (countNumberOfDigits(data[i]) % 2 === 0) {
        let str = data[i].toString();
        let stone1 = Number(str.substring(0, str.length / 2));
        let stone2 = Number(str.substring(str.length / 2, str.length));

        data.splice(i, 1, stone1, stone2);
        i++;
      } else {
        data[i] = data[i] * 2024;
      }
    }
  }

  console.log("Number of stone is  : " + data.length);
}
puzzle();
