var express = require('express');
var app = express();
var serverIndex = require('serve-index');
var http = require('http');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var database;
var collection;
var socket = require('socket.io');

var port = process.env.PORT || 14578;
var users = [];


//--------------------- HEADER -------------------------------------
var head = `<!DOCTYPE html>

<!DOCTYPE html>
<html>

<head>

    <meta name="viewport" content="minimum-scale=1.0, width=device-width, maximum-scale=1.0, user-scalable=no"/>
    <meta charset="utf-8">

    <title>Yo Shium and Nicole Wong</title>

     <link rel="stylesheet" href="./css/stylefive.css"/>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <script src = "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.0/socket.io.js"></script>

</head>`

var _head = `  </body>
</html>`;


//---------------------- SERVER --------------------------------------------
/
var url = "mongodb://root:1234@ds119129.mlab.com:19129/tes"; 
//connect to mongodb
MongoClient.connect(url, function(err, client){
  if (err) console.log(err);
  database = client.db('tes') // use
});

// parsing body
app.use(express.json());
app.use(express.urlencoded( { extended:false} ));

var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm','html'],
  index: "login.html"
}

app.use('/', function(req,res,next){
  console.log(req.method, 'request:', req.url, JSON.stringify(req.body));
  next();
});

var server = app.listen(port, function(){
  console.log('listening on port ' + port);
});

app.use('/', express.static('./pub_html', options));
//app.use('/files', serverIndex('pub_html/files', {'icons': true}));

app.post('/home', function(req,res,next){
  setTimeout(function(){
  res.redirect('/login.html');
},300);

});
var nom;
var emale;

app.post('/login', function(req,res,next){
  var loginsuccess = false;
  var wins;
  var losses;


  database.collection("asn5").findOne({email : req.body.name}, function(err, result){
    if (result != null){
      if(result.pass == req.body.pass){
        console.log(result.email + " " + result.pass);
        loginsuccess = true;
        wins = result.win;
        nom = result.fname + " " +  result.lname;
        emale = result.email;
        console.log(wins);
        losses = result.loss;
        console.log(losses);
        console.log("Login Successful");
      }
    }
  });

  //-------------------REDIRECT TO GAME PAGE FROM HERE--------------------------------------------------
  setTimeout(function(){
    if(loginsuccess){ //if login works go in
      var form = `<body>
  <div class = "container" id= "head">
      <div class = "row">
        <div class = "col-12">
          <h1 class = "text-center">Hello ` + nom +  `</h1>
        </div>
      </div>
    </div>

    <div class = "container" id= "stats">
      <div class = "row">
        <div class = "col-12">
          <h1 class = "text-center">Your stats thus far: </h1>
          <p class = "text-center">`   + wins + `W /` + losses +   `L</p>
        </div>
      </div>
    </div>

    <div class = "container" id = "boutons">
      <div class = "row">
        <div class = "col-12">
          <div class = "text-center">
              <button type="button" class="btn btn-primary" id = "joinBtn">Join a Game</button>
              <form action="home" method = "post">
                <input type="submit" value="Log-out" class="btn btn-warning btn-md" id="dcBtn"/>
              </form>
          </div>
          </div>
      </div>
    </div>

    <script src="./js/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>

<script src="./js/script.js"></script>
<script src="./js/socket.js"></script>
    `
      form = head + form + _head;
      res.end(form);
    } else { //if login fails
      res.send("Invalid e-mail or password");
    }
  }, 500);
});

app.post('/register', function(req,res,next){
  var reg_fn = req.body.fname;
  var reg_ln = req.body.lname;
  var reg_age = req.body.age;
  var reg_pass = req.body.pass;
  var reg_gen = req.body.gender;
  var reg_em = req.body.email;
  var exist = false;
  var message;

  database.collection("asn5").findOne({email : req.body.email}, function(err, result){
    if(result != null){
      exist = true;
    }
  });

  //database.collection('asn5').update({_id: "5ac89721efeb850c644053a5"}, {$push: {users: req.body}});
  setTimeout(function(){
    if(!exist){
      database.collection('asn5').insert({fname: reg_fn, lname: reg_ln, pass: reg_pass, age: reg_age, gender: reg_gen, email: reg_em, win: 0, loss: 0});
      message = 'Thanks for registering '+ reg_fn + ' ' + reg_ln + '!';
      res.send(message);
    } else {
      message = reg_em + " exists already."
      res.send(message);
    }
  }, 500);
});

//----------------------------- SOCKET.IO ------------------------------------

var first;
var date;
var count = 0;
var onlines;

