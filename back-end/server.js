var express = require("express");
require('dotenv').config()
const { default: mongoose } = require("mongoose");
var app = express();

// Reference: https://socket.io/get-started/chat
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);



const agoraTokenRoutes = require('./routes/agoraTokenRoutes');
const usersRoutes = require('./routes/usersRoutes');
const authenticationRoutes = require('./routes/authenticationRoutes');
const googleCalendarRoutes = require('./routes/googleCalendarRoutes');
const matchingRoutes = require('./routes/matchingRoutes');
const communicationRoutes = require('./routes/communicationRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');


app.use(express.json());

app.get("/", (req, res) => {
    res.send("LangSync");
})

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinChatroom', (roomId, userId) => {
        socket.userId = userId
        socket.join(roomId);
    });

    socket.on('leaveChatroom', (roomId) => {
        socket.leave(roomId);
    })

    socket.on('sendMessage', (roomId, message) => {
        const userId = socket.userId
        io.to(roomId).emit('message', {userId ,message});
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected.');
      });
});

//Routes
app.use('/agoraToken', agoraTokenRoutes);
app.use("/users", usersRoutes);
app.use("/authentication", authenticationRoutes)
app.use("/events", googleCalendarRoutes);
app.use("/matches", matchingRoutes)
app.use("/chatrooms", communicationRoutes)
app.use("/recommendations", recommendationRoutes)

async function run(){
    try{
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Connected to database");
        var server = app.listen(8081, (req, res) => {
            var host = server.address().address;
            var port = server.address().port;
            console.log("Server succesfully running at http://%s:%s", host, port);
        });
    }
    catch (err) {
        console.log(err);
        await mongoose.close();
        
    }
}

run()