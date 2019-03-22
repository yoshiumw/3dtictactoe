# 3dtictactoe
## Description
A 3D Tic Tac Toe game that authenticates users with a  log-in / registration system.
Utilizes WebSockets to provide real time gameplay and messaging.

## Features
* 3D tic tac toe
* Log in registration
* In-game messaging

## Installation

Clone the directory using git or download from [here.](https://github.com/yoshiumw/3dtictactoe/archive/master.zip)

## Usage
To use 3dtictactoe with your database, you will need to make the following changes in server.js
- Set the database's url
```
var url = "your database url"
```
- Set the client database to your database 
```
database = client.db('your database name')
```

- Set all database collections to your collection
```
database.collection('your collection name')
```

- In socket.js change your connection to your server's url:
```
var socket = io.connect('your server url')
```

## Credits

Made by Yo Shium Wong and Nicole Wong
