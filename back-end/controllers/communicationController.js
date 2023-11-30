const communicationService = require('../services/communicationService'); 
const authenticationService = require('../services/authenticationService');
// ChatGPT Usage: No
exports.sendMessage = async(req,res) =>{
    let message;
    console.log(req.body)
    console.log("sending message")
    try{
        const chatroomId = req.params.id;
        const content = req.body.content;
        const sourceUserId = req.body.sourceUserId;
        const learningSession = req.body.learningSession;
    
        message = await communicationService.sendMessage(chatroomId, content, sourceUserId, learningSession);
        return res.status(200).json({message});
    }
    catch(err){
        return res.status(500).json({error: "Error sending message"});
    }
}

// ChatGPT Usage: No
exports.getChatrooms = async(req,res) =>{
    const idToken = req.params.idToken;
    const sourceUserId = req.params.userId;
    try{
        const chatrooms = await communicationService.getChatrooms(sourceUserId);

        const verificationResponse = await authenticationService.verifyUser(idToken, sourceUserId);
        if(!verificationResponse.success) {
            return res.status(401).json({error:verificationResponse.error});
        }
        
        return res.status(200).json({chatroomList: chatrooms});
    }
    catch(err){
        return res.status(500).json({error: "Error getting chatrooms"});
    }
   
}

// ChatGPT Usage: No
exports.getMessages = async(req,res) =>{
    let messagesList;
    try{
        const chatroomId = req.params.cid;
        messagesList = await communicationService.getMessages(chatroomId);
        return res.json({messages: messagesList});
    }
    catch(err){
        return res.status(500).json({error: "Error getting messages"});
    }
}

