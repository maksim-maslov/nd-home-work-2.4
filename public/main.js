'use strict';

let username;
let connected = false;
let typing = false;

let socket = io();
const admSocket = io('/admin');

const loginInput = document.querySelector('.loginInput');
const chatInput = document.querySelector('.chatInput');
const nameInput = document.querySelector('.usernameInput');
const messageInput = document.querySelector('.messageInput');
const ul = document.querySelector('.messages');

nameInput.addEventListener('change', setUserName);
messageInput.addEventListener('change', sendMessage);

function addParticipantsMessage(data) {
  let message = '';
  if (data.numUsers === 1) {
  message += 'there 1 participant';
  } else {
  message += `there are ${data.numUsers} participant`;
  }
  log(message);
}

function setUserName(ev) {
  username = ev.target.value;
  ev.target.value = '';
  loginInput.classList.add('hide');
  chatInput.classList.remove('hide');
  socket.emit('add user', username);
}

function sendMessage(ev) {
  const messageText = ev.target.value;
  if (messageText && connected) {
  ev.target.value = '';
  addChatMessage({
    username: username,
    message: messageText
  });
  socket.emit('new message', messageText);  
  }  
}

function log(message) {
  const li = document.createElement('li');
  li.textContent = message;
  ul.appendChild(li);  
}

function addChatMessage(data, options) {
  const li = document.createElement('li');
  li.textContent = `${data.username}: `;
  ul.appendChild(li);
  const span = document.createElement('span');
  span.textContent = data.message;
  li.appendChild(span);
}

socket.on('login', (data) => {
  connected = true;
  const message = "Welcome to Socket.IO Chat -";
  log(message);
});

socket.on('new message', (data) => {
  addChatMessage(data);
});

socket.on('user joined', (data) => {
  log(`${data.username} joined`);
});

socket.on('user left', (data) => {
  log(`${data.username} left`);
});

socket.on('disconnect', () => {
  console.log('you have been disconnected');
});

socket.on('reconnect', () => {
  console.log('you have been reconnected');
  if (username) {
  socket.emit('add user', username);
  }
});

socket.on('reconnected error', () => {
  console.log('attempt to reconnect has failed');
});

