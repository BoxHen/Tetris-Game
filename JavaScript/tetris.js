
//Constants
block = 40; // each block will be 40x40 pixels
grid_wide = 10;
grid_height = 20; // this makes the grid 400x800
/*==============================Variables=====================================*/
// create the game grid
var canvas = document.getElementById('tetris');
var tetrisGrid = canvas.getContext('2d');

tetrisGrid.scale(20, 20);
// tetrisGrid.fillStyle = '#000';
// tetrisGrid.fillRect(0,0, canvas.width, canvas.height); // draws a rect with no fill
/*==============================Constants=====================================*/
const matrix = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0]
];

const piece = { // object in JS
  pos: {x: 5, y :5},
  matrix: matrix
}
/*==============================Functions=====================================*/ // adds the pieces
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
/*============================================================================*/
// draw the tetris pieces
function drawPieces(){
  tetrisGrid.fillStyle = '#000';
  tetrisGrid.fillRect(0,0, canvas.width, canvas.height); // draws a rect with no fill
  drawMatrix(piece.matrix, piece.pos);
}
/*============================================================================*/
// controls the pieces animations as they move down automatically
let dropCounter = 0;
let dropInterval = 1000; // in ms so this is 1 sec
let lastTime = 0;

function update(time = 0){ // the time we get from requestAnimationFrame but default it to 0 !!!note: time is a defualt parameter
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if(dropCounter >= dropInterval){ // about every second (depending on the dropInterval) the block will fall
    pieceDrop();
    // dropCounter = 0; // reset the counter so block does not disappear from the screen
  }
  drawPieces();
  requestAnimationFrame(update);
}
/*============================================================================*/
// drops the piece down based on dropInterval
function pieceDrop(){
  piece.pos.y++;
  dropCounter = 0;
}
/*============================================================================*/
// controls piece movemnt as user presses the arrowkeys
document.addEventListener('keydown', event => {
  //console.log(event); //used to see what the keycode is
  if(event.keyCode === 37){ // corresponds to arrow key LEFT
    piece.pos.x--;
  }
    // else if(event.keyCode === 38) {// corresponds to arrow key UP
    // piece.pos.y--;
      // note: No up in tetris but this may be used in future for a unique mode
  else if (event.keyCode === 39) { // corresponds to arrow key RIGHT
    piece.pos.x++;
  } else if(event.keyCode === 40){ // corresponds to arrow key DOWN
    pieceDrop();
  }
});
update();





/*================================Notes=======================================*/
/*
process:
1. make the game board and test that (canvas)
2. make a piece and draw it onto the board
3. test the piece for movement (offset)
4.
*/
