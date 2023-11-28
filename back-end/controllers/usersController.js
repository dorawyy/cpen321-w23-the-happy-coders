require('dotenv').config();
const userServices = require('../services/userService');

// ChatGPT Usage: No
exports.updateUserProfile = async (req, resp) => {
    let updateResponse;
    try {
        const userId = req.params.id;
        const body = req.body;

        updateResponse = await userServices.updateUser(userId, body);

        if (updateResponse.success) {
            return resp.status(200).json(updateResponse);
        } else {
            return resp.status(400).json(updateResponse);
        }

    } catch (error) {
        return resp.status(500).json({ success: false, error: "Error saving updates to user"});
    }
};

// ChatGPT Usage: No
exports.getUser =  async (req, resp) => { 
    let user ;
    try {
        user = await userServices.findUserByID(req.params.id);

        if (user == null) {
            return resp.status(400).json({ success: false, error: 'Invalid user id' });
        }
        return resp.status(200).json({ success: true, user });

    } catch (error) {
        return resp.status(500).json({ success: false, error: 'Error getting user' });
    }
};

