function countInversions(arr) {
  let inversions = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) {
        inversions++;
      }
    }
  }
  return inversions;
}

function findEmptyRowFromConfig(config, gridWidth) {
  const emptyIndex = config.indexOf(0); 
  return Math.floor(emptyIndex / gridWidth) + 1; 
}

function isSolvable(startConfig, goalConfig, gridWidth = 4) {
 
  const startWithoutZero = startConfig.filter((x) => x !== 0);
  const goalWithoutZero = goalConfig.filter((x) => x !== 0);

  // Count inversions
  const startInversions = countInversions(startWithoutZero);
  const goalInversions = countInversions(goalWithoutZero);

  
  const startEmptyRow = findEmptyRowFromConfig(startConfig, gridWidth);
  const goalEmptyRow = findEmptyRowFromConfig(goalConfig, gridWidth);

  // Check if the inversion counts' parity matches
  const startParity = (startInversions + startEmptyRow) % 2;
  const goalParity = (goalInversions + goalEmptyRow) % 2;

  return startParity === goalParity;
}


const startConfig = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
const goalConfig = [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 0];

// Check if the puzzle is solvable
const solvable = isSolvable(startConfig, goalConfig);

console.log("Start configuration:");
for (let i = 0; i < 4; i++) {
  console.log(startConfig.slice(i * 4, i * 4 + 4).join(' '));
}

console.log("\nGoal configuration:");
for (let i = 0; i < 4; i++) {
  console.log(goalConfig.slice(i * 4, i * 4 + 4).join(' '));
}

console.log("Is the puzzle solvable?", solvable ? "Yes" : "No");
