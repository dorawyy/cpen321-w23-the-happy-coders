const badgeService = require('../services/badgeService');

// ChatGPT Usage: No
exports.getBadges = async(req,res) =>{
    try{
        const icons = await badgeService.getBadgeIcon(req.user.badges);
        return res.status(200).json({icons});
    }
    catch(err){
        return res.status(500).json({error: "Error getting badge icons"});
    }
}