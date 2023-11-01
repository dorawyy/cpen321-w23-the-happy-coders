const communicationService = require('../services/communicationService'); 

exports.sendMessage = async(req,res) =>{
    const chatroomId = req.params.id;

    const content = req.body.content;
    const sourceUserId = req.body.sourceUserId;
    const learningSession = req.body.learningSession;

    let messageStatus = await communicationService.sendMessage(chatroomId, content, sourceUserId, learningSession);

    return res.json({status: messageStatus});
}

exports.startLearningSession = async(req,res) =>{
    let conversationPrompts = await communicationService.startLearningSession();

    return res.json({conversationPrompts});
}

exports.getChatrooms = async(req,res) =>{
    const sourceUserId = req.params.userId;

    let chatrooms = await communicationService.getChatrooms(sourceUserId);

    return res.json({chatroomList: chatrooms});
}

