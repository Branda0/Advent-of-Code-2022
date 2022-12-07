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

    return this.Folder.get(path[1]).getFolder(path.slice(1));
  }

  getSize() {
    let size = 0;
    for (const elt of this.Folder) {
      // console.log("ELEMENT ", elt);
      if (!isNaN(elt[0])) {
        size += +elt[0];
      } else {
        size += +elt[1].getSize();
      }
    }
    // console.log(this.path, " ---> ", size);
    return size;
  }

  addFolder(name) {
    this.Folder.set(name, new FileSystem(name));
  }

  addFile(name, size) {
    this.Folder.set(name, size);
  }
}

function createFileSystem(commands) {
  let filesystem = new FileSystem("/");
  let folders = [];
  let currentPath = [];

  // Create FileSystem tree
  for (line of commands) {
    if (line[0] === "$") {
      if (line[1] === "cd") {
        if (line[2] === "..") {
          currentPath.pop();
        } else {
          currentPath.push(line[2]);

          // add new visited folder to array for final all folder size compute
          folders.push(filesystem.getFolder(currentPath));
        }
      }
    } else if (line[0] === "dir") {
      filesystem.getFolder(currentPath).addFolder(line[1]);
    } else if (!isNaN(line[0])) {
      filesystem.getFolder(currentPath).addFile(line[0], line[1]);
    }
  }
  return [folders, filesystem];
}

// PUZZLE 1
function resolve1() {
  // filter visited folder by size <= 100000 and compute the total sum of those directories
  let sum = 0;
  for (folder of folders) {
    const size = folder.getSize();
    if (size <= 100000) {
      sum += size;
    }
  }

  return sum;
}

// PUZZLE 2
function resolve2() {
  const totalDiskSpace = 70000000;
  const requiredDiskSPace = 30000000;

  const actualDiskSize = filesystem.getSize();
  const availablespace = totalDiskSpace - actualDiskSize;
  const spaceNeeded = requiredDiskSPace - availablespace;

  // find smallest directory which is big enough to get enought available space if deleted
  const result = folders
    .map((folder) => folder.getSize())
    .sort((a, b) => a - b)
    .find((sum) => sum > spaceNeeded);

  return result;
}

//parse inputs
const input = getInputs("input.txt");
const [folders, filesystem] = createFileSystem(input);

// Puzzle 1
console.log(" Puzzle 1 : ", resolve1());

// Puzzle 2
console.log(" Puzzle 2 : ", resolve2());
