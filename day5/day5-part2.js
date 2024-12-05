const fs = require("node:fs/promises");

async function puzzle() {
  const rules = await getRules();
  const updates = await getUpdates();

  const inValidUpdates = getInvalidUpdates(updates, rules);
  const fixedUpdates = [];
  inValidUpdates.forEach((update) => {
    //bubble sort according to the rules
    for (let i = 0; i < update.length - 1; i++) {
      for (let j = i + 1; j < update.length; j++) {
        if (rules.get(update[j])) {
          if (rules.get(update[j]).indexOf(update[i]) !== -1) {
            let temp = update[i];
            update[i] = update[j];
            update[j] = temp;
          }
        }
      }
    }
    fixedUpdates.push(update);
  });
  let sum = 0;
  fixedUpdates.forEach((update) => {
    if (update.length % 2 === 0) {
      sum += update[update.length / 2 - 1];
    } else {
      sum += update[(update.length - 1) / 2];
    }
  });
  console.log(
    "sum of middle pages of bad updates after they have been fixed is : " + sum
  );
}
const getInvalidUpdates = (updates, rules) => {
  const inValidUpdates = [];
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
    if (isValid === false) {
      inValidUpdates.push(update);
    }
  });
  return inValidUpdates;
};
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
