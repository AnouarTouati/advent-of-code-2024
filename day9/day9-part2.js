const fs = require("node:fs/promises");

const getData = async () => {
  let input = await fs.readFile("input.txt", { encoding: "utf8" });
  return input.split("");
};
async function puzzle() {
  let diskMapArray = await getData();
  let ID = 0;
  let isFile = true;
  let blocks = [];
  let startAndEndOfEachFile = [];
  let numberofFreeSpaceBlocks = 0;
  diskMapArray.forEach((digit) => {
    if (isFile) {
      let start = Number(blocks.length);
      let end = Number(blocks.length) + Number(digit);
      startAndEndOfEachFile.push([start, end]);
      for (let i = 0; i < digit; i++) {
        blocks.push(ID);
      }
      ID++;
    } else {
      for (let i = 0; i < digit; i++) {
        blocks.push(".");
        numberofFreeSpaceBlocks++;
      }
    }

    isFile = !isFile;
  });

  startAndEndOfEachFile.reverse().forEach((startAndEndIndexes) => {
    // console.log(JSON.stringify(blocks));
    let [start, end] = startAndEndIndexes;
    let freeSpaceNeeded = end - start;
    let str = blocks.toString().replaceAll(",", "");
    let freeSpaceStr = "";
    for (let i = 0; i < freeSpaceNeeded; i++) {
      freeSpaceStr = freeSpaceStr.concat(".");
    }

    let freeSpaceStartIndex = str.indexOf(freeSpaceStr);

    if (freeSpaceStartIndex !== -1 && freeSpaceStartIndex < start) {
      for (let i = 0; i < freeSpaceNeeded; i++) {
        blocks[freeSpaceStartIndex + i] = blocks[start + i];
        blocks[start + i] = ".";
      }
    }
  });
  // console.log(JSON.stringify(blocks));
  let checksum = 0;
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i] !== ".") {
      checksum += Number(blocks[i]) * i;
    }
  }

  console.log("checksum is : " + checksum);
}
puzzle();
