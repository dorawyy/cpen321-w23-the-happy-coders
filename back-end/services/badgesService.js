const {Badge} = require('../models/badge');

async function assignMatchBadge(user, type)
{
    if(user.matchedUsers.length == 10)
    {
        const badge = await Badge.findOne({count: 10, type: type});
        const removeBadge = await Badge.findOne({count: 5, type: type});
        user.badges.push(badge._id);
      
        user.badges = user.badges.filter((id) => {
            return id != removeBadge._id;
        });

    }
    else if(user.matchedUsers.length == 5)
    {
        const badge = await Badge.findOne({count: 5, type: type});
        const removeBadge = await Badge.findOne({count: 1, type: type});
        user.badges.push(badge._id);
      
        user.badges = user.badges.filter((id) => {
            return id != removeBadge._id;
        });

    }
    else if(user.matchedUsers.length == 1)
    {
        const badge = await Badge.findOne({count: 5, type: type});
        // remove badge 5 if it exists
        user.badges.push(badge._id);
      
    }
    user.save();
}

// ChatGPT Usage: No
// Create a new user
async function getBadgeIcon(badgeIds) {
    let badgeIcons = [];
    badgeIds.forEach(id => {
        const badge = Badge.findById(id);
        badgeIcons.push(badge.icon);
    });

   return badgeIcons;
}

module.exports = {assignMatchBadge, getBadgeIcon};