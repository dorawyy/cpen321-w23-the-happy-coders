require('dotenv').config();
const userServices = require('../services/userService');

// ChatGPT Usage: No
exports.updateUserProfile = async (req, resp) => {
    try {
        const userId = req.params.id;
        const body = req.body;

        const updateResponse = await userServices.updateUser(userId, body);

        if (updateResponse.success) {
            return resp.status(200).json(updateResponse);
        }else{
            return resp.status(500).json(updateResponse);
        }

    } catch (error) {
        return resp.status(500).json({ success: false, message: "Error saving updates to user"});
    }
};

// ChatGPT Usage: No
exports.getUser =  async (req, resp) => { 
    let user =  await userServices.findUserByID(req.params.id);

    if (user == null) {
        return resp.status(404).json({ success: false });
    }
    
    return resp.status(200).json({ success: true, user: user });
};

