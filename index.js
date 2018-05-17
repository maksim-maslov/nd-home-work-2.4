'use strict';

const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(3000, () => console.log('Server started on 3000 port'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendfile('index.html');
});

let numUsers = 0;

const adm = io.of('/admin');

adm.on('connection', socket => {
  console.log('admin connected');
});

io.on('connection', (socket) => {

  let addedUser = false;

  socket.on('new message', (data) => {

    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  socket.on('add user', (username) => {

    if (addedUser) {
      return;
    }

    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });

    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });

  });

  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });

});


