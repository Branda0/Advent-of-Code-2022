const fs = require("fs");

function getInputs(file) {
  const regex =
    /Valve (?<valve>[A-Z]{2}) has flow rate=(?<flow>\d+); tunnels? leads? to valves? (?<adjacents>.*)$/;
  // /Sensor at x=(?<sensor_x>-?\d+), y=(?<sensor_y>-?\d+): closest beacon is at x=(?<beacon_x>-?\d+), y=(?<beacon_y>-?\d+)/;

  const inputs = fs
    .readFileSync(file, "utf8")
    .split("\n")
    .map((line) => {
      const match = line.match(regex).groups;
      return {
        name: match.valve,
        flow: parseInt(match.flow),
        adjacents: match.adjacents.split(", "),
      };
    });

  return inputs;
}

function computePressures(current_valve, minutes, next_valves, valves_distances, pressure, path, res) {
  // opening valve -1 minutes

  if (next_valves.length === 0 || minutes <= 2) {
    res.push([pressure, path, minutes]);
    return;
  }

  for (const valve of next_valves) {
    let next_path = `${path} / ${valve.name}`;
    let remaining_minutes = minutes - valves_distances.get(current_valve.name).get(valve.name) - 1;
    let released_pressure = pressure + Math.max(0, remaining_minutes) * valve.flow;

    const valves = next_valves.filter((next_valve) => next_valve.name !== valve.name);

    computePressures(valve, remaining_minutes, valves, valves_distances, released_pressure, next_path, res);
  }

  // console.log(actual_pressure_released);
}

// BFS TO GET SHORTEST DISTANCE BETWEEN TWO VALVES
function getShortestPath(start_valve, end_valve, valves_data) {
  let start = { valve: start_valve, distance: 0 };

  let visited = new Set();

  let queue = [];
  queue.push(start);
  visited.add(start.valve.name);

  while (queue.length) {
    let actual = queue.shift();

    neighbors = valves_data.filter(
      (valve) => !visited.has(valve.name) && actual.valve.adjacents.includes(valve.name)
    );

    for (neighbor of neighbors) {
      if (neighbor.name === end_valve.name) {
        return actual.distance + 1;
      }
      queue.push({ valve: neighbor, distance: actual.distance + 1 });
      visited.add(neighbor.name);
    }
  }
}

function puzzle1() {
  const valves_data = getInputs("input.txt");

  // GET relelvant valves ie valve with flow > 0
  let relevant_valves = [];
  let starting_valve;
  for (const valve of valves_data) {
    if (valve.flow > 0) relevant_valves.push(valve);
    if (valve.name === "AA") starting_valve = valve;
  }

  // FOR ALL RELEVANT VALVES + STARTING VALVE, compute distance to get to each relevant valves
  //  actual algo can be ameliored, when setting a -> e, set e-> a, then check hash map when creating other distance path map
  let valves_distances = new Map();
  valves_distances.set(starting_valve.name, new Map());

  for (const relevant_valve of relevant_valves) {
    valves_distances.set(relevant_valve.name, new Map());
    valves_distances
      .get(starting_valve.name)
      .set(relevant_valve.name, getShortestPath(starting_valve, relevant_valve, valves_data));
    for (valve of relevant_valves.filter((valve) => valve.name !== relevant_valve.name)) {
      valves_distances
        .get(relevant_valve.name)
        .set(valve.name, getShortestPath(relevant_valve, valve, valves_data));
    }
  }

  const minutes = 30;
  const released_pressure = 0;
  let path = starting_valve.name;
  let result = [];

  computePressures(
    starting_valve,
    minutes,
    relevant_valves,
    valves_distances,
    released_pressure,
    path,
    result
  );

  return result.sort((a, b) => b[0] - a[0])[0];
}

// Puzzle 1
console.log(" Puzzle 1 : ", puzzle1());

// Puzzle 2
// console.log(" Puzzle 2 : ", puzzle2());
