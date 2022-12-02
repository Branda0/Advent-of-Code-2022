const fs = require("fs");

function getRoundsInputs() {
  const caloriesRawData = fs.readFileSync("input.txt", "utf8");
  const game = caloriesRawData.split("\n");
  return game.map((round) => round.split(" "));
}

//  OPPONENT INPUT     A : ROCK  |  B : PAPER   |   C : SCISSORS
//  OUR INPUT rule 1   X : ROCK  |  Y : PAPER   |   Z : SCISSORS
//  OUR INPUT rule 2   X : LOSE  |  Y : DRAW    |   Z : WIN

// 9 cases A-X A-Y A-Z B-X ....

// B Y -> DRAW
// A Z -> WIN

const casesRule2 = {
  A: {
    X: 3,
    Y: 4,
    Z: 8,
  },
  B: {
    X: 1,
    Y: 5,
    Z: 9,
  },
  C: {
    X: 2,
    Y: 6,
    Z: 7,
  },
};

const casesRule1 = {
  A: {
    X: 4,
    Y: 8,
    Z: 3,
  },
  B: {
    X: 1,
    Y: 5,
    Z: 9,
  },
  C: {
    X: 7,
    Y: 2,
    Z: 6,
  },
};

const rounds = getRoundsInputs();

function resolve(rule) {
  let totalPoints = 0;

  rounds.forEach((element) => {
    totalPoints += rule[element[0]][element[1]];
  });

  return totalPoints;
}

// puzzle 1
console.log("puzzle 1 ", resolve(casesRule1));

// puzzle 2
console.log("puzzle 2 ", resolve(casesRule2));
