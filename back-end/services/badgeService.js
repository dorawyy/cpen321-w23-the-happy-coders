const {Badge} = require('../models/badge');
const {User} = require('../models/user');

async function assignMatchBadge(user, type)
{
    const badgeLength = type == "Match" ? user.matchedUsers.length : user.lessonCount;
    let milestones = [1, 5, 10]

    if(milestones.includes(badgeLength)){
        try{
            const badge = await Badge.findOne({count: badgeLength, type});
            if(badgeLength === 10){
                const removeBadge = await Badge.findOne({count: 5, type});
                user.badges = user.badges.filter((id) => {
                    return id != removeBadge._id
                });
            }
            else if(badgeLength === 5){
                const removeBadge = await Badge.findOne({count: 1, type});
                user.badges = user.badges.filter((id) => {
                    return id != removeBadge._id
                });
            }

            user.badges.push(badge._id);
        }
        catch(err){
            console.log(err);
        }
    }

    await user.save();
    return;
}

async function getBadgeIcon(userId) {
    const user = await User.findById(userId);
    let badgeIds = user.badges;
    let badgeIcons = [];
    badgeIds.forEach(id => {
        let badge = Badge.findById(id);
        badgeIcons.push(badge.icon);
    });

   return badgeIcons;
}

module.exports = {assignMatchBadge, getBadgeIcon};