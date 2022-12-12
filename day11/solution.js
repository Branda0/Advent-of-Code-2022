const fs = require("fs");

function getInputs(file) {
  const inputs = fs
    .readFileSync(file, "utf8")
    .split("\n\n")
    .map((monkey) => monkey.split("\n"))
    .map((lines) => lines.map((line) => line.trim()).splice(1));

  return inputs;
}

function createMonkey(monkeyInfo, monkeys) {
  const items = monkeyInfo[0].match(/\d+/g).map(Number);
  const divisible = monkeyInfo[2].match(/\d+/g).map(Number)[0];
  const operation = (old) => eval(monkeyInfo[1].split("=")[1].trim());
  const test = {
    true: monkeyInfo[3].match(/\d+/g).map(Number)[0],
    false: monkeyInfo[4].match(/\d+/g).map(Number)[0],
  };

  const monkey = new Monkey(items, operation, divisible, test);
  monkeys.push(monkey);
}

class Monkey {
  constructor(items, operation, divisible, test) {
    this.items = items;
    this.operation = operation;
    this.divisible = divisible;
    this.test = test;
    this.nbrOfInspections = 0;
  }

  addItem(item) {
    this.items.push(item);
  }

  removeItems() {
    this.items = [];
  }
}

function puzzle(monkeyInputs, rounds, worryLvlDiviser) {
  let monkeys = [];

  for (const monkeyInfo of monkeyInputs) {
    createMonkey(monkeyInfo, monkeys);
  }

  for (let i = 0; i < rounds; i++) {
    let modulo = 1;
    for (let monkey of monkeys) {
      modulo *= monkey.divisible;
    }

    for (monkey of monkeys) {
      for (item of monkey.items) {
        let worryLvl = Math.floor(monkey.operation(item) / worryLvlDiviser);

        worryLvl %= modulo;

        if (worryLvl % monkey.divisible === 0) {
          monkeys[monkey.test.true].addItem(worryLvl);
        } else {
          monkeys[monkey.test.false].addItem(worryLvl);
        }
        monkey.nbrOfInspections++;
      }
      monkey.removeItems();
    }
  }
  const inspectedCount = monkeys.map((monkey) => monkey.nbrOfInspections);

  // console.log(monkeys);

  // console.log(monkeysInput);
  return inspectedCount
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((a, b) => a * b);
}

const monkeysInput = getInputs("input.txt");

// Puzzle 1
const nbrRounds1 = 20;
const worryLvlDiviser1 = 3;
console.log(" Puzzle 1 : ", puzzle(monkeysInput, nbrRounds1, worryLvlDiviser1));

// Puzzle 2
const nbrRounds2 = 10000;
const worryLvlDiviser2 = 1;
console.log(" Puzzle 2 : ", puzzle(monkeysInput, nbrRounds2, worryLvlDiviser2));
