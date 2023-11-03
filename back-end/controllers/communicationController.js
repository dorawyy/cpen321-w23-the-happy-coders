const communicationService = require('../services/communicationService'); 

// ChatGPT Usage: No
exports.sendMessage = async(req,res) =>{
    try{
        const chatroomId = req.params.id;
        const content = req.body.content;
        const sourceUserId = req.body.sourceUserId;
        const learningSession = req.body.learningSession;
    
        let message = await communicationService.sendMessage(chatroomId, content, sourceUserId, learningSession);
    
        return res.status(200).json({message});
    }
    catch(err){
        return res.status(500).json({error: "Error sending message"});
    }
}

// ChatGPT Usage: No
exports.getChatrooms = async(req,res) =>{
    try{
        const sourceUserId = req.params.userId;
        let chatrooms = await communicationService.getChatrooms(sourceUserId);
        return res.status(200).json({chatroomList: chatrooms});
    }
    catch(err){
        return res.status(500).json({error: "Error getting chatrooms"});
    }
   
}

// ChatGPT Usage: No
exports.getMessages = async(req,res) =>{
    try{
        const chatroomId = req.params.cid;
        let messagesList = await communicationService.getMessages(chatroomId);
        return res.json({messages: messagesList});
    }
    catch(err){
        return res.status(500).json({error: "Error getting chatrooms"});
    }
}

