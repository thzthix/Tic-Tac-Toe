const resetBtn = document.querySelector(".reset-btn");
const h2 = document.querySelector("h2");
const h3 = document.querySelector("h3");
const displayTurnSpan = h2.querySelector(".turn");
const winnerSpanEl = h3.querySelector(".winner");
const message = document.querySelector(".message");

const PLAYER = {
  name: "player",
  mark: `<i class="icon fa-regular fa-circle"></i>`,

  // };
};
const COMP = { name: "computer", mark: `<i class="icon fa-solid fa-x"></i>` };
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
  emptyCell: new Set([
    "cell-1",
    "cell-2",
    "cell-3",
    "cell-4",
    "cell-5",
    "cell-6",
    "cell-7",
    "cell-8",
    "cell-9",
  ]),

  resetBoard: function () {
    this.emptyCell = new Set([
      "cell-1",
      "cell-2",
      "cell-3",
      "cell-4",
      "cell-5",
      "cell-6",
      "cell-7",
      "cell-8",
      "cell-9",
    ]);

    for (const cell of this.emptyCell) {
      const cellEl = document.getElementById(cell);
      const cellElClasses = cellEl.classList;

      for (let i = 0; i < cellElClasses.length; i++) {
        const className = cellElClasses[i];
        if (className.startsWith("marked")) {
          cellElClasses.remove(className);
        }
      }
      cellEl.innerHTML = "";
    }
  },
  diagnols: [
    ["cell-1", "cell-5", "cell-9"],
    ["cell-3", "cell-5", "cell-7"],
  ],
  markCell: function (id, mark) {
    const markedCell = document.getElementById(`${id}`);

    markedCell.innerHTML = mark;
    markedCell.classList.add(`marked--${turn}`);

    if (this.emptyCell.delete(markedCell.id)) {
      markedCell.classList.add(`marked--${turn}`);
    }
  },
  getRandomCellId: function () {
    const randomIndex = Math.floor(Math.random() * this.emptyCell.size);
    const emptySetArray = Array.from(this.emptyCell);

    const cellId = emptySetArray[randomIndex];
    return cellId;
  },
};
let turn = PLAYER.name;
let compTimeoutId;

//1:occupied 0:not occupied
let isPlaying = false;

function areCellsEqual(...cells) {
  return cells.every((cell) => cell.classList.contains(`marked--${turn}`));
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
function checkForSameMarksIndiagonal(...diagnol) {
  const diagnols = [];
  diagnol.forEach((cellId) => {
    diagnols.push(document.getElementById(cellId));
  });
  if (areCellsEqual(...diagnols)) {
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
        diagnol.includes(cellId) && checkForSameMarksIndiagonal(...diagnol)
    )
  ) {
    return true;
  }
  return false;
}
function displayWinner(winner) {
  h3.textContent = `${winner} Won!`;
}
function displayTurn(turn) {
  displayTurnSpan.textContent = turn;
}
function changeTurn() {
  if (turn === PLAYER.name) {
    if (board.display.classList.contains("disabled")) {
      board.display.classList.remove("disabled");
    }
    // board.display.addEventListener("click", onClickCell);
  } else if (turn === COMP.name) {
    board.display.classList.add("disabled");
    // board.display.removeEventListener("click", onClickCell);
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
    isPlaying = false;
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
  if (
    cellClicked.classList.contains("icon") ||
    cellClicked.classList.contains("marked--player") ||
    cellClicked.classList.contains("marked--computer")
  ) {
    message.classList.remove("hide");
    return;
  }
  if (!event.target.classList.contains("cell")) {
    return;
  }

  if (
    !message.classList.contains("hide") &&
    !cellClicked.classList.contains("icon")
  ) {
    message.classList.add("hide");
  }
  board.markCell(event.target.id, PLAYER.mark);
  const ifWon = checkForWin(cellClicked, rowContainer);
  handleturnResult(ifWon);
}

function computerTurn() {
  let computerMoveId = board.getRandomCellId();
  console.log(computerMoveId);
  board.markCell(computerMoveId, COMP.mark);

  const computerMove = document.getElementById(`${computerMoveId}`);
  const rowContainer = computerMove.parentNode;

  const ifWon = checkForWin(computerMove, rowContainer);
  handleturnResult(ifWon);
}
function isDraw() {
  if (board.emptyCell.size === 0) {
    isPlaying = false;
    h3.textContent = "DRAW!";
    return true;
  } else {
    return false;
  }
}
function changeResetBtnText() {
  resetBtn.textContent = "play again";
}
function resetGame() {
  if (compTimeoutId) {
    clearTimeout(compTimeoutId);
  }
  board.resetBoard();
  board.display.classList.remove("disabled");

  if (turn === COMP.name) {
    turn = PLAYER.name;
  }

  playGame();
}

function playGame() {
  isPlaying = true;

  resetBtn.addEventListener("click", resetGame);
  board.display.addEventListener("click", onClickCell);
}
playGame();
