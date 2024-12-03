const fs = require("node:fs/promises");

async function puzzle1() {
  let input = await fs.readFile("./input.txt", { encoding: "utf8" });

  let state = "";
  const tuples = [];
  let tuple = ["", ""];

  const reset = () => {
    state = "";
    tuple = ["", ""];
  };

  for (let i = 0; i < input.length; i++) {
    switch (input[i]) {
      case "m":
        state === "" ? (state = "m") : reset();
        break;
      case "u":
        state === "m" ? (state = "mu") : reset();
        break;
      case "l":
        state === "mu" ? (state = "mul") : reset();
        break;
      case "(":
        state === "mul" ? (state = "mul(") : reset();
        break;

      case ",":
        state === "mul(x" ? (state = "mul(x,") : reset();
        break;

      case ")":
        state === "mul(x,y" ? (state = "mul(x,y)") : reset();
        break;
      default:
        if (
          isNaN(input[i]) === false &&
          (state === "mul(" || state === "mul(x")
        ) {
          state = "mul(x";
          tuple[0] += input[i];
        } else if (
          isNaN(input[i]) === false &&
          (state === "mul(x," || state === "mul(x,y")
        ) {
          state = "mul(x,y";
          tuple[1] += input[i];
        } else {
          reset();
        }
        break;
    }
    if (state === "mul(x,y)") {
      tuples.push(tuple);
      reset();
    }
  }
  tuples.map((tuple) => [Number(tuple[0]), Number(tuple[1])]);
  let sum = 0;
  tuples.forEach((tuple) => {
    sum += tuple[0] * tuple[1];
  });

  console.log("sum of all multiplications is : " + sum);
}

puzzle1();
