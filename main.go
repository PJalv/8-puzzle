package main

import (
	"container/heap"
	"fmt"
)

type PuzzleNode struct {
	state    []int
	parent   *PuzzleNode
	action   [2]int
	priority int
}

type MinHeap []*PuzzleNode

func (h MinHeap) Len() int           { return len(h) }
func (h MinHeap) Less(i, j int) bool { return h[i].priority < h[j].priority }
func (h MinHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }

func (h *MinHeap) Push(x interface{}) {
	*h = append(*h, x.(*PuzzleNode))
}

func (h *MinHeap) Pop() interface{} {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[0 : n-1]
	return x
}

func (node *PuzzleNode) isGoal() bool {
	goal := []int{1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 0}
	for i, v := range node.state {
		if v != goal[i] {
			return false
		}
	}
	return true
}

func (node *PuzzleNode) getNeighbors() []*PuzzleNode {
	var neighbors []*PuzzleNode
	zeroIndex := findZero(node.state)
	i, j := zeroIndex/4, zeroIndex%4
	moves := [][2]int{{0, 1}, {1, 0}, {0, -1}, {-1, 0}} // Moves: right, down, left, up

	for _, move := range moves {
		newI, newJ := i+move[0], j+move[1]
		if newI >= 0 && newI < 4 && newJ >= 0 && newJ < 4 {
			newIdx := newI*4 + newJ
			newState := make([]int, len(node.state))
			copy(newState, node.state)
			newState[zeroIndex], newState[newIdx] = newState[newIdx], newState[zeroIndex]
			neighbors = append(neighbors, &PuzzleNode{state: newState, parent: node, action: move, priority: heuristic(newState)})
		}
	}
	return neighbors
}

func heuristic(state []int) int {
	goalPositions := []int{1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 0}
	distance := 0
	for idx, value := range state {
		if value != 0 {
			targetIndex := indexOf(goalPositions, value)
			targetI, targetJ := targetIndex/4, targetIndex%4
			currentI, currentJ := idx/4, idx%4
			distance += abs(targetI-currentI) + abs(targetJ-currentJ)
		}
	}
	return distance
}

func findZero(state []int) int {
	for index, value := range state {
		if value == 0 {
			return index
		}
	}
	return -1 // Not found, should never happen in a valid puzzle
}

func indexOf(slice []int, value int) int {
	for index, v := range slice {
		if v == value {
			return index
		}
	}
	return -1
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

func greedyBFS(initialState []int) []*PuzzleNode {
	startNode := &PuzzleNode{state: initialState, priority: heuristic(initialState)}
	frontier := &MinHeap{}
	heap.Init(frontier)
	heap.Push(frontier, startNode)
	visited := make(map[string]bool)
	visited[fmt.Sprint(initialState)] = true

	for frontier.Len() > 0 {
		currentNode := heap.Pop(frontier).(*PuzzleNode)
		if currentNode.isGoal() {
			return reconstructPath(currentNode)
		}

		for _, neighbor := range currentNode.getNeighbors() {
			neighborStateStr := fmt.Sprint(neighbor.state)
			if !visited[neighborStateStr] {
				visited[neighborStateStr] = true
				heap.Push(frontier, neighbor)
			}
		}
	}
	return nil
}

func reconstructPath(node *PuzzleNode) []*PuzzleNode {
	var path []*PuzzleNode
	for node != nil {
		path = append([]*PuzzleNode{node}, path...)
		node = node.parent
	}
	return path
}

func main() {
	initialState := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0}
	solution := greedyBFS(initialState)
	if solution != nil {
		fmt.Println("Found Solution")
		for step, node := range solution {
			if node.parent != nil {
				fmt.Printf("\nStep %d: \n", step)
			} else {
				fmt.Println("\nStep 1: Start")
			}
			printMatrix(node.state)
		}
	} else {
		fmt.Println("No solution found.")
	}
}

func printMatrix(state []int) {
	for i := 0; i < 4; i++ {
		fmt.Println(state[i*4 : (i+1)*4])
	}
}
