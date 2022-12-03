const fs = require("fs");

function getInputs(file) {
  const rucksacks = fs.readFileSync(file, "utf8").split("\n");
  return rucksacks;
}

// Lowercase item types a through z have priorities 1 through 26. unicode a = 97 --> unicode(a) - 96 = 1
// Uppercase item types A through Z have priorities 27 through 52. unicode A = 65 --> unicode(A) - 38 = 27
function mapItemToValue(char) {
  if (char === char.toUpperCase()) {
    return char.charCodeAt(0) - 38;
  } else {
    return char.charCodeAt(0) - 96;
  }
}

// Puzzle 1
function resolve1() {
  const errorItems = [];
  const rucksacks = getInputs("input.txt");

  for (rucksack of rucksacks) {
    const rucksackSize = rucksack.length;

    // pockets 1 & 2 of same size
    const pocket1 = rucksack.slice(0, rucksackSize / 2);
    const pocket2 = rucksack.slice(rucksackSize / 2);

    // if value from first pocket is found in second pocket, break loop
    for (item of pocket1) {
      if (pocket2.indexOf(item) != -1) {
        errorItems.push(item);
        break;
      }
    }
  }

  return errorItems.map((item) => mapItemToValue(item)).reduce((sum, nextItem) => sum + nextItem, 0);
}

// Puzzle 2
function resolve2() {
  const badges = [];
  const rucksacks = getInputs("input.txt");

  for (let i = 0; i < rucksacks.length; i += 3) {
    rucksacksGroup = rucksacks.slice(i, i + 3);

    for (item of rucksacksGroup[0]) {
      if (rucksacksGroup[1].indexOf(item) != -1 && rucksacksGroup[2].indexOf(item) != -1) {
        badges.push(item);
        break;
      }
    }
  }
  return badges.map((item) => mapItemToValue(item)).reduce((sum, nextItem) => sum + nextItem, 0);
}

// Puzzle 1
console.log(" Puzzle 1 : ", resolve1());

// Puzzle 2
console.log(" Puzzle 1 : ", resolve2());
