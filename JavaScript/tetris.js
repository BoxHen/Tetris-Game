
//Constants
block = 40; // each block will be 40x40 pixels
grid_wide = 10;
grid_height = 20; // this makes the grid 400x800

// create the game grid
var canvas = document.getElementById('tetris');
var tetrisGrid = canvas.getContext('2d');

tetrisGrid.scale(20, 20);
tetrisGrid.fillStyle = '#000';
tetrisGrid.fillRect(0,0, canvas.width, canvas.height); // draws a rect with no fill

const matrix = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0]
];

const player = {
  pos: {x: 5, y :5},
  matrix: matrix,
}

/* draws the game board*/
function drawMatrix(matrix, offset){ // offset used to move the block around
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value !== 0){
        tetrisGrid.fillStyle = 'purple';
        tetrisGrid.fillRect(x+offset.x, y+offset.y, 1, 1); // !!!!!! add offset to x and y later
      }
    });
  });
}

function drawPieces(){
  drawMatrix(player.matrix, player.pos);
}

function update(){
  drawPieces();
  requestAnimationFrame(update);
}

update();
