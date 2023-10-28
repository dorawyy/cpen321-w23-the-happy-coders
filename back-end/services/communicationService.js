const { Chatroom } = require("../models/chatroom");
const { User } = require("../models/user");

// Add message to database
async function sendMessage(chatroomId, content, sourceUserId){
    const chatroom = await Chatroom.findById(chatroomId);
    chatroom.messages.push({sourceUserId, content})

    chatroom.save();
    return true;
}


async function getChatrooms(userId){
    const user = await User.findById(userId)
    const chatroomIds = user.chatroomIds

    let chatrooms = []

    for(let chatroomId of chatroomIds){
        const chatroom = await Chatroom.findById(chatroomId)
        chatrooms.push(chatroom)
    }

    return chatrooms
}

async function createChatroom(user1Id, user2Id){
    const user1 = await User.findById(user1Id)
    const user2 = await User.findById(user2Id)

    Chatroom.create()
}