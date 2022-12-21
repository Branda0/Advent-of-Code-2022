const fs = require("fs");

var nerdamer = require("nerdamer");
require("nerdamer/Solve");

function getInputs(file) {
  let yeller = new Map();
  let calculator = new Map();

  fs.readFileSync(file, "utf8")
    .split("\n")
    .map((line) => line.split(" "))
    .map((line) => {
      if (line.length === 2) {
        yeller.set(line[0].slice(0, -1), parseInt(line[1]));
      } else {
        if (line[2] === "*") {
          calculator.set(line[0].slice(0, -1), { a: line[1], b: line[3], func: (a, b) => a * b });
        } else if (line[2] === "+") {
          calculator.set(line[0].slice(0, -1), { a: line[1], b: line[3], func: (a, b) => a + b });
        } else if (line[2] === "/") {
          calculator.set(line[0].slice(0, -1), { a: line[1], b: line[3], func: (a, b) => a / b });
        } else if (line[2] === "-") {
          calculator.set(line[0].slice(0, -1), { a: line[1], b: line[3], func: (a, b) => a - b });
        }
      }
    });

  return [yeller, calculator];
}

function getInputs2(file) {
  let monkeys = new Map();

  fs.readFileSync(file, "utf8")
    .split("\n")
    .map((line) => line.split(" "))
    .map((line) => {
      if (line.length === 2) {
        if (line[0].slice(0, -1) === "humn") {
          monkeys.set(line[0].slice(0, -1), "humn");
        } else {
          monkeys.set(line[0].slice(0, -1), parseInt(line[1]));
        }
      } else {
        monkeys.set(line[0].slice(0, -1), { left: line[1], right: line[3], operation: line[2] });
      }
    });

  return monkeys;
}

function puzzle1() {
  const [yeller, calculator] = getInputs("input.txt");

  const monkeys_number = yeller.size + calculator.size;

  while (yeller.size !== monkeys_number) {
    for (const [monkey, values] of calculator) {
      if (yeller.has(values.a) && yeller.has(values.b))
        yeller.set(monkey, values.func(yeller.get(values.a), yeller.get(values.b)));
    }
  }

  return yeller.get("root");
}

function getExpression(monkey_name, monkeys) {
  let monkey = monkeys.get(monkey_name);

  //we get interger or variable "humn"
  if (typeof monkey === "number") {
    return monkey;
  } else if (monkey_name === "humn") {
    return monkey_name;
  }

  return `(${getExpression(monkeys.get(monkey_name).left, monkeys)} ${monkey.operation} ${getExpression(
    monkeys.get(monkey_name).right,
    monkeys
  )})`;
}

function puzzle2() {
  const monkeys = getInputs2("input.txt");

  // let x = new Expression("humn", 4);

  let result = nerdamer.solve(
    `${getExpression(monkeys.get("root").left, monkeys)} = ${getExpression(
      monkeys.get("root").right,
      monkeys
    )}`,
    "humn"
  );

  return result.text();
}

// console.log("Puzzle 1: " + puzzle1());
console.log("Puzzle 2: " + puzzle2());
