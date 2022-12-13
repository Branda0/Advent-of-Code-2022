const fs = require("fs");

function getInputs1(file) {
  const groups = fs
    .readFileSync(file, "utf8")
    .split("\n\n")
    .map((group) => {
      const [left, right] = group.split("\n").map((line) => JSON.parse(line));
      return { left, right };
    });

  return groups;
}

function getInputs2(file) {
  const packets = fs
    .readFileSync(file, "utf8")
    .split("\n\n")
    .map((group) => group.split("\n"))
    .flat(1)
    .map((packet) => JSON.parse(packet));
  return packets;
}

function checkOrder(left, right) {
  let leftIsNumber = typeof left === "number";
  let rightIsNumber = typeof right === "number";

  // CASE, LEFT and RIGHT are not of same type, number vs list => convert number part to list
  if (leftIsNumber && !rightIsNumber) {
    return checkOrder([left], right);
  } else if (!leftIsNumber && rightIsNumber) {
    return checkOrder(left, [right]);
  }

  // BASE CASE, LEFT AND RIGHT ARE NUMBERS
  if (leftIsNumber && rightIsNumber) {
    // console.log({ left, right });
    if (left < right) return 1;

    if (left === right) return 0;

    return -1;
  }

  // CASE LEFT AND RIGHT ARE LISTS
  if (!leftIsNumber && !rightIsNumber) {
    let index = 0;

    // LOOP over list elements
    while (index < left.length && index < right.length) {
      // COMPARE elements at given index
      const res = checkOrder(left[index], right[index]);

      // comparaison is done beetween numbers, 1 and -1 are ending condition(ordered or not), 0 means values are equal, if so we skip to next list comparaison at index+1
      if (res === 1 || res === -1) {
        return res;
      }

      //increment index for next pair of list items check
      index++;
    }

    // END CONDITION, LEFT or RIGHT List is completely visited
    if (index === left.length) {
      if (left.length === right.length) return 0;
      return 1;
    }
    return -1;
  }
}

function puzzle1() {
  groups = getInputs1("sample.txt");

  let orderedPacketIndexes = [];

  for (const [index, packet] of groups.entries()) {
    const res = checkOrder(packet.left, packet.right);
    if (res === 1) orderedPacketIndexes.push(index + 1);
  }

  return orderedPacketIndexes.length ? orderedPacketIndexes.reduce((sum, next) => sum + next) : 0;
}

function puzzle2() {
  packets = getInputs2("input.txt");

  const dividerPackets = [[[2]], [[6]]];
  packets.push(dividerPackets[0]);
  packets.push(dividerPackets[1]);

  const sortedPackets = packets.sort((a, b) => checkOrder(b, a));

  const decoderIndexes = sortedPackets.reduce((acc, packet, index) => {
    if (packet === dividerPackets[0] || packet === dividerPackets[1]) acc.push(index + 1);
    return acc;
  });

  return decoderIndexes.reduce((a, b) => a * b);
}

// Puzzle 1
console.log(" Puzzle 1 : ", puzzle1());

// Puzzle 2
console.log(" Puzzle 2 : ", puzzle2());
