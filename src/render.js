const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = window.innerWidth;
const height = window.innerHeight;

const GRID_SIZE = 8;
const CELL_SIZE = width / GRID_SIZE;

canvas.width = width;
canvas.height = height;

let arr;
let sides = {
  bottom: 0,
  left: 1,
  right: 2,
  top: 3,
};

let Player = {
  playerOneScore: 0,
  playerTwoScore: 0,
};

let isPlayerOneTurn;
let currentBox;

// START GAME FUNCTION

startGame();

function startGame() {
  isPlayerOneTurn = Math.random() > 0.5 ? false : true;
  arr = [];
  currentBox = [];
  for (let i = 0; i < GRID_SIZE - 1; i++) {
    arr[i] = [];
    for (let j = 0; j < GRID_SIZE - 1; j++) {
      arr[i][j] = new Box(CELL_SIZE * (i + 1), CELL_SIZE * (j + 1), CELL_SIZE);
    }
  }
}

function Box(x, y, size) {
  this.x = x;
  this.y = y;
  this.w = size;
  this.h = size;

  this.numberOfSideSelected = 0;
  this.owner = null;

  this.top = y;
  this.left = x;
  this.right = x + size;
  this.bottom = y + size;

  this.highlight = null;
  this.topSide = {
    owner: null,
    isSelected: false,
  };
  this.leftSide = {
    owner: null,
    isSelected: false,
  };
  this.bottomSide = {
    owner: null,
    isSelected: false,
  };
  this.rightSide = {
    owner: null,
    isSelected: false,
  };

  this.isMouseInside = function (x, y) {
    return x > this.left && x < this.right && y > this.top && y < this.bottom;
  };

  this.highlighted = function (x, y) {
    let dotTop = y - this.top;
    let dotLeft = x - this.left;
    let dotRight = this.right - x;
    let dotBottom = this.bottom - y;

    let minimumDistance = Math.min(dotTop, dotLeft, dotRight, dotBottom);

    if (minimumDistance === dotTop && !this.topSide.isSelected) {
      this.highlight = sides.top;
    } else if (minimumDistance === dotLeft && !this.leftSide.isSelected) {
      this.highlight = sides.left;
    } else if (minimumDistance === dotRight && !this.rightSide.isSelected) {
      this.highlight = sides.right;
    } else if (minimumDistance === dotBottom && !this.bottomSide.isSelected) {
      this.highlight = sides.bottom;
    }
    return this.highlight;
  };

  this.drawBoxSides = function () {
    if (this.highlight !== null) {
      this.drawBoxSide(this.highlight, getColor(isPlayerOneTurn, true));
    }

    if (this.topSide.isSelected) {
      this.drawBoxSide(sides.top, getColor(this.topSide.owner));
    }
    if (this.leftSide.isSelected) {
      this.drawBoxSide(sides.left, getColor(this.leftSide.owner));
    }
    if (this.rightSide.isSelected) {
      this.drawBoxSide(sides.right, getColor(this.rightSide.owner));
    }
    if (this.bottomSide.isSelected) {
      this.drawBoxSide(sides.bottom, getColor(this.bottomSide.owner));
    }
  };

  this.fillBox = function () {
    if (this.owner === null) {
      return;
    }

    ctx.beginPath();
    ctx.fillStyle = getColor(this.owner, false);
    ctx.fillRect(
      this.x + CELL_SIZE / 10,
      this.y + CELL_SIZE / 10,
      this.w - (2 * CELL_SIZE) / 10,
      this.h - (2 * CELL_SIZE) / 10
    );
    ctx.closePath();
  };

  this.drawLine = function (x1, y1, x2, y2, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = CELL_SIZE / 12;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
  };

  this.drawBoxSide = function (side, sideColor) {
    switch (side) {
      case sides.top:
        this.drawLine(this.left, this.top, this.right, this.top, sideColor);
        break;
      case sides.left:
        this.drawLine(this.left, this.top, this.left, this.bottom, sideColor);
        break;
      case sides.right:
        this.drawLine(this.right, this.top, this.right, this.bottom, sideColor);
        break;
      case sides.bottom:
        this.drawLine(
          this.left,
          this.bottom,
          this.right,
          this.bottom,
          sideColor
        );
        break;
    }
  };

  this.selectBoxSide = function () {
    if (this.highlight === null) {
      return;
    }
    switch (this.highlight) {
      case sides.top:
        this.topSide.owner = isPlayerOneTurn;
        this.topSide.isSelected = true;
        break;
      case sides.left:
        this.leftSide.owner = isPlayerOneTurn;
        this.leftSide.isSelected = true;
        break;
      case sides.right:
        this.rightSide.owner = isPlayerOneTurn;
        this.rightSide.isSelected = true;
        break;
      case sides.bottom:
        this.bottomSide.owner = isPlayerOneTurn;
        this.bottomSide.isSelected = true;
        break;
    }
    this.highlight = null;
    this.numberOfSideSelected++;
    if (this.numberOfSideSelected === 4) {
      if (isPlayerOneTurn) {
        Player.playerOneScore++;
      } else {
        Player.playerTwoScore++;
      }
      this.owner = isPlayerOneTurn;
      return true;
    } else {
      return false;
    }
  };

  function getColor(player, isLight) {
    if (player) {
      return isLight ? "tomato" : "crimson";
    } else {
      return isLight ? "lightskyblue" : "blue";
    }
  }
}

