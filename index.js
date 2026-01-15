const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io'); // Import de Server-class

// Initialiseer Socket.IO met de Server-class
const io = new Server(http, {
    cors: {
        origin: "*", // Sta alle origins toe (pas aan voor productie)
        methods: ["GET", "POST"]
    }
});

// Luister naar verbindingen
io.on('connection', (socket) => {
    console.log('Een client is verbonden:', socket.id);

    socket.on('messageFromBrowser', (data) => {
        console.log('Bericht van browser:', data);
        io.emit('messageToUnity', data); // Doorsturen naar Unity
    });

    socket.on('disconnect', () => {
        console.log('Client ontkoppeld:', socket.id);
    });
});

http.listen(3000, () => {
    console.log('Socket.IO-server draait op poort 3000');
});
