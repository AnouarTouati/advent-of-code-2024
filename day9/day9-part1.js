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
  let numberofFreeSpaceBlocks = 0;
  diskMapArray.forEach((digit) => {
    if (isFile) {
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

  for (let i = 0; i < numberofFreeSpaceBlocks; i++) {
    let indexOffreeSpaceBlock = blocks.indexOf(".");
    //get the last non "."" block
    for (let j = blocks.length - 1 - i; j > 0; j--) {
      if (blocks[j] !== ".") {
        indexOfFileBlock = j;
        break;
      }
    }
    blocks[indexOffreeSpaceBlock] = blocks[indexOfFileBlock];
    blocks[indexOfFileBlock] = ".";
  }

  let checksum = 0;
  for (let i = 0; i < blocks.length - numberofFreeSpaceBlocks; i++) {
    checksum += Number(blocks[i]) * i;
  }

  console.log("checksum is : " + checksum);
}
puzzle();
