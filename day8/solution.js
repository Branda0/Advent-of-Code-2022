const fs = require("fs");

function getInputs(file) {
  const inputs = fs
    .readFileSync(file, "utf8")
    .split("\n")
    .map((line) => line.split(""));
  // .map((tree) => tree.parseInt());
  return inputs;
}

function reduceGrid(treeGrid) {
  treeGrid.pop();
  treeGrid.shift();

  treeGrid.map((tree) => {
    tree.shift();
    tree.pop();
  });
}

function scanTree(tree, treeGrid) {
  let isVisible = { top: true, right: true, bottom: true, left: true };
  let scores = { top: 0, right: 0, bottom: 0, left: 0 };
  let treeSize = treeGrid[tree.line][tree.col];

  //check TOP
  for (let line = tree.line - 1; line >= 0; line--) {
    scores.top += 1;

    if (treeGrid[line][tree.col] >= treeSize) {
      isVisible.top = false;
      break;
    }
  }
  //check BOTTOM
  for (let line = tree.line + 1; line < treeGrid.length; line++) {
    scores.bottom += 1;

    if (treeGrid[line][tree.col] >= treeSize) {
      isVisible.bottom = false;
      break;
    }
  }
  //check LEFT
  for (let col = tree.col - 1; col >= 0; col--) {
    scores.left += 1;

    if (treeGrid[tree.line][col] >= treeSize) {
      isVisible.left = false;
      break;
    }
  }
  //check RIGHT
  for (let col = tree.col + 1; col < treeGrid[tree.line].length; col++) {
    scores.right += 1;

    if (treeGrid[tree.line][col] >= treeSize) {
      isVisible.right = false;
      break;
    }
  }

  return [
    isVisible.top || isVisible.bottom || isVisible.right || isVisible.left,
    scores.bottom * scores.left * scores.top * scores.right,
  ];
}

// Puzzle 1
function resolve(treeGrid) {
  //all external trees are visibles and grid is a square so nbr of edge trees = 4*(n-1) with a grid of size n*n
  let visibleTrees = 4 * (treeGrid.length - 1);
  let highestScore = 0;

  // visit all internal trees and :
  //         puzzle 1 - check if they are visible from exterior (ie at least one tree on top,right,bottom or left is smaller)
  //         puzzle 2 - compute the scenic score (then return the highest scofre found)
  for (let line = 1; line < treeGrid.length - 1; line++) {
    for (let col = 1; col < treeGrid[line].length - 1; col++) {
      const [isVisible, treeScore] = scanTree({ col: col, line: line }, treeGrid);
      if (isVisible) visibleTrees += 1;
      if (treeScore > highestScore) highestScore = treeScore;
    }
  }
  return [visibleTrees, highestScore];
}

// return result;

const grid = getInputs("input.txt");

const [puzzle1, puzzle2] = resolve(grid);
// Puzzle 1
console.log(" Puzzle 1 : ", puzzle1);

// Puzzle 2
console.log(" Puzzle 2 : ", puzzle2);
