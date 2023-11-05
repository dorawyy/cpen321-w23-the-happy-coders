const matchingService = require('../services/matchingService'); 

// ChatGPT Usage: No
exports.createMatch = async(req,res) =>{
    let isMatch;
    try{
        const sourceUserId = req.body.sourceUserId;
        const targetUserId = req.body.targetUserId;
    
        isMatch = matchingService.createMatch(sourceUserId, targetUserId)
    
        if(isMatch){
           return res.status(200).json({match : true}) 
        }
    
        return res.status(200).json({match: false})
    }
    catch(err){
        return res.status(500).json({error: "Error creating match"});
    }

}

// ChatGPT Usage: No
exports.getAllMatches = async(req,res) =>{
    let matchList;
    try{
        const userId = req.body.userId;

        matchList = matchingService.getAllMatches(userId);
    
        return res.status(200).json({matches: matchList})
    }
    catch(err){
        return res.status(500).json({error: "Error getting all matches"});
    }
}