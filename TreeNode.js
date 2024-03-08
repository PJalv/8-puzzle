class TreeNode {
    constructor(data, level = 0, fval = 0, parent = null) {
        this.data = data;
        this.level = level;
        this.fval = fval;
        this.parent = parent;
        this.children = [];
    }

    addChild(childNode) {
        this.children.push(childNode);
        childNode.parent = this;
    }

    findNode(data) {
        if (this.data === data) {
            return this;
        }

        for (const child of this.children) {
            const foundNode = child.findNode(data);
            if (foundNode) {
                return foundNode;
            }
        }

        return null;
    }

    // Generate child nodes by moving the blank space
    //basically getting the possible moves from the position its in (parent node)
    generateChild() {
        const [x, y] = this.find(this.data, '_');
        const valList = [[x, y - 1], [x - 1, y], [x, y + 1], [x + 1, y]];
        const children = [];
        for (const [i, j] of valList) {
            const child = this.shuffle(this.data, x, y, i, j);
            if (child !== null) {
                const childNode = new TreeNode(child, this.level + 1, 0);
                children.push(childNode);
            }
        }
        return children;
    }

    // Move the blank space in the given direction
    shuffle(puz, x1, y1, x2, y2) {
        if (x2 >= 0 && x2 < puz.length && y2 >= 0 && y2 < puz.length) {
            const tempPuz = this.copy(puz);
            const temp = tempPuz[x2][y2];
            tempPuz[x2][y2] = tempPuz[x1][y1];
            tempPuz[x1][y1] = temp;
            return tempPuz;
        } else {
            return null;
        }
    }

    copy(root) {
        return root.map(row => [...row]);
    }

    find(puz, x) {
        for (let i = 0; i < puz.length; i++) {
            for (let j = 0; j < puz[i].length; j++) {
                if (puz[i][j] === x) {
                    return [i, j];
                }
            }
        }
        return null;
    }
    toJson() {
        const json = {
            data: this.data,
            children: this.children.map(child => child.toJson())
        };
        return json;
    }
}

module.exports = TreeNode;
