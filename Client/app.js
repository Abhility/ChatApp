let socket = io();

function addMessage(chat, msg, name, me) {
  let element = document.createElement('DIV');
  element.innerHTML = name + ' : ' + msg;
  if (me) {
    element.classList.add('currentuser');
  } else {
    element.classList.add('otheruser');
  }
  chat.append(element);
}

function addUser(chat, name) {
  let user = document.createElement('DIV');
  user.innerHTML = name + ' joined';
  user.classList.add('user');
  chat.append(user);
}

function removeUser(chat, name) {
  let user = document.createElement('DIV');
  user.innerHTML = name + ' left';
  user.classList.add('user');
  chat.append(user);
}

let action = prompt('Please provide your name to chat');

if (action.trim() != '') {
  let sendButton = document.querySelector('#send');
  let message = document.querySelector('#message');
  let history = document.querySelector('.history');
  let user = document.createElement('DIV');
  addUser(history, 'You');
  socket.emit('user-joined', action);
  sendButton.addEventListener('click', e => {
    e.preventDefault();
    addMessage(history, message.value, 'You', true);
    socket.emit('chat-message', message.value, action);
    message.value = '';
  });
  socket.on('chat-message', (msg, name) => {
    addMessage(history, msg, name, false);
  });
  socket.on('user-joined', name => {
    addUser(history, name);
  });
  socket.on('user-left', name => {
    removeUser(history, name);
  });
} else {
  alert('Name is required to chat');
  location.reload();
}
