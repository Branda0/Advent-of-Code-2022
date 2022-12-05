const fs = require("fs");

function getInputs(file) {
  const [stackInputs, moveInputs] = fs
    .readFileSync(file, "utf8")
    .split("\n\n")
    .map((elt) => elt.split("\n"));

  const moves = moveInputs.map((line) => line.match(/\d+/g).map(Number));
  //

  const parsedStacks = stackInputs.map((line) => [...line].filter((line, index) => index % 4 === 1));
  parsedStacks.pop(); // remove stacks id
  parsedStacks.reverse(); // reverse array to prioritize push over unshift in rest of code

  let stacks = [];

  for (line of parsedStacks) {
    for ([index, crate] of line.entries()) {
      if (crate !== " ") {
        if (!stacks[index]) stacks[index] = []; //initialize empty array if not yet accessible
        stacks[index].push(crate);
      }
    }
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
