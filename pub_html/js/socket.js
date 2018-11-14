//Make connection
//var socket = io.connect('http://127.0.0.1:14578/'); 
var socket = io({transports: ['websocket']}); //azure

  $("#dcBtn").click(function(){
  	console.log('this socket id will be closed ' + socket.id);
  	socket.disconnect();
  });

  $("#gameDc").click(function(){
      console.log(socket.id + "is quitting");
      socket.emit('quit', {socid: socket.id});
  });

  $("#chatform").submit(function() {
    socket.emit('chat message', $("#m").val());
    $("#m").val('');
    return false;
  });

  socket.on('chat message', function(msg){
    $("#messages").append($('<li>').text(msg));
  });

  $('#joinBtn').click(function(){
  	console.log('joining');
  	var turn = "X";
  	var currentTurn = true;
	// to randomize who starts
	if (Math.random() < 0.5) {
	   turn = "O";
	   currentTurn = false;
	}
	console.log("join turn: " + turn);
  	socket.emit('join', {socid: socket.id, player: turn, current: currentTurn});
  });

  // $('#test').click(function(){
  // 	console.log('test working');
  // 	socket.emit('replace');
  // })

 $('.board').on('click', 'button', function(){
  	//$(this).html('x');
  	console.log('onclick:' + this.id);
  	console.log('html: ' +  this.innerHTML);
  	if(currentTurn) {
  		document.getElementById("message").innerHTML = "Your turn!";
	  	if(this.innerHTML == ' '){
	  		socket.emit('replace', {btnid: this.id, socid: socket.id, turn: turn, curr: currentTurn});
	  	}
	} else {
		document.getElementById("message").innerHTML = "Not your turn!";
	}
  });

  socket.on('connectToRoom',function(data) {
         document.body.innerHTML = '';
         document.write(data.board);
         var headHTML = document.getElementsByTagName('head')[0].innerHTML;
         headHTML    += '<link rel ="stylesheet" href="./css/style.css"/>';
         document.getElementsByTagName('head')[0].innerHTML = headHTML;
         // turn = data.playerturn;
         // console.log(turn);
 });

  socket.on('btreplace', function(data) {
  	//console.log('btreplace' + data + ' ' + turn);
    if(currentTurn) {
      currentTurn = false;
    } else {
      currentTurn = true;
    }
  	$('#' + data.btnid).html(data.turn);
    if (checkWinner(data.turn)) {
      console.log(data.name);
      socket.emit('winner', {name: data.email});
      // document.body.innerHTML = data.name + ' has won, game lasted '+ data.count +' moves. (Game started @ ' + data.date + ')';
      var b = document.body.innerHTML;
      document.body.innerHTML = data.name + ' has won, game lasted '+ data.count +' moves. (Game started @ ' + data.date + ')' + ` <form action="home" method = "post">
    <input type="submit" value="CLICK HERE TO RETURN TO MAIN MENU" id="dcBtn"/>
  </form>` + b ;
    }
  });

  socket.on('ff', function(data){
    document.body.innerHTML = 'The opposing player has forfeited.' + ` <form action="home" method = "post">
    <input type="submit" value="CLICK HERE TO RETURN TO MAIN MENU" id="dcBtn"/>`;
  });

  socket.on('playerturn', function(data) {
  		turn = data.playerturn;
  		currentTurn = data.current;
  		console.log('p2: ' + turn);
  });

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


function getBox(number) {
  return document.getElementById(number).innerText;
}
