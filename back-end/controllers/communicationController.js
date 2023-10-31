const communicationService = require('../services/communicationService'); 

exports.sendMessage = async(req,res) =>{
    const chatroomId = req.params.id;

    const content = req.body.content;
    const sourceUserId = req.body.sourceUserId;

    let messageStatus = communicationService.sendMessage(chatroomId, content, sourceUserId);

    return res.json({status: messageStatus});
}

exports.getChatrooms = async(req,res) =>{
    const sourceUserId = req.params.userId;

    let chatrooms = await communicationService.getChatrooms(sourceUserId);

    return res.json({chatroomList: chatrooms});
}
