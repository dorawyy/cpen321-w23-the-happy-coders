var express = require("express");
require('dotenv').config()
var app = express();
const agoraTokenRoutes = require('./routes/agoraTokenRoutes');
const usersRoutes = require('./routes/usersRoutes');
const authenticationRoutes = require('./routes/authenticationRoutes');
const eventRoutes = require('./routes/eventRoutes');
const matchingRoutes = require('./routes/matchingRoutes');
const communicationRoutes = require('./routes/communicationRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const moderationRoutes = require('./routes/moderationRoutes');



app.use(express.json());

app.get("/", (req, res) => {
    res.send("LangSync");
})

// Routes
app.use('/agoraToken', agoraTokenRoutes);
app.use("/users", usersRoutes);
app.use("/authentication", authenticationRoutes);
app.use("/events", eventRoutes);
app.use("/matches", matchingRoutes);
app.use("/chatrooms", communicationRoutes);
app.use("/recommendations", recommendationRoutes);
app.use("/moderation", moderationRoutes);

module.exports = app;