const drawCircle = (x, y) => {
  ctx.beginPath();
  ctx.fillStyle = "#222345";
  ctx.arc(x, y, CELL_SIZE / 10, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
};

const draw = () => {
  for (let i = 0; i < GRID_SIZE - 1; i++) {
    for (let j = 0; j < GRID_SIZE - 1; j++) {
      drawCircle(CELL_SIZE * (i + 1), CELL_SIZE * (j + 1));
    }
  }
};

function drawBox() {
  for (let i = 0; i < GRID_SIZE - 1; i++) {
    for (let j = 0; j < GRID_SIZE - 1; j++) {
      arr[i][j].drawBoxSides();
      arr[i][j].fillBox();
    }
  }
}

const gameLopp = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBox();
  draw();

  requestAnimationFrame(gameLopp);

  document.getElementById("playerOne").textContent = Player.playerOneScore;
  document.getElementById("playerTwo").textContent = Player.playerTwoScore;
};

const highlight = (x, y) => {
  for (let i = 0; i < GRID_SIZE - 1; i++) {
    for (let j = 0; j < GRID_SIZE - 1; j++) {
      arr[i][j].highlight = null;
    }
  }

  currentBox = [];
  let rows = arr.length;
  let cols = arr[0].length;

  for (let i = 0; i < GRID_SIZE - 2; i++) {
    for (let j = 0; j < GRID_SIZE - 2; j++) {
      if (arr[i][j].isMouseInside(x, y)) {
        let side = arr[i][j].highlighted(x, y);
        if (side !== null) {
          currentBox.push({ row: i, col: j });
        }

        let row = i;
        let col = j;
        let highlight;
        let isNeighbour = true;

        if (side === sides.left && j > 0) {
          row = i - 1;
          highlight = sides.right;
        } else if (side === sides.right && j < cols - 1) {
          row = i + 1;
          highlight = sides.left;
        } else if (side === sides.top && i > 0) {
          col = j - 1;
          highlight = sides.bottom;
        } else if (side === sides.bottom && i < rows - 1) {
          col = j + 1;
          highlight = sides.top;
        } else {
          isNeighbour = false;
        }
        if (isNeighbour) {
          arr[row][col].highlight = highlight;
          currentBox.push({ row, col });
        }
      }
    }
  }
};

const selectSide = () => {
  let filledBox = false;

  if (currentBox.length == 0) {
    return;
  }

  for (let box of currentBox) {
    if (arr[box.row][box.col].selectBoxSide()) {
      filledBox = true;
    }
  }

  currentBox = [];

  if (filledBox) {
    isPlayerOneTurn = !isPlayerOneTurn;
  }
};

const mouseMoveHandler = (e) => {
  let x = e.clientX;
  let y = e.clientY;

  highlight(x, y);
};

const mouseClickHandler = (e) => {
  selectSide();
};

canvas.addEventListener("mousemove", mouseMoveHandler);
canvas.addEventListener("click", mouseClickHandler);

gameLopp();
