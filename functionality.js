const MAX_SIZE = 9;

let minesCoordinates = new Set();
let table = [];
let flagsCounter = 10;
let openCells = 0;
let gameOver = false;

gamePlay();

function gamePlay() {
  generateCells();
  generateMines();
  document.getElementById("gameStatus").innerText = "Flags: " + flagsCounter;
}

function generateMines() {
  while (minesCoordinates.size < flagsCounter) {
    let x = Math.floor(Math.random() * MAX_SIZE);
    let y = Math.floor(Math.random() * MAX_SIZE);
    let currentCoordinates = x.toString() + y.toString();
    minesCoordinates.add(currentCoordinates);
  }
}

function generateCells() {
  for (let i = 0; i < MAX_SIZE; ++i) {
    let row = [];
    for (let j = 0; j < MAX_SIZE; ++j) {
      let cell = document.createElement("div");
      cell.id = i.toString() + j.toString();
      cell.addEventListener("click", openTheCell);
      cell.addEventListener("contextmenu", addFlag);
      document.getElementById("gameBoard").append(cell);
      row.push(cell);
    }
    table.push(row);
  }
}

function addFlag(e) {
  e.preventDefault();
  if (gameOver) {
    return;
  }
  let cell = this;
  if (cell.innerText === "") {
    cell.innerText = "🚩";
    --flagsCounter;
    document.getElementById("gameStatus").innerText = "Flags: " + flagsCounter;
  } else if (cell.innerText === "🚩") {
    cell.innerText = "";
    ++flagsCounter;
    document.getElementById("gameStatus").innerText = "Flags: " + flagsCounter;
  }
}

function openTheCell() {
  let cell = this;
  if (
    gameOver ||
    this.classList.contains("cellOpened") ||
    this.innerText === "🚩"
  ) {
    return;
  } else if (minesCoordinates.has(cell.id)) {
    gameOver = true;
    document.getElementById("gameStatus").innerText = "GAME OVER!";
    detonateAllMines();
    return;
  }

  let cellCoordinates = cell.id.split("");
  let x = parseInt(cellCoordinates[0]);
  let y = parseInt(cellCoordinates[1]);
  generateNumbers(x, y);
}

function detonateAllMines() {
  for (let i = 0; i < MAX_SIZE; ++i) {
    for (let j = 0; j < MAX_SIZE; ++j) {
      let cell = table[i][j];
      if (minesCoordinates.has(cell.id)) {
        cell.innerText = "💣";
      }
    }
  }
}

function generateNumbers(x, y) {
  if (x < 0 || x >= MAX_SIZE || y < 0 || y >= MAX_SIZE) {
    return;
  }
  if (table[x][y].classList.contains("cellOpened")) {
    return;
  }

  table[x][y].classList.add("cellOpened");
  ++openCells;
  let minesFound = 0;

  for (let i = x - 1; i <= x + 1; ++i) {
    for (let j = y - 1; j <= y + 1; ++j) {
      minesFound += countMines(i, j);
    }
  }

  if (minesFound > 0) {
    table[x][y].innerText = minesFound;
    table[x][y].classList.add("number" + minesFound.toString());
  } else {
    for (let i = x - 1; i <= x + 1; ++i) {
      for (let j = y - 1; j <= y + 1; ++j) {
        generateNumbers(i, j);
      }
    }
  }

  if (openCells === MAX_SIZE * MAX_SIZE - 10) {
    document.getElementById("gameStatus").innerText = "You won!";
    gameOver = true;
  }
}

function countMines(x, y) {
  if (x < 0 || x >= MAX_SIZE || y < 0 || y >= MAX_SIZE) {
    return 0;
  }
  if (minesCoordinates.has(x.toString() + y.toString())) {
    return 1;
  }
  return 0;
}
