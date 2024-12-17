const fs = require("node:fs/promises");

let robots = [];

const getData = async () => {

    let input = await fs.readFile("input.txt", {encoding: "utf8"});
    input = input.replaceAll("\r", "").replaceAll("p=", "").replaceAll(" v=", ",").split("\n");

    input.forEach((row) => {
        let temp = []
        row.split(",").forEach((char) => temp.push(Number(char)))

        robots.push({Px: temp[0], Py: temp[1], Vx: temp[2], Vy: temp[3]})
    })
};

async function puzzle() {

    await getData();
    const width = 101
    const height = 103

    for (let i = 0; i < 100; i++) {
        robots.forEach((robot) => {
            if (robot.Px + robot.Vx < width && robot.Px + robot.Vx >= 0) {
                robot.Px += robot.Vx
            } else {
                robot.Px = (robot.Px + robot.Vx) % width
                if (robot.Px < 0) {
                    robot.Px = width + robot.Px
                }
            }

            if (robot.Py + robot.Vy < height && robot.Py + robot.Vy >= 0) {
                robot.Py += robot.Vy
            } else {
                robot.Py = (robot.Py + robot.Vy) % height
                if (robot.Py < 0) {
                    robot.Py = height + robot.Py
                }
            }
        })

    }
    let quadrant1Count = 0
    let keepSearching = true
    while (keepSearching) {
        let index = robots.findIndex((robot) => {
            return robot.Px < Math.floor(width / 2) && robot.Py < Math.floor(height / 2);
        })
        if (index !== -1) {
            quadrant1Count++
            robots.splice(index, 1)
        } else {
            keepSearching = false
        }
    }
    let quadrant2Count = 0
    keepSearching = true
    while (keepSearching) {
        let index = robots.findIndex((robot) => {
            return robot.Px > Math.floor(width / 2) && robot.Py < Math.floor(height / 2);
        })
        if (index !== -1) {
            quadrant2Count++
            robots.splice(index, 1)
        } else {
            keepSearching = false
        }
    }
    let quadrant3Count = 0
    keepSearching = true
    while (keepSearching) {
        let index = robots.findIndex((robot) => {
            return robot.Px < Math.floor(width / 2) && robot.Py > Math.floor(height / 2);
        })
        if (index !== -1) {
            quadrant3Count++
            robots.splice(index, 1)
        } else {
            keepSearching = false
        }
    }
    let quadrant4Count = 0
    keepSearching = true
    while (keepSearching) {
        let index = robots.findIndex((robot) => {
            return robot.Px > Math.floor(width / 2) && robot.Py > Math.floor(height / 2);
        })
        if (index !== -1) {
            quadrant4Count++
            robots.splice(index, 1)
        } else {
            keepSearching = false
        }
    }
   
    console.log(`Safet factor ${quadrant1Count * quadrant2Count * quadrant3Count * quadrant4Count}`)
}

puzzle();
