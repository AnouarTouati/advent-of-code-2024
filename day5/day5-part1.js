const fs = require("node:fs/promises");

async function puzzle() {
  const rules = await getRules();
  const updates = await getUpdates();
  let sum = 0;
  updates.forEach((update) => {
    let isValid = true;
    for (let i = 0; i < update.length - 1; i++) {
      //check if the next number has a rule where the current number must be after it
      if (rules.get(update[i + 1])) {
        if (rules.get(update[i + 1]).indexOf(update[i]) !== -1) {
          isValid = false;
          break;
        }
      }
    }
    if (isValid) {
      if (update.length % 2 === 0) {
        sum += update[update.length / 2 - 1];
      } else {
        sum += update[(update.length - 1) / 2];
      }
    }
  });
  console.log("Sum of middle page numbers : " + sum);
}

const getRules = async () => {
  let input = await fs.readFile("rules.txt", { encoding: "utf8" });
  const entries = input.replaceAll("\r", "").split("\n");
  const rules = new Map();
  entries.forEach((pairString) => {
    let pair = pairString.split("|");
    pair[0] = Number(pair[0]);
    pair[1] = Number(pair[1]);
    if (rules.has(pair[0])) {
      oldArray = rules.get(pair[0]);
      rules.set(pair[0], [pair[1], ...oldArray]);
    } else {
      rules.set(pair[0], [pair[1]]);
    }
  });
  return rules;
};

const getUpdates = async () => {
  let input = await fs.readFile("updates.txt", { encoding: "utf8" });
  const entries = input.replaceAll("\r", "").split("\n");
  const updates = [];
  entries.forEach((entry) => {
    updates.push(entry.split(",").map(Number));
  });
  return updates;
};
puzzle();
