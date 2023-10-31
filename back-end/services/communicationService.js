const { Chatroom } = require("../models/chatroom");
const { User } = require("../models/user");

// Add message to database
async function sendMessage(chatroomId, content, sourceUserId){
    const chatroom = await Chatroom.findById(chatroomId);
    chatroom.messages.push({sourceUserId, content})
    await chatroom.save();
    return true;
}

// Get all chatrooms associated with a user
async function getChatrooms(userId){
    const user = await User.findById(userId)
    const chatroomIds = user.chatroomIDs

    let chatrooms = []

    for(let chatroomId of chatroomIds){
        const chatroom = await Chatroom.findById(chatroomId)
        const chatroomObj = chatroom.toObject()

        const otherUser = (chatroom.user1Id == userId) ? await User.findById(chatroom.user2Id) : await User.findById(chatroom.user1Id)
        
        chatroomObj.displayName = user.displayName
        chatroomObj.otherUserName = otherUser.displayName
        console.log(chatroomObj)
        chatrooms.push(chatroomObj)
    }

    return chatrooms
}

// Get all chatrooms associated with a user
async function getMessages(chatroomId){
    const chatroom = await Chatroom.findById(chatroomId)

    return chatroom.messages;
}

// Create a new chatroom
async function createChatroom(user1Id, user2Id){
    const user1 = await User.findById(user1Id)
    const user2 = await User.findById(user2Id)

    const chatroom = await Chatroom.create({
        messages: [],
        user1Id: user1Id,
        user2Id: user2Id
    })

    user1.chatroomIDs.push(chatroom._id)
    user2.chatroomIDs.push(chatroom._id)

    await user1.save()
    await user2.save()

    return chatroom._id
}

module.exports = {sendMessage, getChatrooms, createChatroom, getMessages};
