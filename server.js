const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
let users = {};
app.use(express.static(__dirname + '/client'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

io.on('connection', socket => {
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-left', users[socket.id]);
    console.log(users[socket.id] + ' disconnected');
    delete users[socket.id];
  });

  socket.on('chat-message', (msg, name) => {
    socket.broadcast.emit('chat-message', msg, name);
  });

  socket.on('user-joined', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });
});

http.listen(3000, () => {
  console.log('Server running on port 3000');
});
