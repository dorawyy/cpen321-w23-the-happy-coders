var express = require("express");
require('dotenv').config()
const { default: mongoose } = require("mongoose");

const agoraTokenRoutes = require('./routes/agoraTokenRoutes');
const usersRoutes = require('./routes/usersRoutes');
const authenticationRoutes = require('./routes/authenticationRoutes');
const googleCalendarRoutes = require('./routes/googleCalendarRoutes');

var app = express();

require('dotenv').config()
const { default: mongoose } = require("mongoose");

const agoraTokenRoutes = require('./routes/agoraTokenRoutes');
const usersRoutes = require('./routes/usersRoutes');
const authenticationRoutes = require('./routes/authenticationRoutes');
const googleCalendarRoutes = require('./routes/googleCalendarRoutes');
const matchingRoutes = require('./routes/matchingRoutes');


app.use(express.json());

app.get("/", (req, res) => {
    res.send("LangSync");
})

//Routes
app.use('/agoraToken', agoraTokenRoutes);
app.use("/users", usersRoutes);
app.use("/authentication", authenticationRoutes)
app.use("/googleCalendar", googleCalendarRoutes);
app.use("/matches", matchingRoutes)

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