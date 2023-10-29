const recommendationService = require('../services/recommendationService'); 

exports.getRecommendedUsers = async(req,res) =>{
    const userId = req.body.userId;

    let recommendedUsers = await recommendationService.getRecommendedUsers(userId);

    return res.json({recommendedUsersList: recommendedUsers});
}
