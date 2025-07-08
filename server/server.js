// server/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const users = {}; // Track users by socket.id

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Set and store the user's name
  socket.on('set username', (username) => {
    users[socket.id] = username;

    // Notify others that a user joined
    socket.broadcast.emit('notification', {
      type: 'join',
      username,
      timestamp: new Date().toISOString(),
    });

    // Send updated user list to all clients
    io.emit('user list', Object.entries(users).map(([id, name]) => ({ id, name })));
  });

  // Handle global chat messages
  socket.on('chat message', (data) => {
    io.emit('chat message', {
      username: data.username,
      message: data.message,
      timestamp: new Date().toISOString(),
    });
  });

  // Handle private messaging
  socket.on('private message', ({ to, from, message }) => {
    io.to(to).emit('private message', {
      from,
      message,
      timestamp: new Date().toISOString(),
    });
  });

  // Typing indicators
  socket.on('typing', (username) => {
    socket.broadcast.emit('typing', username);
  });

  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing');
  });

  // Handle message reactions
  socket.on('message reaction', ({ messageId, emoji, username }) => {
    io.emit('message reaction', {
      messageId,
      emoji,
      username,
    });
  });

  // Cleanup on disconnect
  socket.on('disconnect', () => {
    const username = users[socket.id];
    console.log(`User disconnected: ${socket.id}`);

    // Notify others the user left
    socket.broadcast.emit('notification', {
      type: 'leave',
      username,
      timestamp: new Date().toISOString(),
    });

    delete users[socket.id];

    // Update user list for all clients
    io.emit('user list', Object.entries(users).map(([id, name]) => ({ id, name })));
  });
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
