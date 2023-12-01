require('dotenv').config()
const { default: mongoose } = require("mongoose");
const app = require('./app');

// Reference: https://socket.io/get-started/chat
const http = require('http');
const https = require('https'); 
const fs = require('fs'); 
const server = http.createServer(app);

const options = {
  key: fs.readFileSync('privkey.pem'), 
  cert: fs.readFileSync('fullchain.pem'),
};

const secureServer = https.createServer(options, app); // Create an HTTPS server

const { Server } = require("socket.io");
const io = new Server(secureServer); 

// ChatGPT Usage: Partial
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinChatroom', (roomId, userId) => {
        console.log("joining chatroom");
        socket.userId = userId
        socket.join(roomId);
    });

    socket.on('leaveChatroom', (roomId) => {
        socket.leave(roomId);
    })

    socket.on('sendMessage', (roomId, userId ,message) => {
        console.log("sending message");
        io.to(roomId).emit('message', { userId, message });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });

    socket.on('typing', (roomId, userId) => {
        console.log("typing");
        socket.to(roomId).emit('typing', userId);
    });

    socket.on('openAIStart', (roomId) => {
        socket.to(roomId).emit('openAIStart', userId);
    });
});

async function run() {
    let host;
    let port;
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Connected to the database");
        server.listen(8081, (req, res) => { // Use port 8081 for HTTP
            host = server.address().address;
            port = server.address().port;
            console.log("Server successfully running at http://%s:%s", host, port);
        });

        secureServer.listen(443, () => { // Use port 443 for HTTPS
            host = secureServer.address().address;
            port = secureServer.address().port;
            console.log("Secure server successfully running at https://%s:%s", host, port);
        });
    } catch (err) {
        console.log(err);
        await mongoose.disconnect(); // Close the connection on error
    }

    // Handling the closing of the connection on process termination (Ctrl+C)
    process.on('SIGINT', async () => {
        // Close the connection to the database
        try {
            await mongoose.disconnect();
        } catch (err) {
            throw new Error("Error while closing the connection to the database");
        }
    });
}

run();
module.exports = app;