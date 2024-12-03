const fs = require("node:fs/promises");

async function puzzle() {
  let input = await fs.readFile("./input.txt", { encoding: "utf8" });

  let state = "";
  const tuples = [];
  let tuple = ["", ""];

  let active = true;
  let doState = "";
  let dontState = "";

  const reset = () => {
    state = "";
    tuple = ["", ""];
  };

  for (let i = 0; i < input.length; i++) {
    switch (input[i]) {
      case "d":
        doState === "" ? (doState = "d") : (doState = "");
        break;
      case "o":
        doState === "d" ? (doState = "do") : (doState = "");
        break;
      case "(":
        doState === "do" ? (doState = "do(") : (doState = "");
        break;
      case ")":
        doState === "do(" ? (doState = "do()") : (doState = "");
        break;
      default:
        doState = "";
        break;
    }
    if (doState === "do()") {
      active = true;
      dontState = "";
      doState = "";
    }

    switch (input[i]) {
      case "d":
        dontState === "" ? (dontState = "d") : (dontState = "");
        break;
      case "o":
        dontState === "d" ? (dontState = "do") : (dontState = "");
        break;
      case "n":
        dontState === "do" ? (dontState = "don") : (dontState = "");
        break;
      case "'":
        dontState === "don" ? (dontState = "don'") : (dontState = "");
        break;
      case "t":
        dontState === "don'" ? (dontState = "don't") : (dontState = "");
        break;
      case "(":
        dontState === "don't" ? (dontState = "don't(") : (dontState = "");
        break;
      case ")":
        dontState === "don't(" ? (dontState = "don't()") : (dontState = "");
        break;
      default:
        dontState = "";
        break;
    }
    if (dontState === "don't()") {
      active = false;
      dontState = "";
      doState = "";
    }
    if (active) {
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
    } else {
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

puzzle();
