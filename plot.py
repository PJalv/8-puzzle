import sys
import json
import matplotlib.pyplot as plt


def plot_tree(node, x, y, level=0, parent_x=None):
    if not node:
        return

    plt.text(x, y, '\n'.join([' '.join(row) for row in node['data']]), ha='center', va='center')

    if node['children']:
        num_children = len(node['children'])
        child_spacing = 2.0 ** (4 - level) * 2 
        total_width = num_children * child_spacing
        start_x = x - total_width / 2
        for child in node['children']:
            child_x = start_x + child_spacing / 2
            plot_tree(child, child_x, y - 1.5, level=level+1, parent_x=x)
            plt.plot([x, child_x], [y - 0.5, y - 1], 'k-', lw=1)
            start_x += child_spacing

if len(sys.argv) != 2:
    print("Usage: python script.py <filename>")
    sys.exit(1)

filename = sys.argv[1]

with open(filename) as f:
    tree_data = json.load(f)

plt.figure(figsize=(15, 8))
plt.axis('off')
plot_tree(tree_data, 0, 0)
plt.show()
