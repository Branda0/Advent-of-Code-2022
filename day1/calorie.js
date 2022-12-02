const fs = require("fs");

function getCaloriesData() {
  const caloriesRawData = fs.readFileSync("input.txt", "utf8");

  const test = caloriesRawData.split("\n\n");

  return test.map((string) => string.split("\n"));
}

function resolve(n) {
  let result = [];
  const data = getCaloriesData();

  for (let i = 0; i < data.length; i++) {
    let temp = 0;
    for (let j = 0; j < data[i].length; j++) {
      temp += +data[i][j];
    }
    result.push(temp);
  }
  result.sort((a, b) => a - b);

  return result.slice(-n).reduce((a, b) => a + b);
}

// Puzzle 1
console.log(resolve(1));

// Puzzle 2
console.log(resolve(3));
