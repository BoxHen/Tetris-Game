
/*==============================Variables=====================================*/
  // create the game grid
  var canvas = document.getElementById('tetris');
  var tetrisGrid = canvas.getContext('2d');
  let initPiece = 0;
  let initStore = 0;
  let shiftEnable = true;
  let enterEnable = true;

  // small box for showing the next piece to come
  var canvas1 = document.getElementById('nextPiece');
  var nextPieceGrid = canvas1.getContext('2d');
  nextPieceGrid.fillStyle = 'white'; // white canvas (game board)
  nextPieceGrid.fillRect(0,0, canvas1.width, canvas1.height); // draws a rect and fills ot white
  nextPieceGrid.scale(20, 20);
  //---------------------------------------------------------------------------
  //
  var canvas2 = document.getElementById('storedPiece');
  var storedPieceGrid = canvas2.getContext('2d');
  storedPieceGrid.fillStyle = 'white'; // white canvas (game board)
  storedPieceGrid.fillRect(0,0, canvas2.width, canvas2.height); // draws a rect and fills ot white
  storedPieceGrid.scale(20, 20);

  tetrisGrid.scale(20, 20); // makes the canvas oixels bigger so we dont have to make a huge matrix for the arena
/*==============================Constants=====================================*/
  const arena = createMatrix(10, 20);

  const piece = { // object in JS
    pos: {x: 0, y :0},
    matrix: null, // current piece
    nextMatrix: null, // for next piece
    storedMatrix: null, // for shift
    score: 0,
  };
  // the values in the matrix will correspond to the index of the array of colors
  const colors = [null, 'cyan', 'orange' , 'blue', '#e1e600', 'green', 'red', 'purple']; // 0th index is null since values start at 1 so colors will start at 1th index
  // yellow is in code since it was too light on the white background
