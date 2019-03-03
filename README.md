# 3dtictactoe

## Features

* 3D tic tac toe
* Log in regristration
* In-game messaging

## How to implement 3dtictactoe into your database.

Make the following changes in server.js:

1. Set the database's url
```
var url = "your database url"
```
2. Set the client database to your database 
```
database = client.db('your database name')
```

3. Set all database collections to your collection
```
database.collection('your collection name')
```

4. In socket.js change your connection to your server's url:
```
var socket = io.connect('the url you are running the server on')
```