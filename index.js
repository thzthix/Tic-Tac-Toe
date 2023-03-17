const PLAYER = { name: "player", mark: "O" };
const COMP = { name: "computer", mark: "X" };
const cellIdPrefix = "cell-";

const diagnols = {
  diagnol1: ["cell-1", "cell-5", "cell-9"],
  diagnol2: ["cell-3", "cell-5", "cell-7"],
};

//1:occupied 0:not occupied
let isPlaying = true;

const board = document.querySelector(".board");

board.addEventListener("click", onClickCell);

function checkForSameMarksInRow(parentCell) {
  const cellsOfRow = parentCell.children;
  console.log(cellsOfRow);
  console.log(cellsOfRow[0].textContent);
  console.log(cellsOfRow[1].textContent);
  console.log(cellsOfRow[2].textContent);

  if (
    cellsOfRow[0].textContent === cellsOfRow[1].textContent &&
    cellsOfRow[1].textContent === cellsOfRow[2].textContent
  ) {
    console.log("row is same");
    return true;
  }
  console.log("row is not same");
  return false;
}
function checkForSameMarksInColumn(cell) {
  console.log("check column");
  console.log(cell);
  const columnOfCell = cell.classList[0];
  const cellsOfColumn = document.querySelectorAll(`.${columnOfCell}`);
  if (
    cellsOfColumn[0].textContent === cellsOfColumn[1].textContent &&
    cellsOfColumn[1].textContent === cellsOfColumn[2].textContent
  ) {
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
function markCell(markedCell, mark) {
  markedCell.textContent = mark;
}
function checkForWin(cell, rowContainer) {
  let ifWon = false;
  if (checkForSameMarksInRow(rowContainer) || checkForSameMarksInColumn(cell)) {
    ifWon = true;
  } else if (cell.id === "#cell-5" || diagnols.diagnol1.includes(cell.id)) {
    ifWon = checkForSameMarksIndiagonal(diagnols.diagnol1);
  } else if (cell.id === "#cell-5" || diagnols.diagnol2.includes(cell.id)) {
    ifWon = checkForSameMarksIndiagonal(diagnols.diagnol2);
  } else {
    ifWon = false;
  }
  return ifWon;
}
function onClickCell(event) {
  const cellClicked = event.target;
  const rowContainer = event.target.parentNode;
  if (!event.target.classList.contains("cell")) {
    return;
  }
  if (cellClicked.textContent) {
    alert("This cell is already occupied. Please select another cell.");
    return;
  }

  markCell(cellClicked, PLAYER.mark);
  const ifWon = checkForWin(cellClicked, rowContainer);
  if (ifWon) {
    isPlaying = false;
    document.querySelector("h1").innerText = "won!";
    return;
  }
}
