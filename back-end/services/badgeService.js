const {Badge} = require('../models/badge');

async function assignMatchBadge(user, type)
{
    if(user.matchedUsers.length == 10)
    {
        try{
            const badge = await Badge.findOne({count: 10, type: type});
            const removeBadge = await Badge.findOne({count: 5, type: type});
            user.badges.push(badge._id);
            user.badges = user.badges.filter((id) => {id != removeBadge._id});
        }
        catch(err){
            console.log(err);
        }

    }
    else if(user.matchedUsers.length == 5)
    {
        try{
            const badge = await Badge.findOne({count: 5, type: type});
            const removeBadge = await Badge.findOne({count: 1, type: type});
            user.badges.push(badge._id);
          
            user.badges = user.badges.filter((id) => {id != removeBadge._id});
        }
        catch(err){
            console.log(err);
        }
    }
    else if(user.matchedUsers.length == 1)
    {
        try{
            const badge = await Badge.findOne({count: 1, type: type});
            user.badges.push(badge._id);
        }
        catch(err){
            console.log(err);
        }
    }
    user.save();
}

async function getBadgeIcon(badgeIds) {
    let badgeIcons = [];
    badgeIds.forEach(id => {
        const badge = Badge.findById(id);
        badgeIcons.push(badge.icon);
    });

   return badgeIcons;
}

module.exports = {assignMatchBadge, getBadgeIcon};