//---------------------------- RUNS AT START OF GAME -------------------------------
function startGame() {
  document.turn = "X";
  //to determine who won the game
  document.winner = null;

  // to randomize who starts
  if (Math.random() < 0.5) {
    document.turn = "O";
  }

  setMessage(document.turn + " starts first!");
}


//--------------------------------- SETS THE MESSAGE -------------------------
function setMessage(msg) {
  document.getElementById('message').innerText = msg;
}



//---------------------------- PLAYING THE GAME -----------------------------

// Set the tile to X or O
function nextMove(tile) {

  // when the game is finished
  if (document.winner != null) {
    setMessage (document.winner + " already won the game");
  } else if (tile.innerText == "") {
    tile.innerText = document.turn;
    switchTurn();
  } else {
    setMessage("Invalid move. Try again!");
  }

}

// Switch turns
function switchTurn() {
  if (checkWinner(document.turn)) {
    setMessage("Congratulations, " + document.turn + "! You win!");
    document.winner = document.turn;
  } else if (document.turn == "X") {
    document.turn = "O";
    setMessage("It's " + document.turn + " turn!");
  } else {
    document.turn = "X";
    setMessage("It's " + document.turn + " turn!");
  }
}

//-------------------------------- ENDING THE GAME ------------------------------

function checkWinner(move) {
  var result = false;

  // checking table1 (single board wins)
  if (check(1, 2, 3, move) ||
      check(4, 5, 6, move) ||
      check(7, 8, 9, move) ||
      check(1, 4, 7, move) ||
      check(2, 5, 8, move) ||
      check(3, 6, 9, move) ||
      check(1, 5, 9, move) ||
      check(3, 5, 7, move)) {
        result = true;
      }

  //checking table2 (single board wins)
  if (check(10, 11, 12, move) ||
      check(13, 14, 15, move) ||
      check(16, 17, 18, move) ||
      check(10, 13, 16, move) ||
      check(11, 14, 17, move) ||
      check(12, 15, 18, move) ||
      check(10, 14, 18, move) ||
      check(12, 14, 16, move)) {
        result = true;
      }

  // checking table3 (single board wins)
  if (check(19, 20, 21, move) ||
      check(22, 23, 24, move) ||
      check(25, 26, 27, move) ||
      check(19, 22, 25, move) ||
      check(20, 23, 26, move) ||
      check(21, 24, 27, move) ||
      check(19, 23, 27, move) ||
      check(21, 23, 25, move)) {
        result = true;
      }

  // checking for vertical column
  if (check(1, 10, 19, move) ||
      check(4, 13, 22, move) ||
      check(7, 16, 25, move) ||
      check(2, 11, 20, move) ||
      check(5, 14, 23, move) ||
      check(8, 17, 26, move) ||
      check(3, 12, 21, move) ||
      check(6, 15, 24, move) ||
      check(9, 18, 27, move)) {
        result = true;
      }

  // checking for diagonal win across all boards
  if (check(1, 11, 21, move) ||
      check(1, 13, 25, move) ||
      check(3, 11, 19, move) ||
      check(3, 15, 27, move) ||
      check(7, 13, 19, move) ||
      check(7, 17, 27, move) ||
      check(9, 17, 25, move) ||
      check(9, 15, 21, move) ||
      check(1, 14, 27, move) ||
      check(2, 14, 26, move) ||
      check(3, 14, 25, move) ||
      check(4, 14, 24, move) ||
      check(6, 14, 22, move) ||
      check(7, 14, 21, move) ||
      check(8, 14, 20, move) ||
      check(9, 14, 19, move)) {
        result = true;
      }

  return result;
}

function check(a, b, c, move) {
  var result = false;
  // check there is 3 in a row
  if (getBox(a) == move && getBox(b) == move && getBox(c) == move) {
    result = true;
  }
  return result;
}

// retrieve the move at the tile
function getBox(number) {
  return document.getElementById(number).innerText;
}

//--------------------- SOCKET.IO --------------------------------------------

//make connection
var socket = io.connect('http://localhost:3000');
