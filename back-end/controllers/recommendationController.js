const recommendationService = require('../services/recommendationService'); 

// ChatGPT Usage: No
exports.getRecommendedUsers = async(req,res) =>{
    let recommendedUsers;
    try{
        const userId = req.params.id;
        recommendedUsers = await recommendationService.getRecommendedUsers(userId);
    
        return res.status(200).json({recommendedUsersList: recommendedUsers});
    }
    catch(err){
        return res.status(500).json({error: "Error getting recommended users"});
    }
}
