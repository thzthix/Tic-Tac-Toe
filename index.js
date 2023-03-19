const resetBtn = document.querySelector(".reset-btn");
const h2 = document.querySelector("h2");
const displayTurnSpan = h2.querySelector(".turn");

const PLAYER = { name: "player", mark: "O" };
const COMP = { name: "computer", mark: "X" };
const board = {
  cells: [
    "cell-1",
    "cell-2",
    "cell-3",
    "cell-4",
    "cell-5",
    "cell-6",
    "cell-7",
    "cell-8",
    "cell-9",
  ],
  cellIdPrefix: "cell-",
  display: document.querySelector(".board"),
  emptyCell: [
    "cell-1",
    "cell-2",
    "cell-3",
    "cell-4",
    "cell-5",
    "cell-6",
    "cell-7",
    "cell-8",
    "cell-9",
  ],
  resetBoard: function () {
    this.emptyCell = [];
    this.cells.forEach((cell) => {
      this.emptyCell.push(cell);
    });
    console.log("emptycells:::::::::::::");
    console.log(`cells:${this.emptyCell}`);
    const cells = document.getElementsByClassName("cell");

    Array.from(cells).forEach((cell) => {
      if (cell.innerText) {
        cell.innerText = "";
      }
    });
  },
  diagnols: [
    ["cell-1", "cell-5", "cell-9"],
    ["cell-3", "cell-5", "cell-7"],
  ],
  markCell: function (markedCell, mark) {
    markedCell.textContent = mark;
    const index = this.emptyCell.indexOf(markedCell.id);
    if (index > -1) {
      // only splice array when item is found
      this.emptyCell.splice(index, 1); // 2nd parameter means remove one item only
    }
  },
  getRandomCellId: function () {
    const randomIndex = Math.floor(Math.random() * this.emptyCell.length);

    const cellId = this.emptyCell[randomIndex];
    return cellId;
  },
  getRandomCell: function () {
    const randomCellId = this.getRandomCellId();
    const computerMove = document.getElementById(`${randomCellId}`);
    return computerMove;
  },
};

let compTimeoutId;

//1:occupied 0:not occupied
let isPlaying = false;
let turn = PLAYER.name;
function areCellsEqual(...cells) {
  const firstCell = cells[0];
  return cells.every((cell) => cell.textContent === firstCell.textContent);
}
function checkForSameMarksInRow(parentCell) {
  const cellsOfRow = parentCell.children;

  if (areCellsEqual(...cellsOfRow)) {
    return true;
  }

  return false;
}
function checkForSameMarksInColumn(cell) {
  console.log("check column");
  console.log(cell);
  const columnOfCell = cell.classList[0];
  const cellsOfColumn = document.querySelectorAll(`.${columnOfCell}`);
  if (areCellsEqual(...cellsOfColumn)) {
    console.log("column is same");
    return true;
  }
  console.log("column is not same");
  return false;
}
function checkForSameMarksIndiagonal(diagnol) {
  const firstCell = document.querySelector(`#${diagnol[0]}`);
  const secondCell = document.querySelector(`#${diagnol[1]}`);
  const thirdCell = document.querySelector(`#${diagnol[2]}`);
  if (
    firstCell.textContent === secondCell.textContent &&
    secondCell.textContent === thirdCell.textContent
  ) {
    console.log("diagnol is same");
    return true;
  }
  console.log("diagnol is not same");
  return false;
}
function checkForWin(cell, rowContainer) {
  const cellId = cell.id;
  if (
    checkForSameMarksInRow(rowContainer) ||
    checkForSameMarksInColumn(cell) ||
    board.diagnols.some(
      (diagnol) =>
        diagnol.includes(cellId) && checkForSameMarksIndiagonal(diagnol)
    )
  ) {
    return true;
  }
  return false;
}
function displayWinner(winner) {
  h2.innerText = `${winner} won!`;
}
function displayTurn(turn) {
  displayTurnSpan.innerText = turn;
}
function changeTurn() {
  if (turn === PLAYER.name) {
    board.display.addEventListener("click", onClickCell);
  } else if (turn === COMP.name) {
    board.display.removeEventListener("click", onClickCell);
    clearTimeout(compTimeoutId);
    compTimeoutId = setTimeout(computerTurn, 1000);
  }

  displayTurn(turn);
}
function handleturnResult(ifWon) {
  if (ifWon) {
    isPlaying = false;
    displayWinner(turn);
    changeResetBtnText();
    turn === PLAYER.name &&
      board.display.removeEventListener("click", onClickCell);
    return;
  }
  const isDrawState = isDraw();
  if (isDrawState) {
    changeResetBtnText();
    turn === PLAYER.name &&
      board.display.removeEventListener("click", onClickCell);
  } else {
    turn = turn === PLAYER.name ? COMP.name : PLAYER.name;
    changeTurn();
  }
}
function onClickCell(event) {
  console.log("clicked!!!!!!!");
  const cellClicked = event.target;
  const rowContainer = event.target.parentNode;
  if (!event.target.classList.contains("cell")) {
    return;
  }
  if (cellClicked.textContent) {
    alert("This cell is already occupied. Please select another cell.");
    return;
  }

  board.markCell(cellClicked, PLAYER.mark);
  const ifWon = checkForWin(cellClicked, rowContainer);
  handleturnResult(ifWon);
}

function computerTurn() {
  let computerMove = board.getRandomCell();
  console.log(computerMove);
  board.markCell(computerMove, COMP.mark);
  const rowContainer = computerMove.parentNode;

  const ifWon = checkForWin(computerMove, rowContainer);
  handleturnResult(ifWon);
}
function isDraw() {
  if (board.emptyCell.length === 0) {
    isPlaying = false;
    h2.textContent = "DRAW!";
    return true;
  } else {
    return false;
  }
}
function changeResetBtnText() {
  resetBtn.innerText = "play again";
}
function resetGame() {
  if (compTimeoutId) {
    clearTimeout(compTimeoutId);
  }
  board.resetBoard();

  if (turn === COMP.name) {
    turn = PLAYER.name;
  }

  playGame();
}

function playGame() {
  isPlaying = true;
  cellsOccupyState = 0;
  resetBtn.addEventListener("click", resetGame);
  board.display.addEventListener("click", onClickCell);
}
playGame();
