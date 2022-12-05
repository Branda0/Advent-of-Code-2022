const fs = require("fs");

function getInputs(file) {
  const [stackInputs, moveInputs] = fs.readFileSync(file, "utf8").split("\n\n");

  const moves = moveInputs.split("\n").map((line) => line.match(/\d+/g).map(Number));
  const stacksLines = stackInputs.split("\n");
  stacksLines.pop(); // remove stacks id
  stacksLines.reverse(); // reverse array to prioritize push over unshift in rest of code

  let stacks = [];
  let length = stacksLines[0].length;

  // line data : "[Z] [M] [P]"  -> only check values at pos 1 , 5 , 9 , 13 ...
  for (let charIndex = 1; charIndex < length; charIndex += 4) {
    let col = [];

    for (line in stacksLines) {
      if (stacksLines[line][charIndex] !== " ") {
        col.push(stacksLines[line][charIndex]);
      }
    }
    stacks.push(col);
  }

  return [stacks, moves];
}

// Puzzle 1
function resolve(reverse) {
  for ([quantity, from, to] of moves) {
    // from & to reindexed with -1 to match array index starting at 0
    const movedCrates = stacks[from - 1].splice(-quantity);
    if (reverse) {
      stacks[to - 1].push(...movedCrates.reverse()); //crane modal 9000
    } else {
      stacks[to - 1].push(...movedCrates); //crane model 9001
    }
  }
  return stacks.map((stack) => stack.slice(-1)).join("");
}

// Puzzle 1
let [stacks, moves] = getInputs("input.txt");
let reverse = true;

console.log(" Puzzle 1 : ", resolve(reverse));

// Puzzle 2
[stacks, moves] = getInputs("input.txt");

console.log(" Puzzle 2 : ", resolve());
