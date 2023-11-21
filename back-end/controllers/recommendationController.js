const recommendationService = require('../services/recommendationService'); 

// ChatGPT Usage: No
exports.getRecommendedUsers = async(req,res) =>{
    try{
        const userId = req.params.id;
        const recommendedUsersResult = await recommendationService.getRecommendedUsers(userId);
        if(!recommendedUsersResult.success){
            return res.status(400).json({error: recommendedUsersResult.error});
        }

        return res.status(200).json({recommendedUsersList: recommendedUsersResult.recommendedUsersList });
    }
    catch(err){
        return res.status(500).json({error: err.message});
    }
}
