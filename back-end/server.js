var express = require("express");
require('dotenv').config()
const { default: mongoose } = require("mongoose");
var app = express();

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

const agoraTokenRoutes = require('./routes/agoraTokenRoutes');
const usersRoutes = require('./routes/usersRoutes');
const authenticationRoutes = require('./routes/authenticationRoutes');
const googleCalendarRoutes = require('./routes/googleCalendarRoutes');
const matchingRoutes = require('./routes/matchingRoutes');
const communicationRoutes = require('./routes/communicationRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const moderationRoutes = require('./routes/moderationRoutes');

app.use(express.json());

app.get("/", (req, res) => {
    res.send("LangSync");
})

// ChatGPT Usage: Partial
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinChatroom', (roomId, userId) => {
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
});

// Routes
app.use('/agoraToken', agoraTokenRoutes);
app.use("/users", usersRoutes);
app.use("/authentication", authenticationRoutes);
app.use("/events", googleCalendarRoutes);
app.use("/matches", matchingRoutes);
app.use("/chatrooms", communicationRoutes);
app.use("/recommendations", recommendationRoutes);
app.use("/moderation", moderationRoutes);

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
        try {
            await mongoose.disconnect();
            process.exit(0); // Exit the process after disconnecting
        } catch (err) {
            console.error('Error during disconnection:', err);
            process.exit(1); // Exit with an error code
        }
    });
}

run();
module.exports = app;