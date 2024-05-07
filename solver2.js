const FastPriorityQueue = require("fastpriorityqueue");

class Node {
  constructor(state, parent = null, action = null) {
    this.state = state;
    this.parent = parent;
    this.action = action;
    this.cost = parent ? parent.cost + 1 : 0;
    this.heuristic = this.calculateHeuristic();
    this.score = this.cost + this.heuristic; // f = g + h
  }

  calculateHeuristic() {
    let h = 0;
    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[row].length; col++) {
        const value = this.state[row][col];
        if (value !== 0) {
          const targetRow = Math.floor((value - 1) / 4);
          const targetCol = (value - 1) % 4;
          h += Math.abs(row - targetRow) + Math.abs(col - targetCol);
        }
      }
    }
    return h;
  }

  generateSuccessors() {
    const directions = [
      [1, 0, "down"],
      [-1, 0, "up"],
      [0, 1, "right"],
      [0, -1, "left"],
    ];
    const successors = [];
    const zeroPosition = this.findZero();
    directions.forEach(([dx, dy, action]) => {
      const newX = zeroPosition.x + dx;
      const newY = zeroPosition.y + dy;
      if (newX >= 0 && newX < 4 && newY >= 0 && newY < 4) {
        const newState = this.state.map((row) => [...row]);
        [newState[zeroPosition.x][zeroPosition.y], newState[newX][newY]] = [
          newState[newX][newY],
          newState[zeroPosition.x][zeroPosition.y],
        ];
        successors.push(new Node(newState, this, action));
      }
    });
    return successors;
  }

  findZero() {
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (this.state[x][y] === 0) {
          return { x, y };
        }
      }
    }
    return null;
  }
}

function aStarSearch(start, goal) {
  let openSet = new FastPriorityQueue((a, b) => a.score < b.score);
  openSet.add(new Node(start));
  let closedSet = new Set();

  while (!openSet.isEmpty()) {
    const current = openSet.poll();

    if (arraysMatch(current.state, goal)) {
      return current;
    }

    closedSet.add(current.state.toString());

    const successors = current.generateSuccessors();
    successors.forEach((successor) => {
      if (!closedSet.has(successor.state.toString())) {
        openSet.add(successor);
      }
    });
  }
  return null;
}

function arraysMatch(arr1, arr2) {
  return arr1.every((row, rowIndex) =>
    row.every((value, colIndex) => value === arr2[rowIndex][colIndex])
  );
}

function printSolution(solution) {
  const path = [];
  let node = solution;
  while (node) {
    path.push(node);
    node = node.parent;
  }

  path.reverse().forEach((step) => {
    console.log(`Move: ${step.action}`);
    // step.printState();
  });
}

const start = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 0],
];

const goal = [
  [1, 5, 9, 13],
  [2, 6, 10, 14],
  [3, 7, 11, 15],
  [4, 8, 12, 0],
];

const solution = aStarSearch(start, goal);
if (solution) {
  console.log("Solution found!");
  printSolution(solution);
} else {
  console.log("No solution found.");
}
