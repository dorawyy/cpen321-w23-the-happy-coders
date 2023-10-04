var express = require("express");

var app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("LangSync");
})

async function run(){
    app.listen(8081)
}

run()