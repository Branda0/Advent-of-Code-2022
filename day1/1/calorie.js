const fs = require("fs");

function getCaloriesData() {
  const caloriesRawData = fs.readFileSync("input.txt", "utf8");

  const test = caloriesRawData.split("\n\n");

  return test.map((string) => string.split("\n"));
}

function resolve(data) {
  let result = 0;
  for (let i = 0; i < data.length; i++) {
    let temp = 0;
    for (let j = 0; j < data[i].length; j++) {
      temp += +data[i][j];
    }
    if (temp > result) result = temp;
    console.log("temp : ", temp, " result : ", result);
  }
  return result;
}

const caloriesData = getCaloriesData();

console.log(resolve(caloriesData));
