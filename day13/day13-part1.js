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
    machines.forEach((machine, index) => {
        let lowestCostToWin = null
        for (let i = 0; i < 100; i++) {
            for (let j = 0; j < 100; j++) {
                let x = 0
                let y = 0
                x += machine[0] * i
                y += machine[1] * i
                x += machine[2] * j
                y += machine[3] * j

                if (x === machine[4] && y === machine[5]) {
                    let cost = i * Acost + j * Bcost
                    if (lowestCostToWin === null) {
                        lowestCostToWin = cost
                    } else if (lowestCostToWin > cost) {
                        lowestCostToWin = cost
                    }
                }
            }
        }
        if (lowestCostToWin !== null) {
            totalCost += lowestCostToWin
        }
    })

    console.log(`Total cost is ${totalCost}`)
}

puzzle();
