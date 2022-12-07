const fs = require("fs");

function getInputs(file) {
  const inputs = fs
    .readFileSync(file, "utf8")
    .split("\n")
    .map((line) => line.split(" "));
  return inputs;
}

class FileSystem {
  constructor(path) {
    this.Folder = new Map();
    this.path = path;
  }

  getFolder(path) {
    // Base case, we are in top root directory
    if (!path) return;

    if (path.length === 1) {
      return this;
    }

    let folder = this.Folder.get(path[1]);

    return folder.getFolder(path.slice(1));
  }

  getSize() {
    console.log("IN GETSIZE");
    let size = 0;
    for (const elt of this.Folder) {
      // console.log("ELEMENT ", elt);
      if (!isNaN(elt[0])) {
        size += +elt[0];
      } else {
        elt[1].getSize();
      }
    }
    console.log(this.path, "->", size);
    return size;
  }

  addFolder(name) {
    this.Folder.set(name, new FileSystem(name));
    console.log("added ", name);
  }

  addFile(name, size) {
    this.Folder.set(name, size);
  }
}

// Puzzle 1
function resolve1(commands) {
  let filesystem = new FileSystem("/");

  console.log({ commands });

  let folders = [];

  let currentPath = [];

  for (line of commands) {
    if (line[0] === "$") {
      if (line[1] === "cd") {
        if (line[2] === "..") {
          currentPath.pop();
        } else {
          currentPath.push(line[2]);
          // folders.set(currentPath.slice(-1)[0], getFolder(currentPath.slice(-1)[0]));
        }
      }
    } else if (line[0] === "dir") {
      filesystem.getFolder(currentPath).addFolder(line[1]);
      folders.push();
      console.log("Current folder added ", filesystem.getFolder(currentPath));
    } else if (!isNaN(line[0])) {
      filesystem.getFolder(currentPath).addFile(line[0], line[1]);
      console.log("Current file added ", filesystem.getFolder(currentPath));
    }
  }

  console.log(filesystem.getSize());

  let currentFolder = "";
}

// Puzzle 2
function resolve2() {
  return overlapping;
}

const input = getInputs("sample.txt");
// Puzzle 1
console.log(" Puzzle 1 : ", resolve1(input));

// Puzzle 2
// console.log(" Puzzle 2 : ", resolve2(input));
