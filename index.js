const Puzzle = require('./Puzzle');
const { exec } = require('child_process');
const puzzle_8 = new Puzzle(3);
puzzle_8.process_bfs("start.txt", "goal.txt");
exec("python plot.py bfs_tree.json");
puzzle_8.process_aStar("start.txt", "goal.txt");
exec("python plot.py aStar_tree.json");


