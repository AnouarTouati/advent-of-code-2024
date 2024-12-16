const fs = require("node:fs/promises");

let machines = [];

const getData = async () => {

    let input = await fs.readFile("input.txt", {encoding: "utf8"});
    input = input.replaceAll("\r", "").split("\n\n");
    for (let i = 0; i < input.length; i++) {
        input[i] = input[i].replaceAll("\n", ",")
        input[i] = input[i].replaceAll("Button A: X+", "")
        input[i] = input[i].replaceAll(" Y+", "")
        input[i] = input[i].replaceAll("Button B: X+", "")
        input[i] = input[i].replaceAll(" Y+", "")
        input[i] = input[i].replaceAll("Prize: X=", "")
        input[i] = input[i].replaceAll(" Y=", "")
        input[i] = input[i].split(",")
    }
    input.forEach((row) => {
        let temp = []
        row.forEach((str) => temp.push(Number(str)))
        machines.push(temp)
    })

};

async function puzzle() {

    await getData();

    let totalCost = 0
    const Acost = 3
    const Bcost = 1
    machines.forEach((machine) => {
        let [AX, AY, BX, BY, XResult, YResult] = machine
        XResult += 10000000000000
        YResult += 10000000000000
        let aPresses = ((XResult * BY) - (YResult * BX)) / ((AX * BY) - (BX * AY))
        let bPresses = (YResult - AY * aPresses) / BY
        if (Math.floor(aPresses) === aPresses && Math.floor(bPresses) === bPresses) {
            totalCost += aPresses * Acost + bPresses * Bcost
        }
    })

    console.log(`Total cost is ${totalCost}`)
}

puzzle();
