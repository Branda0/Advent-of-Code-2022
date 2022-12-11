const fs = require("fs");

function getInputs(file) {
  const inputs = fs
    .readFileSync(file, "utf8")
    .split("\n")
    .map((line) => line.split(" "))
    .map((line) => [line[0], Number(line[1])]);

  return inputs;
}

function checkSignal(cycle, X, signals, pixels) {
  if ((cycle % 40) - 20 === 0 && cycle <= 220) {
    signals.push(cycle * X);
  }

  let pixelPosition = pixels.length - 40 * Math.floor((cycle - 1) / 40);

  if (pixelPosition === X || pixelPosition === X + 1 || pixelPosition === X - 1) {
    pixels.push("#");
  } else {
    pixels.push(".");
  }
}
function puzzle() {
  let X = 1;
  let cycle = 0;
  let signals = [];
  let pixels = [];

  for (const [_, increment] of program) {
    if (increment) {
      for (let i = 0; i < 2; i++) {
        cycle++;
        checkSignal(cycle, X, signals, pixels);
      }
      X += increment;
    } else {
      cycle++;
      checkSignal(cycle, X, signals, pixels);
    }
  }
  //format pixels signal for a CRT screen of size 40x6
  let CRT = [];

  for (let i = 0; i < 6; i++) {
    let screenLine = pixels.slice(40 * i, 40 * (i + 1)).join("");
    CRT.push(screenLine);
  }
  //
  // printVisited(visited);
  return [signals.reduce((sum, nextValue) => sum + nextValue), CRT];
}

const program = getInputs("input.txt");

const [puzzle1, puzzle2] = puzzle();
// Puzzle 1
console.log(" Puzzle 1 : ", puzzle1);

// Puzzle 2
console.log(" Puzzle 2 : ", puzzle2);
