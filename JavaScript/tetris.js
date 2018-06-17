
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

  const arena = createMatrix(10, 20);
    console.log(arena); console.table(arena);

  const piece = { // object in JS
    pos: {x: 5, y :5},
    matrix: matrix
  }

/*==============================Functions=====================================*/ // adds the pieces
  /* draws the game board*/
  function drawMatrix(matrix, offset){ // offset used to move the block around
    matrix.forEach((row, y) => { // x and y here are the indexes
      row.forEach((value, x) => {
        if(value !== 0){
          tetrisGrid.fillStyle = 'purple';
          tetrisGrid.fillRect(x+offset.x, y+offset.y, 1, 1); // !!!!!! add offset to x and y later
        }
      });
    });
  }
  /*--------------------------------------------------------------------------*/
  // draw the tetris pieces
  function drawPieces(){
    tetrisGrid.fillStyle = '#000';
    tetrisGrid.fillRect(0,0, canvas.width, canvas.height); // draws a rect with no fill
    drawMatrix(piece.matrix, piece.pos);
    drawMatrix(arena, {x:0, y:0});
  }
  /*--------------------------------------------------------------------------*/
  // drops the piece down based on dropInterval
  function pieceDrop(){
    piece.pos.y++;
    if(collision(arena, piece)){
      piece.pos.y--;
      merge(arena, piece);
      piece.pos.y = 0; // resets the piece back at the top
    }
    dropCounter = 0;
  }
  /*--------------------------------------------------------------------------*/
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
  /*--------------------------------------------------------------------------*/
  // created the matrix, arena, to record where pieces are saved on the board
  function createMatrix(w,h){
    const matrix = [];
    while(h--){ // while h is not zero we decrease
      matrix.push(new Array(w).fill(0))
    }
    return matrix;
  }
  /*--------------------------------------------------------------------------*/
  // draws the new piece onto the matrix
  function merge(arena, piece){
    piece.matrix.forEach((row, y) =>{
      row.forEach((value, x) => {
        if(value !== 0){
          arena[y + piece.pos.y][x+ piece.pos.x] = value;
        }
      });
    });
  }
  /*--------------------------------------------------------------------------*/
  // chekcs for collision on game board
  function collision(arena, piece){
    const [m, o] = [piece.matrix, piece.pos];
    for(let y = 0; y < m.length; ++y){
      for(let x = 0; x < m[y].length; ++x){
        // checks if it is not zero, has a row, and has a column repectively
        if(m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0){ // checks if the piece is within the arena(game board) and if something is there in the arena already
          // note: if it reaches bottom or side of the board -> undefined
          // so, undefined !== 0
          console.log(arena[y + o.y] && arena[y + o.y][x + o.x]);
          return true;
        }
      }
    }
    return false;
  }
  /*--------------------------------------------------------------------------*/
  // moves the piece on the x axis and controls the boundaries on left and right
  function pieceMove(dir){
    piece.pos.x += dir;
    if(collision(arena, piece)){
      piece.pos.x -= dir;
    }
  }
  /*--------------------------------------------------------------------------*/
  // rotation: transpose + reverse = rotate
  function rotate(matrix, dir){
    var test = matrix
    for(let i = 0; i < matrix.length; i++){
      for(let j = 0; j < i; j++ ){
        //[ matrix[j][i], matrix[i][j] ] = [ matrix[i][j], matrix[j][i] ]; same as below
        var temp = matrix[i][j];
        matrix[i][j] = matrix[j][i];
        matrix[j][i] = temp;
      }
    }
    if(dir > 0){
      matrix.forEach(row => row.reverse()); // reverses the content in the rows
    } else {
      matrix.reverse(); // reverse the rows
    }
  }
  /*--------------------------------------------------------------------------*/
  function pieceRotate(dir){
    rotate(piece.matrix, dir);
    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    This will not offset the piece but prevent pieces getting stuck in wall
    if(collision(arena, piece)){
      pieceRotate(-1*dir);
    }
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    if(collision(arena, piece)){ // refer to 31 !!! may be a bug here
      piece.pos.x++;
      if(collision(arena, piece)){
        piece.pos.x -= 2;
      }
    }
  }
  /*--------------------------------------------------------------------------*/
  /*--------------------------------------------------------------------------*/
  // controls piece movemnt as user presses the arrowkeys
  document.addEventListener('keydown', event => {
    //console.log(event); //used to see what the keycode is
    if(event.keyCode === 37){ // corresponds to arrow key LEFT
      pieceMove(-1) //piece.pos.x--;
    }
      // else if(event.keyCode === 38) {// corresponds to arrow key UP
      // piece.pos.y--;
        // note: No up in tetris but this may be used in future for a unique mode
    else if (event.keyCode === 39) { // corresponds to arrow key RIGHT
      pieceMove(1) //piece.pos.x++;
    } else if(event.keyCode === 40){ // corresponds to arrow key DOWN
      pieceDrop();
    } else if (event.keyCode === 81) { // Q
      pieceRotate(-1);
    } else if (event.keyCode === 87) { // W
      pieceRotate(1);
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
