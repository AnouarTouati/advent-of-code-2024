const fs = require("node:fs/promises");

async function puzzle1() {
  const input = await fs.readFile("input.txt", { encoding: "utf8" });
  const reports = [];
  input.split("\n").forEach((report) => {
    reports.push(report.split(" ").map(Number));
  });
  let totalValid = 0;

  reports.forEach((report) => {
    let validDiff = true;
    let direction = "asc";
    let isAscOrDesc = true;
    for (let i = 0; i < report.length - 1; i++) {
      //check direction from the first two numbers
      if (i === 0) {
        if (report[0] - report[1] > 0) {
          direction = "desc";
        } else if (report[0] - report[1] < 0) {
          direction = "asc";
        } else {
          direction = null;
          isAscOrDesc = false;
        }
      }

      const diff = Math.abs(report[i] - report[i + 1]);
      if (diff < 1 || diff > 3) {
        validDiff = false;
      }
      if (direction === "asc" && report[i] - report[i + 1] >= 0) {
        isAscOrDesc = false;
      }
      if (direction === "desc" && report[i] - report[i + 1] <= 0) {
        isAscOrDesc = false;
      }
    }
    if (validDiff == true && isAscOrDesc) {
      totalValid++;
    }
  });
  console.log("Number of valid reports is : " + totalValid);
}

puzzle1();

async function puzzle2() {
  const input = await fs.readFile("input.txt", { encoding: "utf8" });
  const reports = [];
  input.split("\n").forEach((report) => {
    reports.push(report.split(" ").map(Number));
  });
  let totalValid = 0;

  reports.forEach((report) => {
    let validDiff = true;
    let direction = "asc";
    let isAscOrDesc = true;

    const reportBackUp = report.slice();
    let dampenerTries = 0;

    let firstPoteniallyBadLevelIndex = -1;
    let secondPoteniallyBadLevelIndex = -1;

    for (let i = 0; i < report.length - 1; i++) {
      //check direction from the first two numbers
      if (i === 0) {
        if (report[0] - report[1] > 0) {
          direction = "desc";
        } else if (report[0] - report[1] < 0) {
          direction = "asc";
        } else {
          direction = null;
          isAscOrDesc = false;
        }
      }

      const diff = Math.abs(report[i] - report[i + 1]);
      if (diff < 1 || diff > 3) {
        validDiff = false;
      }
      if (direction === "asc" && report[i] - report[i + 1] >= 0) {
        isAscOrDesc = false;
      }
      if (direction === "desc" && report[i] - report[i + 1] <= 0) {
        isAscOrDesc = false;
      }

      if (validDiff == false || isAscOrDesc == false) {
        if (dampenerTries == 0) {
          firstPoteniallyBadLevelIndex = i;
          secondPoteniallyBadLevelIndex = i + 1;

          report.splice(firstPoteniallyBadLevelIndex, 1);

          i = -1;
          dampenerTries++;
          //reset the flags
          validDiff = true;
          isAscOrDesc = true;
          direction = "asc";
        } else if (dampenerTries == 1) {
          report = reportBackUp.slice();
          report.splice(secondPoteniallyBadLevelIndex, 1);

          //reset the flags
          validDiff = true;
          isAscOrDesc = true;
          direction = "asc";
          //reset for loop
          i = -1;

          dampenerTries++;
        } else if (dampenerTries === 2) {
          //this block covers the case where the first number is bad
          report = reportBackUp.slice();
          report.splice(0, 1);

          //reset the flags
          validDiff = true;
          isAscOrDesc = true;
          direction = "asc";
          //reset for loop
          i = -1;

          dampenerTries++;
        }
      }
    }

    if (validDiff == true && isAscOrDesc) {
      totalValid++;
    }
  });
  console.log("Number of valid reports with dampener is : " + totalValid);
}

puzzle2();
