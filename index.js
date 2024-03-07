const Puzzle = require('./Puzzle');
const { exec } = require('child_process');
const puz = new Puzzle(3);
puz.process_bfs("start.txt", "goal.txt");
exec("python plot.py");
// puz.process_aStar("start.txt", "goal.txt");
// exec("python plot.py");


