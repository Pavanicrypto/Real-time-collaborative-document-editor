const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let documentContent = ''; // In-memory storage of document content

app.use(express.static('public')); // Serve static files from the 'public' directory

io.on('connection', (socket) => {
    console.log('A user connected');

    // Send the current document content to the newly connected user
    socket.emit('documentUpdated', documentContent);

    // Listen for document changes
    socket.on('documentChange', (content) => {
        documentContent = content; // Update the in-memory document content
        socket.broadcast.emit('documentUpdated', content); // Broadcast updated content to other users
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});