const fs = require("fs");

function getInputs(file) {
  const lines = fs.readFileSync(file, "utf8").split("\n");

  let start = {};
  let end = {};
  const heightmap = lines.map((line, y) =>
    [...line].map((squareValue, x) => {
      if (squareValue === "S") {
        start = { y, x };
        return 0;
      }
      if (squareValue === "E") {
        end = { y, x };
        return 25;
      }
      return squareValue.charCodeAt() - 97;
    })
  );

  return [heightmap, start, end];
}

function getHikeStartingPoints(heightmap) {
  let starts = [];

  for (let y = 0; y < heightmap.length; y++) {
    for (let x = 0; x < heightmap[y].length; x++) {
      if (heightmap[y][x] === 0) {
        starts.push({ y, x });
      }
    }
  }
  return starts;
}

function getValidNeighbors(heightmap, visited, point) {
  let neighbors = [];
  let y = point.y;
  let x = point.x;

  // Check RIGHT
  if (x + 1 < heightmap[y].length && !visited[y][x + 1] && heightmap[y][x + 1] <= heightmap[y][x] + 1)
    neighbors.push({ y, x: x + 1 });

  // Check DOWN
  if (y + 1 < heightmap.length && !visited[y + 1][x] && heightmap[y + 1][x] <= heightmap[y][x] + 1)
    neighbors.push({ y: y + 1, x });

  // Check LEFT
  if (x - 1 >= 0 && !visited[y][x - 1] && heightmap[y][x - 1] <= heightmap[y][x] + 1)
    neighbors.push({ y, x: x - 1 });

  // Check UP
  if (y - 1 >= 0 && !visited[y - 1][x] && heightmap[y - 1][x] <= heightmap[y][x] + 1)
    neighbors.push({ y: y - 1, x });

  return neighbors;
}

function BFS(heightmap, start, end) {
  let x = start.x;
  let y = start.y;

  start.parents = [];
  let visited = new Array(heightmap.length).fill().map(() => Array(heightmap[0].length).fill(false));

  let queue = [];
  queue.push(start);

  visited[y][x] = true;

  while (queue.length) {
    let actualSquare = queue.shift();

    if (actualSquare.y === end.y && actualSquare.x === end.x) {
      return actualSquare.parents;
    }

    neighbors = getValidNeighbors(heightmap, visited, actualSquare);
    for (neighbor of neighbors) {
      neighbor.parents = [...actualSquare.parents, { y: actualSquare.y, x: actualSquare.x }];
      queue.push(neighbor);
      visited[neighbor.y][neighbor.x] = true;
    }
  }
}

function puzzle1() {
  [heightmap, start, end] = getInputs("input.txt");

  const pathToEnd = BFS(heightmap, start, end);

  return pathToEnd.length;
}

function puzzle2() {
  [heightmap, _, end] = getInputs("input.txt");

  let pathCandidates = [];
  const startCandidates = getHikeStartingPoints(heightmap);

  for (start of startCandidates) {
    const pathToEnd = BFS(heightmap, start, end);
    pathCandidates.push(pathToEnd);
  }

  pathCandidates.sort((a, b) => a.length - b.length);

  return pathCandidates[0].length;
}

// Puzzle 1
console.log(" Puzzle 1 : ", puzzle1());

// Puzzle 2
console.log(" Puzzle 2 : ", puzzle2());
