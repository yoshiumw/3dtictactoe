to start: node server

in server.js:
1) Change var url = "your database url"
2) Change database = client.db('your database name')
3) Change the various database.collection('your collection name')

in socket.js
1) Change var socket = io.connect('the url you are running the server on')