const communicationService = require('../services/communicationService'); 

// ChatGPT Usage: No
exports.sendMessage = async(req,res) =>{
    const chatroomId = req.params.id;

    const content = req.body.content;
    const sourceUserId = req.body.sourceUserId;
    const learningSession = req.body.learningSession;

    let message = await communicationService.sendMessage(chatroomId, content, sourceUserId, learningSession);

    return res.json({message});
}

// ChatGPT Usage: No
exports.getChatrooms = async(req,res) =>{
    const sourceUserId = req.params.userId;

    let chatrooms = await communicationService.getChatrooms(sourceUserId);

    return res.json({chatroomList: chatrooms});
}

// ChatGPT Usage: No
exports.getMessages = async(req,res) =>{
    const chatroomId = req.params.cid;

    let messagesList = await communicationService.getMessages(chatroomId);

    return res.json({messages: messagesList});
}

