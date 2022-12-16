const fs = require("fs");

function getInputs(file) {
  const regex =
    /Sensor at x=(?<sensor_x>-?\d+), y=(?<sensor_y>-?\d+): closest beacon is at x=(?<beacon_x>-?\d+), y=(?<beacon_y>-?\d+)/;

  const report = fs
    .readFileSync(file, "utf8")
    .split("\n")
    .map((line) => {
      const match = line.match(regex).groups;
      return [
        { x: parseInt(match.sensor_x), y: parseInt(match.sensor_y) },
        { x: parseInt(match.beacon_x), y: parseInt(match.beacon_y) },
      ];
    });

  return report;
}

function manathanDistance(point1, point2) {
  return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
}

function puzzle1() {
  const report = getInputs("input.txt");

  let covered = new Set();
  let Y = 10;

  //FOR EACH BEACON-SENSOR, GET DISTANCE AND FILL COVERED MAP UNTIL DISTANCE IS REACHED FOR EACH BRANCH
  for (const [sensor, beacon] of report) {
    let max_distance = manathanDistance(sensor, beacon);

    //Check if area covered by the sensor is crossing line Y, if not continue with next sensor
    let dy = Math.abs(Y - sensor.y);
    if (dy <= max_distance) {
      // ADD center point ie the one directly on sensor X index
      if (sensor.x !== beacon.x) covered.add(sensor.x);

      // ADD incrementaly left and right points, the more we are close from sensor the more the overlap is big on a given line Y
      // We check if we are addind a point that is a beacon, if so don't add it on covered collection
      for (let dx = 1; dx <= max_distance - dy; dx++) {
        if (sensor.x + dx !== beacon.x || beacon.y != Y) covered.add(sensor.x + dx);
        if (sensor.x - dx !== beacon.x || beacon.y != Y) covered.add(sensor.x - dx);
      }
    }
  }

  let count = covered.size;

  return count;
}

function puzzle2() {
  const report = getInputs("input.txt");

  // const MAX = 20;
  const MAX = 4_000_000;

  for (let y = 0; y <= MAX; y++) {
    const intervals = [];

    for (const [index, [sensor, beacon]] of report.entries()) {
      const distance = manathanDistance(sensor, beacon);

      const dy = Math.abs(y - sensor.y);
      //Check if area covered by the sensor is crossing line y, if not continue with next sensor
      if (dy <= distance) {
        const dx = distance - dy;
        if (sensor.x - dx > MAX || sensor.x + dx < 0) {
          continue;
        }
        intervals.push([Math.max(0, sensor.x - dx), Math.min(sensor.x + dx, MAX)]);
      }
    }

    //sort intervals
    intervals.sort((a, b) => a[0] - b[0]);

    //iterate over interval two by two, if i and i+1 are overlapping, merge them

    for (let i = 0; i < intervals.length - 1; i++) {
      if (intervals[i][1] + 1 >= intervals[i + 1][0]) {
        //MERGE
        intervals[i][1] = Math.max(intervals[i][1], intervals[i + 1][1]);
        intervals.splice(i + 1, 1);
        i--;
      }
    }

    let resultInterval = [];
    for (const interval of intervals) {
      resultInterval.push([interval[0], interval[1]]);
    }

    if (resultInterval.length > 1) {
      const x = resultInterval[0][1] + 1;
      return x * 4_000_000 + y;
    }
  }

  return -1;
}

// Puzzle 1
console.log(" Puzzle 1 : ", puzzle1());

// Puzzle 2
console.log(" Puzzle 2 : ", puzzle2());