//Socket setup
var io = socket(server);
var roomno = 1;
io.on('connection', function(socket){
  console.log('a user connected');
  //console.log('id: ' + socket.id);
  socket.name = nom;
  socket.email = emale;
  database.collection('asn5').update({email: socket.email}, {$set: {socid: socket.id} });
  //database.collection('asn5').update({email : data.name}, {$inc : {win: 0.5}});
  console.log('id updated in mongodb');
  //console.log(socket.name);
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('join', function(data){
    //console.log('in join');
    if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1) roomno++;
    socket.join("room-"+roomno);
    var board = `
<h1 id = "welcome"> Welcome to 3D Tic Tac Toe! </h1>
<div id="message"> </div>
<br>
<div class = "howto">
  <h1> HOW TO PLAY </h1>
  <p> 1. The first turn is randomly chosen. <br>
      2. The game will alternate turns until there is a winner. <br>
      3. If any player decides to quit at anytime, it counts as a lost. <br>
      4. There are three different ways of winning: <br>
      - 3 pieces in a row that are horizontal, vertical, or diagonal on a single board <br>
      - vertically in a column through all the boards <br>
      - diagonal line though all the boards <br>
      <br>
      HAVE FUN!
  </p>
</div>

<div class = 'board'>
  <button id = '1'> </button>
  <button id = '2'> </button>
  <button id = '3'> </button>
  <br>
  <button id = '4'> </button>
  <button id = '5'> </button>
  <button id = '6'> </button>
  <br>
  <button id = '7'> </button>
  <button id = '8'> </button>
  <button id = '9'> </button>
  <br>
  <br>
  <button id = '10'> </button>
  <button id = '11'> </button>
  <button id = '12'> </button>
  <br>
  <button id = '13'> </button>
  <button id = '14'> </button>
  <button id = '15'> </button>
  <br>
  <button id = '16'> </button>
  <button id = '17'> </button>
  <button id = '18'> </button>
  <br>
  <br>
  <button id = '19'> </button>
  <button id = '20'> </button>
  <button id = '21'> </button>
  <br>
  <button id = '22'> </button>
  <button id = '23'> </button>
  <button id = '24'> </button>
  <br>
  <button id = '25'> </button>
  <button id = '26'> </button>
  <button id = '27'> </button>
  <br>
  <br>
  <form action="home" method = "post">
    <input type="submit" value="Quit" id="gameDc"/>
  </form>
</div>

<div class = "example">
  <h4> Example: </h4>
  <img src="example.png" width="200" height="200">
</div>

<div class ="chat">
  <ul id="messages"></ul>
  <form id="chatform" action="">
    <input id="m" autocomplete="off" /><button id="chatsend">Send</button>
  </form>
</div>

<script src="./js/socket.js"></script>`;

   //Send this event to everyone in the room.
   
    var turnd;
    var curr;
    if (io.nsps['/'].adapter.rooms["room-"+roomno].length == 1){
      var wait = `<h1 id = "welcome"> Waiting on other player! </h1>`;
      io.sockets.in("room-"+roomno).emit('connectToRoom', {board: wait});
      first = data.player;
      date = new Date();
      //console.log('1st' + first);
    }
    if (io.nsps['/'].adapter.rooms["room-"+roomno].length == 2) {
      io.sockets.in("room-"+roomno).emit('connectToRoom', {board: board});
      io.of('/').in("room-"+roomno).clients((error,clients) => {
        if(error) throw error;
        //console.log(clients);
        onlines = clients;
        var i;
        for(i = 0; i < onlines.length; i++){
          console.log(onlines[i]);
        }
      });

      //console.log('first ' + first);
      if (first == 'X'){
        turnd = 'O';
        curr = false;
      }  else {
        turnd = 'X';
        curr = true;
      }
      socket.emit('playerturn', {playerturn: turnd, current: curr});
    } else {
      socket.emit('playerturn', {playerturn: data.player, current: data.current});
    }




  });

  socket.on('replace', function(data){
    count++;
    console.log(data.socid + ' clicked ' + data.btnid);
    io.sockets.in("room-"+roomno).emit('btreplace', {btnid: data.btnid, turn: data.turn, date: date, count: count, name: socket.name, email: socket.email});
  });

  socket.on('winner', function(data){
    console.log('winner b4 update: ' + data.name)
    count = 0;
    var k;
    var tempid;
    for(k = 0; k < onlines.length; k++){
      if(socket.id != onlines[k]){
        tempid = onlines[k];
        database.collection('asn5').update({socid : tempid}, {$inc : {loss: 1.0}});
      }
    }

    database.collection('asn5').update({email : data.name}, {$inc : {win: 0.5}});
    console.log('updated wins');
    onlines = [];
    io.sockets.in("room-"+roomno).emit('btreplace', {btnid: data.btnid, turn: data.turn, date: date, count: count, name: socket.name});
  });

  socket.on('quit', function(data){
        database.collection('asn5').update({socid: data.socid}, {$inc: {loss: 1}});
        console.log(data.socid + ' loss increased');
        onlines = [];
        io.sockets.in("room-"+roomno).emit('ff');
  });

//---------------------------- CHAT -------------------------------------------
  socket.on('chat message', function(msg) {
    io.sockets.in("room-"+roomno).emit('chat message', msg);
  });
});

