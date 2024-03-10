const TreeNode = require('./TreeNode');

const readline = require('readline');
const fs = require('fs');



class Puzzle {
    constructor(size) {
        this.n = size;
        this.open = [];
        this.closed = [];
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    accept(filePath) {
        const puz = [];
        const rl = readline.createInterface({
            input: fs.createReadStream(filePath),
            output: process.stdout,
            terminal: false
        });

        return new Promise((resolve, reject) => {
            rl.on('line', line => {
                const temp = line.split(" ");
                puz.push(temp);
                if (puz.length === this.n) {
                    rl.close();
                    resolve(puz);
                }
            });

            rl.on('close', () => {
                resolve(puz);
            });
        });
    }

    f(start, goal) {
        return this.manhattan(start.data, goal.data) + start.level;
    }

    hamming(start, goal) {
        let temp = 0;
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < this.n; j++) {
                if (start[i][j] !== goal[i][j] && start[i][j] !== '_') {
                    temp += 1;
                }
            }
        }
        return temp;
    }


    manhattan(start, goal) {
        let temp = 0;
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < this.n; j++) {
                if (start[i][j] !== '_') {
                    const goalPos = this.findPosition(goal, start[i][j]);
                    temp += Math.abs(i - goalPos.row) + Math.abs(j - goalPos.col);
                }
            }
        }
        return temp;
    }

    findPosition(matrix, value) {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] === value) {
                    return { row: i, col: j };
                }
            }
        }
        return null;
    }

    async process_bfs(startFilePath, goalFilePath) {
        let start = await this.accept(startFilePath);
        let goal = await this.accept(goalFilePath);
        this.rl.close();
        start = new TreeNode(start, 0, 0, null);
        goal = new TreeNode(goal, 0, 0, null);
        const queue = [start];
        const visited = new Set();
        visited.add(start.data.toString());

        bfs_loop: while (queue.length > 0) {
            const curNode = queue.shift();
            const children = curNode.generateChild();

            for (const child of children) {
                if (!visited.has(child.data.toString())) {
                    visited.add(child.data.toString());
                    if (visited.has(goal.data.toString())) {
                        curNode.addChild(child);
                        break bfs_loop;
                    }
                    curNode.addChild(child);
                    queue.push(child);
                }
            }
        }

        const treeJson = start.toJson();
        fs.writeFileSync('bfs_tree.json', JSON.stringify(treeJson, null, 2));

    }

    getPath(node) {
        const path = [];
        while (node) {
            path.unshift(node.data);
            node = node.parent;
        }
        return path;
    }

    async process_aStar(startFilePath, goalFilePath) {
        let start = await this.accept(startFilePath);
        let goal = await this.accept(goalFilePath);
        this.rl.close();

        let path_arr;
        start = new TreeNode(start, 0, 0, null);
        goal = new TreeNode(goal, 0, 0, null);
        start.fval = this.f(start, goal);
        const visited = new Set();
        visited.add(start.data.toString());
        // console.log("F value of starting position: ", start.fval);

        this.open.push(start);

        let moves = 0;
        let curNode;
        while (this.open.length > 0) {
            curNode = this.open.shift(); // A*: Select node with lowest fval
            this.open = [];
            // console.log("F val of current node: ", curNode.fval)
            for (const i of curNode.data) {
                console.log(i.join(' '));
            }
            console.log("\n");
            if (this.manhattan(curNode.data, goal.data) === 0) {
                console.log("Goal State Reached!");
                path_arr = this.getPath(curNode)
                break;
            }

            for (const child of curNode.generateChild()) {
                if (!visited.has(child.data.toString())) {
                    child.fval = this.f(child, goal);
                    this.open.push(child);
                    curNode.addChild(child);
                    visited.add(child.data.toString())
                }
            }
            this.closed.push(curNode);
            this.open.sort((a, b) => a.fval - b.fval); // A*: Sort by fval
            // this.open.forEach((index) => { console.log("F VALUE:", index.fval) })

            moves++;
        }

        // console.log(`\n\nTotal Moves using A-Star: ${moves}`);
        const path = new TreeNode(path_arr[0], 0, 0, null);
        let currentNode = path;
        for (let index = 1; index < path_arr.length; index++) {
            let tempNode = new TreeNode(path_arr[index])
            currentNode.addChild(tempNode)
            currentNode = currentNode.children[0];
        }
        const treeJson = path.toJson();
        fs.writeFileSync('aStar_tree.json', JSON.stringify(treeJson, null, 2));
    }

}

module.exports = Puzzle;
