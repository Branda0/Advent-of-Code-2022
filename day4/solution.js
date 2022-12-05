const fs = require("fs");

function getInputs(file) {
  const assignments = fs.readFileSync(file, "utf8").split("\n");
  return assignments;
}

// Puzzle 1
function resolve1() {
  let fullyContainedPairs = 0;

  for (pairs of assignments) {
    const [assignment1, assignment2] = pairs.split(",");
    const [sectionStart1, sectionEnd1] = assignment1.split("-").map(Number);
    const [sectionStart2, sectionEnd2] = assignment2.split("-").map(Number);

    if (
      (sectionStart1 <= sectionStart2 && sectionEnd1 >= sectionEnd2) ||
      (sectionStart1 >= sectionStart2 && sectionEnd1 <= sectionEnd2)
    ) {
      fullyContainedPairs++;
    }
  }
  return fullyContainedPairs;
}

// Puzzle 2
function resolve2() {
  const assignments = getInputs("input.txt");
  let overlapping = 0;

  for (pairs of assignments) {
    const [assignment1, assignment2] = pairs.split(",");
    const [sectionStart1, sectionEnd1] = assignment1.split("-").map(Number);
    const [sectionStart2, sectionEnd2] = assignment2.split("-").map(Number);

    if (sectionStart1 <= sectionEnd2 && sectionEnd1 >= sectionStart2) {
      overlapping++;
    }
  }
  return overlapping;
}

const assignments = getInputs("input.txt");
// Puzzle 1
console.log(" Puzzle 1 : ", resolve1());

// Puzzle 2
console.log(" Puzzle 2 : ", resolve2());
