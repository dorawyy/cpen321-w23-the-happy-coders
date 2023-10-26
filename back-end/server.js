var express = require("express");
require('dotenv').config()

const {MongoClient} = require('mongodb');
const client = new MongoClient(process.env.DATABASE_URL);

const agoraTokenRoutes = require('./routes/agoraTokenRoutes');
const usersRoutes = require('./routes/usersRoutes');
const authenticationRoutes = require('./routes/authenticationRoutes');

var app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("LangSync");
})

//Routes
app.use('/agoraToken', agoraTokenRoutes);
app.use("/users", usersRoutes);
app.use("/authentication", authenticationRoutes)

async function run(){
    try{
        await client.connect();
        console.log("Connected to database");
        var server = app.listen(8081, (req, res) => {
            var host = server.address().address;
            var port = server.address().port;
            console.log("Server succesfully running at http://%s:%s", host, port);
        });
    }
    catch (err) {
        console.log(err);
        await client.close();
        
    }
}

run()