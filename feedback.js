function areCellsEqual(...cells) {
  const firstCell = cells[0];
  return cells.every((cell) => cell.textContent === firstCell.textContent);
}
function checkForSameMarksInRow(parentCell) {
  const cellsOfRow = parentCell.children;
  if (areCellsEqual(...cellsOfRow)) {
    console.log("row is same");
    return true;
  }
  console.log("row is not same");
  return false;
}

function checkForSameMarksInColumn(cell) {
  const columnOfCell = cell.classList[0];
  const cellsOfColumn = document.querySelectorAll(`.${columnOfCell}`);
  if (areCellsEqual(...cellsOfColumn)) {
    console.log("column is same");
    return true;
  }
  console.log("column is not same");
  return false;
}
