const { Chatroom } = require("../models/chatroom");
const { User } = require("../models/user");
const OpenAI = require('openai');

// ChatGPT Usage: No
// Add message to database and send to OpenAI method if toggle is on
async function sendMessage(chatroomId, content, sourceUserId, learningSession){

    const chatroom = await Chatroom.findById(chatroomId);
    chatroom.messages.push({sourceUserId, content})
        
    if(learningSession){
        let openAIResponse = await openAIMessage(content)
        openAIResponse = "AI Assistant: " + openAIResponse;
        let id = "6541a9947cce981c74b03ecb";
        chatroom.messages.push({sourceUserId: id, content: openAIResponse})
        await chatroom.save();
        return { sourceUserId: id, content: openAIResponse };
    }

    await chatroom.save();

    return { sourceUserId: sourceUserId, content: content}; 
}

// ChatGPT Usage: No
// Get all chatrooms associated with a user
async function getChatrooms(userId){

    const user = await User.findById(userId);
    const chatroomIds = user.chatroomIDs;

    let chatrooms = [];

    for(let chatroomId of chatroomIds){
        const chatroom = await Chatroom.findById(chatroomId);
        const chatroomObj = chatroom.toObject();

        const otherUser = (chatroom.user1Id == userId) ? await User.findById(chatroom.user2Id) : await User.findById(chatroom.user1Id);
        
        chatroomObj.displayName = user.displayName;
        chatroomObj.otherUserName = otherUser.displayName;
        chatrooms.push(chatroomObj);
    }

    return chatrooms;
}

// ChatGPT Usage: No
// Get all chatrooms associated with a user
async function getMessages(chatroomId){
    const chatroom = await Chatroom.findById(chatroomId)
    return chatroom.messages;
}

// ChatGPT Usage: No
// Create a new chatroom with the newly matched users
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

// ChatGPT: Partial
// Sends the user message to OpenAI when the AI toggle is on
async function openAIMessage(message) {
    try{
        let formattedMessage = "Is the structure and grammar of this sentence correct: " + message;
        const openai = new OpenAI({
            apiKey: process.env.OPENAIKEY
        })
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant that helps people learn languages. Your goal is to correct grammar mistakes and provide helpful tips. If the structure and grammar is correct, you should say always say 'The grammar and sentence structure is correct.'. Whenever I send a message, you should only correct it and give tips OR say no comment." },
                { role: "user", content: "I like you to." },
                { role: "assistant", content: "The correct sentence is 'I like you too'." },
                { role: "user", content: "There are a lot of people here." },
                { role: "assistant", content: "The grammar and sentence structure is correct." },
                { role: "user", content: "Helo my name is Daniel" },
                { role: "assistant", content: "The correct sentence is 'Hello, my name is Daniel'." },
                { role: "user", content: formattedMessage },
        ],
            model: "gpt-3.5-turbo",
        });
    
        return completion.choices[0].message.content;
    }
    catch(error){
        console.log("Failed to receive message from OpenAI: ", error)
    }
 
}

module.exports = {sendMessage, getChatrooms, createChatroom, getMessages, openAIMessage};
