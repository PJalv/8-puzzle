# 8-Puzzle

This project implements a solver for the 8-puzzle problem using both the Breadth-First Search (BFS) and A* algorithms. The solver finds the optimal solution to transform a given initial state of the 8-puzzle into a specified goal state. The project includes visualization of the search tree using Python.

## Getting Started

To get started with this project, clone the repository and install the required dependencies.

```bash
git clone https://github.com/PJalv/8-puzzle.git
cd 8-puzzle
pip3 install requirements.txt
```

## Usage
### Input Files
Place your initial state and goal state puzzle configurations in separate text files (e.g., start.txt and goal.txt). Each file should contain a 3x3 grid of numbers representing the puzzle configuration, with the blank space represented as an underscore "_".

### Example start.txt
```
7 2 _
4 6 5
1 8 3
```

### Example goal.txt
```
1 2 3
4 5 6
7 8 _
```

Finally run the solver
```
node index.js
```

