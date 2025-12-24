const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static(path.join(__dirname)));

// Store comments in memory
let comments = [];

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send existing comments
  socket.emit('load-comments', comments);

  // Listen for new comments
  socket.on('send-comment', (comment) => {
    const cleanComment = comment.trim().substring(0, 200);
    if (cleanComment) {
      comments.push(cleanComment);
      if (comments.length > 50) {
        comments.shift();
      }
      io.emit('new-comment', cleanComment);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});