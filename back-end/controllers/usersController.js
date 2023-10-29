require('dotenv').config();
const userServices = require('../services/userService');

exports.createUser = (req, resp) => { 
    const body = req.body;
    
    const user = userServices.findOrCreateUser(body);
    return resp.status(200).json({user: user});
};

exports.updateUserProfile = async (req, resp) => {
    try {
        const user = await userServices.findUserByID(req.param.id);

        if (user == null) {
            return resp.status(404).json({ success: false });
        }
        const body = req.body;

        //Update each field for the user and save to database
        user.proficientLanguages = body.proficientLanguages;
        user.interestedLanguages = body.interestedLanguages;
        user.learningPreference = body.learningPreference;
        user.interests = body.interests;

        user.save();

        return resp.status(200).json({ success: true });
    } catch (error) {
        return resp.status(500).json({ success: false, message: "Error saving updates to user"});
    }
};

exports.updateBlockedUsers = async (req, resp) => {
    try {
        const user = await userServices.findUserByID(req.param.id);

        if (user == null) {
            return resp.status(404).json({ success: false });
        }
        const body = req.body;

        user.blockedUsers.push(body.blockedUser);

        user.save();

        return resp.status(200).json({ success: true });
    } catch (error) {
        return resp.status(500).json({ success: false, mesage: "Error adding a blocked user"});
    }
}

exports.updateBadges = async (req, resp) => {
    try {
        const user = await userServices.findUserByID(req.param.id);

        if (user == null) {
            return resp.status(404).json({ success: false });
        }
        const body = req.body;

        user.badges.push(body.badge);

        user.save();

        return resp.status(200).json({ success: true });
    } catch (error) {
        return resp.status(500).json({ success: false, mesage: "Error adding a new badge"});
    }
}

exports.getUser = (req, resp) => { 
    let user = userServices.findUserByID(req.param.id);

    if (user == null) {
        return resp.status(404).json({ success: false });
    }
    
    return resp.status(200).json({ success: true, user: user });
};

exports.getFilteredUser = (filter) => {
    let users = userServices.findUsers(filter);
    
    return users;
};
