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

app.get('/', (req, res) => {
    res.send('<h1>Socket.IO-server is actief and listening for new connections.</h1>' +
        '<p>Create index.html with this code and open it in a browser.' +
        'It will then connect to it </p>' +
        '<!DOCTYPE html>\n' +
        '<html lang="en">\n' +
        '<head>\n' +
        '    <meta charset="UTF-8">\n' +
        '    <title>Title</title>\n' +
        '</head>\n' +
        '<body>\n' +
        'Welcome to the Socket.IO Unity Browser Client Example!\n' +
        '\n' +
        '<script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>\n' +
        '<script>\n' +
        '    const socket = io(\'https://socket-unity-test.onrender.com\');\n' +
        '\n' +
        '    socket.on(\'connect\', () => {\n' +
        '        console.log(\'Connected to server as browser client\');\n' +
        '    });\n' +
        '\n' +
        '    socket.on(\'messageToBrowser\', (data) => {\n' +
        '        console.log(\'Message from Unity:\', data);\n' +
        '    });\n' +
        '\n' +
        '    // Send a message to Unity via the server\n' +
        '    function sendMessageToUnity() {\n' +
        '        socket.emit(\'messageFromBrowser\', {text: \'Hello from browser!\'});\n' +
        '    }\n' +
        '</script>\n' +
        '<button onclick="sendMessageToUnity()">Send to Unity</button>\n' +
        '\n' +
        '</body>\n' +
        '</html>\n');

});

const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`Socket.IO-server draait op poort ${port}`);
});
