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

    // Relay berichten van de browser naar Unity
    socket.on('messageFromBrowser', (data) => {
        console.log('Bericht van browser:', data);
        io.emit('messageToUnity', data); // Doorsturen naar Unity
        console.log('Bericht doorgestuurd naar Unity:', data);
    });

    socket.on('disconnect', () => {
        console.log('Client ontkoppeld:', socket.id);
    });
});

// Eenvoudige route om te bevestigen dat de server draait
app.get('/', (req, res) => {
    res.send('<h1>Socket.IO-server is actief and listening for new connections.</h1>');
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`Socket.IO-server draait op poort ${port}`);
});
