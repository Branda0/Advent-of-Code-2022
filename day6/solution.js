const fs = require("fs");

function getInputs(file) {
  return fs.readFileSync(file, "utf8");
}

function resolve(nbOfChars) {
  let startIndex = 0;

  // loop over streamBuffer, we want "nbOfChars" unique chars ,
  // Each time we find a duplicate, moove our window buffer starting after the duplicate index
  for (let i = 1; i < startIndex + nbOfChars; i++) {
    let duplicateIndex = stream.slice(startIndex, i + 1).indexOf(stream[i + 1]);
    if (duplicateIndex !== -1) {
      startIndex += duplicateIndex + 1;
    }
  }
  return startIndex + nbOfChars;
}

let stream = getInputs("input.txt");

// Puzzle 1
console.log(" Puzzle 1 : ", resolve(4));

// Puzzle 2
console.log(" Puzzle 2 : ", resolve(14));
