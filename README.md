# 3dtictactoe
## Description
A 3D Tic Tac Toe game that authenticates users with a login and registration system.
Utilizes WebSockets to provide real time gameplay and messaging.

## Features
* 3D tic tac toe
* Log in registration
* In-game messaging

## Installation

Clone the directory using Git or download from [here.](https://github.com/yoshiumw/3dtictactoe/archive/master.zip)

## Usage
To use 3dtictactoe with your database, you will need to make the following changes in the server.js file
- Set the database's URL
```
var url = "your database URL"
```
- Set the client database to your database 
```
database = client.db('your database name')
```

- Set all database collections to your collection
```
database.collection('your collection name')
```

- In socket.js change your connection to your server's URL:
```
var socket = io.connect('your server url')
```

## Credits

Made by Yo Shium Wong and Nicole Wong
