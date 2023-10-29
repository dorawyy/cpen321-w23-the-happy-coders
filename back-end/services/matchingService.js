const { User } = require("../models/user");
const userService = require("./userService")
const communicationService = require("./communicationService")

// Check if targetUser likes sourceUser and matches
async function createMatch(sourceUserId, targetUserId){
    const sourceUser = await userService.findUserByID(sourceUserId)
    const targetUser = await userService.findUserByID(targetUserId)

    sourceUser.likedUsers.push(targetUserId);

    // Check if target user likes source user and create match
    if(targetUser.likedUsers.includes(sourceUserId)){
        sourceUser.matchedUsers.push(targetUserId);
        targetUser.matchedUsers.push(sourceUserId);
        sourceUser.save();
        targetUser.save();
        await communicationService.createChatroom(sourceUserId, targetUserId);
        return true;
    }

    sourceUser.save();
    targetUser.save();
    return false;
}

// Get the users someone has matches with
async function getAllMatches(userId){
    const sourceUser = await User.findById(userId);

    return sourceUser.matchedUsers;
}

module.exports = {createMatch, getAllMatches};