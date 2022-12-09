const fs = require("fs");

function getInputs(file) {
  const inputs = fs
    .readFileSync(file, "utf8")
    .split("\n")
    .map((line) => line.split(" "))
    .map((line) => [line[0], Number(line[1])]);

  return inputs;
}

function mooveHead(direction, head) {
  switch (direction) {
    case "R":
      head.col += 1;
      break;
    case "L":
      head.col -= 1;
      break;
    case "U":
      head.line += 1;
      break;
    case "D":
      head.line -= 1;
      break;
    default:
      break;
  }
}
function mooveKnot(knot, leadingKnot, visited) {
  let dx = leadingKnot.col - knot.col;
  let dy = leadingKnot.line - knot.line;

  if (Math.abs(dx) > 1) {
    knot.col += 1 * Math.sign(dx);
    if (Math.abs(dy) > 0) {
      knot.line += 1 * Math.sign(dy);
    }
  } else {
    if (Math.abs(dy) > 1) {
      knot.line += 1 * Math.sign(dy);
      if (Math.abs(dx) > 0) {
        knot.col += 1 * Math.sign(dx);
      }
    }
  }
}

function printPosition(rope) {
  console.log("----HEAD-&-TAIL------");
  for (let i = 5; i >= -5; i--) {
    let line = "";
    for (let j = -5; j <= 5; j++) {
      let placed = false;
      for (let x = 0; x < rope.length; x++) {
        if (rope[x].line === i && rope[x].col === j) {
          if (x === 0) {
            line += "[H]";
          } else {
            line += `[${x}]`;
          }
          placed = true;
          break;
        }
      }
      if (!placed) line += " . ";
    }
    console.log(line);
  }
  console.log("---------------------");
}

function printVisited(visited) {
  console.log("-----VISITED--------------");
  for (let i = 5; i >= -5; i--) {
    let line = "";
    for (let j = -5; j <= 5; j++) {
      if (visited.has(`${i} ${j}`)) {
        line += "[X]";
      } else {
        line += " . ";
      }
    }
    console.log(line);
  }
  console.log("--------------------------");
}

function puzzle(ropeMooves, ropeSize) {
  let visited = new Set();
  let rope = new Array(ropeSize).fill().map((elt) => ({ col: 0, line: 0 }));

  for ([direction, steps] of ropeMooves) {
    for (let step = 0; step < steps; step++) {
      mooveHead(direction, rope[0]);

      for (let i = 1; i < rope.length; i++) {
        mooveKnot(rope[i], rope[i - 1], visited);
      }
      visited.add(`${rope[ropeSize - 1].line} ${rope[ropeSize - 1].col}`);
      // printPosition(rope);
    }
  }
  // printVisited(visited);
  return visited.size;
}

const ropeMooves = getInputs("input.txt");

const ropeSize1 = 2;
const ropeSize2 = 10;
// Puzzle 1
console.log(" Puzzle 1 : ", puzzle(ropeMooves, ropeSize1));

// Puzzle 2
console.log(" Puzzle 2 : ", puzzle(ropeMooves, ropeSize2));
