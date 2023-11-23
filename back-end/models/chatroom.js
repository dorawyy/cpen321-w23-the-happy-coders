// ChatGPT Usage: Partial
const mongoose = require('mongoose');

const chatroomSchema = new mongoose.Schema({
    messages: [
        {
            sourceUserId: String,
            content: String,
        }
    ],
    user1Id: String,
    user2Id: String    
});

const Chatroom = mongoose.model('Chatroom', chatroomSchema);

module.exports = {Chatroom};
