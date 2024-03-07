import json
import matplotlib.pyplot as plt
from matplotlib.patches import ConnectionPatch

from matplotlib.patches import Rectangle

def plot_tree(node, x, y, level=0, parent_x=None):
    if not node:
        return

    # Plot current node
    plt.text(x, y, '\n'.join([' '.join(row) for row in node['data']]), ha='center', va='center')
    # plt.gca().add_patch(Rectangle((x - 2, y - 0.3), 4, 0.75, edgecolor='black', facecolor='none'))

    # Plot children
    if node['children']:
        num_children = len(node['children'])
        child_spacing = 2.0 ** (4 - level) * 2  # Adjust spacing based on level and multiply by 2 to create space between boxes
        total_width = num_children * child_spacing
        start_x = x - total_width / 2
        for child in node['children']:
            child_x = start_x + child_spacing / 2
            plot_tree(child, child_x, y - 1.5, level=level+1, parent_x=x)
            plt.plot([x, child_x], [y - 0.5, y - 1], 'k-', lw=1)
            start_x += child_spacing

# Load tree data from JSON file
with open('tree.json') as f:
    tree_data = json.load(f)

# Create figure and plot tree
plt.figure(figsize=(12, 8))
plt.axis('off')
plot_tree(tree_data, 0, 0)
plt.show()
