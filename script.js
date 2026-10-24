const cells = document.querySelectorAll(".cell");
const gameStatus = document.getElementById("game-status");
const gameMessage = document.getElementById("game-message");
const statusDot = document.getElementById("status-dot");

const scoreXElement = document.getElementById("score-x");
const scoreOElement = document.getElementById("score-o");
const scoreDrawElement = document.getElementById("score-draw");

const restartButton = document.getElementById("restart-btn");
const resetButton = document.getElementById("reset-btn");

// Game state
const WINNING_COMBINATIONS = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Main diagonal
  [2, 4, 6]  // Other diagonal
];

let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;

let scores = {
  X: 0,
  O: 0,
  draws: 0
};

// Handle a cell click
function handleCellClick(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.index);

  // Ignore invalid moves
  if (!gameActive || board[index] !== "") {
    return;
  }

  // Save and display the move
  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(`mark-${currentPlayer.toLowerCase()}`);
  cell.disabled = true;
  cell.setAttribute(
    "aria-label",
    `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}: ${currentPlayer}`
  );

  // Check for a winner
  const winningCombination = getWinningCombination();

  if (winningCombination) {
    finishGame("win", winningCombination);
    return;
  }

  // Check for a draw
  if (board.every((value) => value !== "")) {
    finishGame("draw");
    return;
  }

  // Switch turns
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateTurnDisplay();
}

// Find a winning combination for the current player
function getWinningCombination() {
  return WINNING_COMBINATIONS.find((combination) =>
    combination.every((index) => board[index] === currentPlayer)
  );
}

// Update the turn indicator
function updateTurnDisplay() {
  gameStatus.textContent = `Player ${currentPlayer}'s turn`;
  statusDot.classList.toggle("is-o", currentPlayer === "O");
}

// End the current round
function finishGame(result, winningCombination = []) {
  gameActive = false;

  // Disable every cell after the round ends
  cells.forEach((cell) => {
    cell.disabled = true;
  });

  if (result === "win") {
    scores[currentPlayer]++;
    scoreXElement.textContent = scores.X;
    scoreOElement.textContent = scores.O;

    // Highlight the winning cells
    winningCombination.forEach((index) => {
      cells[index].classList.add("winner");
    });

    gameStatus.textContent = `Player ${currentPlayer} wins!`;
    gameMessage.textContent =
      `Congratulations! Player ${currentPlayer} won this round.`;
    statusDot.classList.toggle("is-o", currentPlayer === "O");
  } else {
    scores.draws++;
    scoreDrawElement.textContent = scores.draws;

    gameStatus.textContent = "It's a draw!";
    gameMessage.textContent =
      "Nobody won this round. Ready for a rematch?";
  }
}

// Start a new round without clearing scores
function restartRound() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;

  cells.forEach((cell, index) => {
    cell.textContent = "";
    cell.disabled = false;
    cell.classList.remove("mark-x", "mark-o", "winner");
    cell.setAttribute(
      "aria-label",
      `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}`
    );
  });

  gameStatus.textContent = "Player X's turn";
  gameMessage.textContent = "Make your move and claim the board.";
  statusDot.classList.remove("is-o");
}

// Reset scores and start a fresh round
function resetScores() {
  scores = {
    X: 0,
    O: 0,
    draws: 0
  };

  scoreXElement.textContent = "0";
  scoreOElement.textContent = "0";
  scoreDrawElement.textContent = "0";

  restartRound();
}

// Register event listeners
cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
});

restartButton.addEventListener("click", restartRound);
resetButton.addEventListener("click", resetScores);

// Initialize the game
restartRound();