/*==============================Functions=====================================*/ // adds the pieces
  // draw the tetris pieces and the gameboard
  function drawMatrix(matrix, offset, Grid){ // offset used to move the block around // Grid used so i can use this function for both canvas
    matrix.forEach((row, y) => { // x and y here are the indexes
      row.forEach((value, x) => {
        if(value !== 0){
          Grid.fillStyle = colors[value];
          Grid.fillRect(x+offset.x, y+offset.y, 1, 1);
        }
      });
    });
  }
  /*--------------------------------------------------------------------------*/
  function drawStoredPiece(){
    storedPieceGrid.fillStyle = 'white'; // white canvas (game board)
    storedPieceGrid.fillRect(0,0, canvas2.width, canvas2.height); // draws a rect and fills ot white
    drawMatrix(piece.storedMatrix, {x: 1, y :1}, storedPieceGrid); // calls drawMatrix to draw piece
  }
  /*--------------------------------------------------------------------------*/
  function drawNextPiece(){
    nextPieceGrid.fillStyle = 'white'; // white canvas (game board)
    nextPieceGrid.fillRect(0,0, canvas1.width, canvas1.height); // draws a rect and fills ot white
    randomPiece();
    drawMatrix(piece.nextMatrix, {x: 1, y :1}, nextPieceGrid); // calls drawMatrix to draw piece
  }
  /*--------------------------------------------------------------------------*/
   /* draws the game board and pieces*/
  function drawPieces(){
    tetrisGrid.fillStyle = 'white'; // white canvas (game board)
    tetrisGrid.fillRect(0,0, canvas.width, canvas.height); // draws a rect and fills ot white
    drawMatrix(piece.matrix, piece.pos, tetrisGrid); // calls drawMatrix to draw piece
    drawMatrix(arena, {x:0, y:0}, tetrisGrid); // draw arena
  }
  /*--------------------------------------------------------------------------*/
  function createPiece(type){ // defines all matrixes for the pieces
    switch(type){
      case 'I':
        return [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ]; break;
      case 'L':
        return [
          [0, 0, 0],
          [2, 2, 2],
          [2, 0, 0]
        ]; break;
      case 'J':
        return [
          [0, 0, 0],
          [3, 3, 3],
          [0, 0, 3]
        ]; break;
      case 'O':
        return [
          [4, 4],
          [4, 4]
        ]; break;
      case 'S':
        return [
          [0, 0, 0],
          [0, 5, 5],
          [5, 5, 0]
        ]; break;
      case 'Z':
        return [
          [0, 0, 0],
          [6, 6, 0],
          [0, 6, 6]
        ]; break;
      case 'T':
        return [
          [0, 0, 0],
          [7, 7, 7],
          [0, 7, 0]
        ];
    } // end switch
  }
  /*--------------------------------------------------------------------------*/
  // gets a new random piece
  function randomPiece(){
    const pieceLetters = 'ILJOSZT'; //list each piece in string and we will refer to them with indexes
    piece.matrix = piece.nextMatrix;

    while(initPiece == 0){
      piece.matrix = createPiece(pieceLetters[pieceLetters.length * Math.random() | 0]); // "| 0" acts as a floor
      initPiece++;
    }

    piece.nextMatrix = createPiece(pieceLetters[pieceLetters.length * Math.random() | 0]); // "| 0" acts as a floor

  }
  /*--------------------------------------------------------------------------*/
  // places the random piece in the approiate position at the top of the grid
  function rePosition(){
    piece.pos.y = 0; // this and next line puts the next piece at the top centered
    piece.pos.x = ( (arena[0].length / 2) | 0) - ( (piece.matrix[0].length / 2) | 0);
  }
  /*--------------------------------------------------------------------------*/
  // drops the piece down based on dropInterval
  function pieceDrop(){
    piece.pos.y++;
    while(collision(arena, piece)){
      piece.pos.y--;
      merge(arena, piece);
      //piece.pos.y = 0; // resets the piece back at the top
      drawNextPiece();
      rePosition();
      shiftEnable = true;
      lineComplete();
      scoreUpdate();
      /*--------------------------------------------------------------------------*/
      // may want to revise this for a game over signal
      if(collision(arena, piece)){ // clears the game board if filled up to the top
        arena.forEach(row => {
          row.fill(0);
        });
        piece.score = 0; // reset the score if filled up to the top
        scoreUpdate(); // need to do this to show score
      }
    }
    dropCounter = 0; // reset the counter so block does not disappear from the screen (go down faster)
  }
  /*--------------------------------------------------------------------------*/
  // makes piece go down until it collides
  function quickDrop(){
    while( !(collision(arena, piece)) ){
      piece.pos.y++;
    }
    piece.pos.y--;
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
      // dropCounter = 0; // reset the counter so block does not disappear from the screen (go down faster)
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
  function lineComplete(){
    let rowCount = 1;
    for(let y = arena.length-1; y > 0; y--){
      if( !(arena[y].includes(0)) ){ // checks if row does not includes a 0 (all filled)
        arena.splice(y, 1); // removes the line with no zeros(filled)
        arena.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // addes empty row back to top
        ++y; // this is important since after the rows gets moved down, the index starts over at 19
             // without this filled rows may not get removed until the next piece
        piece.score += rowCount*100; // one row is worth 100 pts
        rowCount*=2; // double the row count for every row complete
      }
    }

  }
  /*--------------------------------------------------------------------------*/
  // writes the score to the page
  function scoreUpdate(){
    document.getElementById('score').innerText = piece.score;
  }
  /*--------------------------------------------------------------------------*/
  function store(){ // stores a piece when shift is pressed
    if(initStore == 0 && shiftEnable){ // first time always store the piece and give a new piece
      piece.storedMatrix = piece.matrix;
      drawStoredPiece();
      drawNextPiece();
      rePosition();
      shiftEnable = false;
      initStore++;
    } else{
      if(shiftEnable){
        let temp = piece.storedMatrix
        piece.storedMatrix = piece.matrix;
        piece.matrix = temp;
        drawStoredPiece();
        rePosition();
        shiftEnable = false;
      }
    }
  }
  /*--------------------------------------------------------------------------*/
  function start(){
    drawNextPiece(); // includes the random function
    rePosition();
    scoreUpdate();
    update();
  }
  /*--------------------------------------------------------------------------*/
  // controls piece movemnt as user presses the arrowkeys
  document.addEventListener('keydown', event => {
    //console.log(event); //used to see what the keycode is
    if(event.keyCode === 37){ // corresponds to arrow key LEFT
      pieceMove(-1) //piece.pos.x--;
    }else if (event.keyCode === 39) { // corresponds to arrow key RIGHT
      pieceMove(1) //piece.pos.x++;
    } else if(event.keyCode === 40){ // corresponds to arrow key DOWN
      pieceDrop();
    } else if (event.keyCode === 81 || event.keyCode === 90) { // Q and Z
      pieceRotate(-1);
    } else if (event.keyCode === 87 || event.keyCode === 88) { // W and X
      pieceRotate(1);
    } else if(event.keyCode === 38) {// corresponds to arrow key UP
      pieceRotate(-1);
    }else if(event.keyCode === 32) {// corresponds to space bar
      quickDrop();
    }else if(event.keyCode === 16) {// corresponds to SHIFT key
      store();
    }else if(event.keyCode === 13 && enterEnable) {// corresponds to ENTER
      enterEnable = false;
      start();
    }
  });





/*================================Notes=======================================*/
/*
process:
1. make the game board and test that (canvas)
2. make a piece and draw it onto the board
3. test the piece for movement (offset)
4.
*/
