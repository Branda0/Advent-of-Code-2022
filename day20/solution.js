const fs = require("fs");

function getInputs(file) {
  const inputs = fs
    .readFileSync(file, "utf8")
    .split("\n")
    .map((line, index) => ({
      index,
      value: parseInt(line),
    }));

  return inputs;
}

function getInputs2(file) {
  const decryption_key = 811589153;

  const inputs = fs
    .readFileSync(file, "utf8")
    .split("\n")
    .map((line, index) => ({
      index,
      value: line * decryption_key,
    }));

  return inputs;
}
Array.prototype.move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

// PUZZLES 1&2

function mix(encrypted_lines) {
  const size = encrypted_lines.length;

  for (index = 0; index < size; index++) {
    const index_to_moove = encrypted_lines.findIndex((line) => line.index === index);

    if (encrypted_lines[index_to_moove].value < 0) {
      encrypted_lines.move(
        index_to_moove,
        (index_to_moove + encrypted_lines[index_to_moove].value) % (size - 1)
      );
    } else {
      encrypted_lines.move(
        index_to_moove,
        (index_to_moove + encrypted_lines[index_to_moove].value) % (size - 1)
      );
    }
  }
}

function puzzle1() {
  const encrypted_lines = getInputs("input.txt");

  const size = encrypted_lines.length;

  mix(encrypted_lines);

  let index_value_0 = encrypted_lines.findIndex((line) => line.value === 0);

  let res =
    encrypted_lines[(index_value_0 + 1000) % size].value +
    +encrypted_lines[(index_value_0 + 2000) % size].value +
    encrypted_lines[(index_value_0 + 3000) % size].value;

  return res;
}

function puzzle2() {
  const encrypted_lines = getInputs2("input.txt");

  const size = encrypted_lines.length;

  for (let i = 0; i < 10; i++) {
    mix(encrypted_lines);
  }

  let index_value_0 = encrypted_lines.findIndex((line) => line.value === 0);

  let res =
    encrypted_lines[(index_value_0 + 1000) % size].value +
    +encrypted_lines[(index_value_0 + 2000) % size].value +
    encrypted_lines[(index_value_0 + 3000) % size].value;

  return res;
}

console.log("Puzzle 1: " + puzzle1());
console.log("Puzzle 2: " + puzzle2());
