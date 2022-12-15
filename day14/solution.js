const { count } = require("console");
const fs = require("fs");

function getInputs(file) {
  // minY set to 0 cause we now sand is falling from point (500,0)
  const screen = { minX: Infinity, maxX: -Infinity, minY: 0, maxY: -Infinity };
  const traces = fs
    .readFileSync(file, "utf8")
    .split("\n")
    .map((trace) => {
      return trace.split(" -> ").map((point) => {
        let [x, y] = point.split(",").map(Number);
        if (x < screen.minX) screen.minX = x;
        if (x > screen.maxX) screen.maxX = x;
        // if (coords[1] < screen.minY) screen.minY = coords[1];
        if (y > screen.maxY) screen.maxY = y;
        return { x, y };
      });
      // const [left, right] = group.split("\n").map((line) => JSON.parse(line));
      // return { left, right };
    });

  return [screen, traces];
}

// shift all trace input and sand starting point to accomodate input with large minX values
// this for helping working on a grid with X coords startng at 0
function shiftTraces1(traces, screen) {
  const xShift = screen.minX;
  for (const trace of traces) {
    for (const point of trace) {
      point.x -= xShift;
    }
  }
}

function tracePath(grid, point1, point2) {
  if (point1.x === point2.x) {
    //vertical path
    const [from, to] = point1.y <= point2.y ? [point1.y, point2.y] : [point2.y, point1.y];

    for (let i = from; i <= to; i++) {
      grid[point1.x][i] = 1;
    }
  } else {
    //horizontal path
    const [from, to] = point1.x <= point2.x ? [point1.x, point2.x] : [point2.x, point1.x];
    // console.log({ from, to, diff: to - from });
    for (let i = from; i <= to; i++) {
      grid[i][point1.y] = 1;
    }
  }
}

function printScan(grid) {
  for (let i = 0; i < grid[0].length; i++) {
    let line = "";
    for (let j = 0; j < grid.length; j++) {
      if (grid[j][i] === 1) {
        line += "#";
      } else if (grid[j][i] === 2) {
        line += "*";
      } else {
        line += ".";
      }
    }
    console.log(line);
  }
}

function mooveSand(grid, sand) {
  let maxY = grid[0].length - 1;
  let maxX = grid.length - 1;

  // GO DOWN
  if (sand.y + 1 > maxY) return -1;

  if (grid[sand.x][sand.y + 1] === 0) {
    sand.y++;
    return mooveSand(grid, sand);
  }

  // GO LEFT
  if (sand.x - 1 < 0) return -1;
  if (grid[sand.x - 1][sand.y + 1] === 0) {
    sand.x--;
    sand.y++;
    return mooveSand(grid, sand);
  }

  // GO RIGHT
  if (sand.x + 1 > maxX) return -1;
  if (grid[sand.x + 1][sand.y + 1] === 0) {
    sand.x++;
    sand.y++;
    return mooveSand(grid, sand);
  }
  return 0;
}

function sandCount(grid, startSand) {
  let count = 0;

  while (true) {
    let sand = { x: startSand.x, y: startSand.y };

    let mooveState = mooveSand(grid, sand);

    if (mooveState === -1) break;

    grid[sand.x][sand.y] = 2;
    count++;

    if (grid[startSand.x][startSand.y] !== 0) break;
  }
  return count;
}

function getScan1(traces, screen) {
  let grid = new Array(screen.maxX - screen.minX + 1).fill().map(() => Array(screen.maxY + 1).fill(0));
  // console.log(grid);

  for (const trace of traces) {
    for (let index = 0; index < trace.length - 1; index++) {
      tracePath(grid, trace[index], trace[index + 1]);
    }
  }

  return grid;
}

function getScan2(traces, screen) {
  const height = screen.maxY + 3;
  const width = height * 2 - 1;

  let grid = new Array(width).fill().map(() => Array(height).fill(0));

  for (const trace of traces) {
    for (let index = 0; index < trace.length - 1; index++) {
      tracePath(grid, trace[index], trace[index + 1]);
    }
  }

  return grid;
}

function shiftTraces2(traces, sandstart, screen) {
  const height = screen.maxY + 3;
  const width = height * 2 - 1;
  const xShift = sandstart.x + 1 - Math.ceil(width / 2);

  sandstart.x -= xShift;

  for (const trace of traces) {
    for (const point of trace) {
      point.x -= xShift;
    }
  }
  traces.push([
    { x: 0, y: height - 1 },
    { x: width - 1, y: height - 1 },
  ]);
}

function puzzle1() {
  [screen, traces] = getInputs("input.txt");
  let sandStart = { x: 500 - screen.minX, y: 0 };
  console.log(traces);
  shiftTraces1(traces, screen);

  const grid = getScan1(traces, screen);
  let count = sandCount(grid, sandStart);
  printScan(grid);

  return count;
}

function puzzle2() {
  [screen, traces] = getInputs("input.txt");
  sandstart = { x: 500, y: 0 };

  // Make sand fall point middle of screnn and add bottom floor
  shiftTraces2(traces, sandstart, screen);

  const grid = getScan2(traces, screen);
  let count = sandCount(grid, sandstart);
  // printScan(grid);

  return count;
}
// Puzzle 1
console.log(" Puzzle 1 : ", puzzle1());

// Puzzle 2
console.log(" Puzzle 2 : ", puzzle2());
