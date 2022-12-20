const fs = require("fs");

function getInputs(file) {
  let boundaries = {
    x: { min: Infinity, max: -Infinity },
    y: { min: Infinity, max: -Infinity },
    z: { min: Infinity, max: -Infinity },
  };

  const inputs = fs
    .readFileSync(file, "utf8")
    .split("\n")
    .map((line) => {
      const [x, y, z] = line.split(",").map(Number);
      if (x > boundaries.x.max) boundaries.x.max = x;
      if (x < boundaries.x.min) boundaries.x.min = x;
      if (y > boundaries.y.max) boundaries.y.max = y;
      if (y < boundaries.y.min) boundaries.y.min = y;
      if (z > boundaries.z.max) boundaries.z.max = z;
      if (z < boundaries.z.min) boundaries.z.min = z;

      return { x, y, z };
    });
  return [inputs, boundaries];
}

function hash(a, b, c) {
  return a * 10000 + b * 100 + c;
}

function getExposedFaces(drops, map) {
  let covered_faces = 0;

  for (const drop of drops) {
    //check X axis
    if (map.has(hash(drop.x + 1, drop.y, drop.z))) covered_faces++;
    if (map.has(hash(drop.x - 1, drop.y, drop.z))) covered_faces++;

    //check Y axis
    if (map.has(hash(drop.x, drop.y + 1, drop.z))) covered_faces++;
    if (map.has(hash(drop.x, drop.y - 1, drop.z))) covered_faces++;

    //check Z axis
    if (map.has(hash(drop.x, drop.y, drop.z + 1))) covered_faces++;
    if (map.has(hash(drop.x, drop.y, drop.z - 1))) covered_faces++;
  }

  return map.size * 6 - covered_faces;
}

function getBlockNeighbors(block, air, lava, boundaries) {
  let neighbors = [];
  let exposed_faces = 0;

  //+dX
  if (block.x + 1 <= boundaries.x.max + 1) {
    if (!air.has(hash(block.x + 1, block.y, block.z))) {
      if (lava.has(hash(block.x + 1, block.y, block.z))) {
        exposed_faces++;
      } else {
        neighbors.push({ x: block.x + 1, y: block.y, z: block.z });
      }
    }
  }

  //-dX
  if (block.x - 1 >= boundaries.x.min - 1) {
    if (!air.has(hash(block.x - 1, block.y, block.z))) {
      if (lava.has(hash(block.x - 1, block.y, block.z))) {
        exposed_faces++;
      } else {
        neighbors.push({ x: block.x - 1, y: block.y, z: block.z });
      }
    }
  }

  //+dY
  if (block.y + 1 <= boundaries.y.max + 1) {
    if (!air.has(hash(block.x, block.y + 1, block.z))) {
      if (lava.has(hash(block.x, block.y + 1, block.z))) {
        exposed_faces++;
      } else {
        neighbors.push({ x: block.x, y: block.y + 1, z: block.z });
      }
    }
  }

  //-dY
  if (block.y - 1 >= boundaries.y.min - 1) {
    if (!air.has(hash(block.x, block.y - 1, block.z))) {
      if (lava.has(hash(block.x, block.y - 1, block.z))) {
        exposed_faces++;
      } else {
        neighbors.push({ x: block.x, y: block.y - 1, z: block.z });
      }
    }
  }

  //+dZ
  if (block.z + 1 <= boundaries.z.max + 1) {
    if (!air.has(hash(block.x, block.y, block.z + 1))) {
      if (lava.has(hash(block.x, block.y, block.z + 1))) {
        exposed_faces++;
      } else {
        neighbors.push({ x: block.x, y: block.y, z: block.z + 1 });
      }
    }
  }

  //-dZ
  if (block.z - 1 >= boundaries.z.min - 1) {
    if (!air.has(hash(block.x, block.y, block.z - 1))) {
      if (lava.has(hash(block.x, block.y, block.z - 1))) {
        exposed_faces++;
      } else {
        neighbors.push({ x: block.x, y: block.y, z: block.z - 1 });
      }
    }
  }

  return [neighbors, exposed_faces];
}

function getExposedToAirFaces(lava_map, boundaries) {
  let queue = [];
  let exposed_faces = 0;
  let air = new Set();
  let start = { x: boundaries.x.min, y: boundaries.y.min, z: boundaries.z.min };

  air.add(`${start.x} ${start.y} ${start.z}`);
  queue.push(start);

  while (queue.length) {
    const block = queue.shift();
    const [neighbors, exposed_neighbors] = getBlockNeighbors(block, air, lava_map, boundaries);

    exposed_faces += exposed_neighbors;

    for (const neighbor of neighbors) {
      air.add(hash(neighbor.x, neighbor.y, neighbor.z));
      queue.push(neighbor);
    }
  }

  return exposed_faces;
}

// PUZZLES 1&2
const [lava_drops, boundaries] = getInputs("input.txt");

let lava_map = new Set();

// fill map
for (const drop of lava_drops) {
  lava_map.add(hash(drop.x, drop.y, drop.z));
}

const exposed_faces = getExposedFaces(lava_drops, lava_map);
const exposed_to_air = getExposedToAirFaces(lava_map, boundaries);

console.log(`Puzzle 1, ${exposed_faces} exposed lava cube faces`);
console.log(`Puzzle 2, ${exposed_to_air} exposed lava cube faces`);
