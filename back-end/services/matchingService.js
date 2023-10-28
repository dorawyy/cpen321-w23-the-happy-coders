const { User } = require("../models/user");

// Check if targetUser likes sourceUser and matches
async function createMatch(sourceUserId, targetUserId){
    const sourceUser = await User.findById(sourceUserId);
    const targetUser = await User.findById(targetUserId);

    sourceUser.likedUsers.push(targetUserId);

    // Check if target user likes source user and create match
    if(targetUser.likedUsers.includes(sourceUserId)){
        sourceUser.matchedUsers.push(targetUserId);
        targetUser.matchedUsers.push(sourceUserId);
        sourceUser.save();
        return true;
    }

    sourceUser.save();
    return false;
}

// Get the users someone has matches with
async function createMatch(userId){
    const sourceUser = await User.findById(userId);

    return sourceUser.matchedUsers;
}