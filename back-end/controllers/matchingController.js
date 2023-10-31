const matchingService = require('../services/matchingService'); 

exports.createMatch = async(req,res) =>{
    console.log("here")
    const sourceUserId = req.body.sourceUserId;
    const targetUserId = req.body.targetUserId;

    let isMatch = matchingService.createMatch(sourceUserId, targetUserId)

    if(isMatch){
       return res.json({match : true}) 
    }

    return res.json({match: false})
}

exports.getAllMatches = async(req,res) =>{
    const userId = req.body.userId;

    let matchList = matchingService.getAllMatches(userId);

    return res.json({matches: matchList})
}