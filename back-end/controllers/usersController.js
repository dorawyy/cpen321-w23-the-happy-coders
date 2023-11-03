require('dotenv').config();
const userServices = require('../services/userService');


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

exports.updateBlockedUsers = async (req, resp) => {
    try {
        const user = await userServices.findUserByID(req.params.id);

        if (user == null) {
            return resp.status(404).json({ success: false });
        }
        const body = req.body;

        user.blockedUsers.push(body.blockedUser);

        user.save();

        return resp.status(200).json({ success: true });
    } catch (error) {
        return resp.status(500).json({ success: false, message: "Error adding a blocked user"});
    }
}

exports.getUser =  async (req, resp) => { 
    let user =  await userServices.findUserByID(req.params.id);

    if (user == null) {
        return resp.status(404).json({ success: false });
    }
    
    return resp.status(200).json({ success: true, user: user });
};

exports.getFilteredUser = (filter) => {
    let users = userServices.findUsers(filter);
    
    return users;
};
