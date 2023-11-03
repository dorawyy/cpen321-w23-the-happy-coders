const { User } = require("../models/user");
const { getDefaultInitialIdealMatch } = require("../models/idealMatch");


//ChatGPT Usage: No
async function getRecommendedUsers(userId){
    let user = await User.findById(userId);
    let users = [];

    if (!user) { 
        return [];
    }
    
    if(user.learningPreference === "Expert"){
        const expertQuery = await getExpertQuery(user);
        users = await expertQuery;
    } else if(user.learningPreference  === "Partner"){
        const partnerQuery = await getPartnerQuery(user);
        users = await partnerQuery;
    }else{
        const expertQuery = await getExpertQuery(user);
        const partnerQuery = await getPartnerQuery(user);
        const expertUsers = await expertQuery;
        const partnerUsers = await partnerQuery;
        users = mergeArraysNoDuplicatesId(expertUsers, partnerUsers);
    }

    const arbitraryTopUsers = [];
    const scoredUsers = [];
    
    for (let i = 0; i < users.length; i++) {
        let targetUser = users[i];
        if (targetUser._id == userId ) {
            continue;
        }
        if (targetUser.likedUsers.includes(userId) ) {
            arbitraryTopUsers.push(targetUser);
        } else{
            scoredUsers.push(targetUser);
        }
    }

    const sortedScoredUsers = sortUsersOnScore(scoredUsers, user.idealMatch);
    let recommendedUsers = arbitraryTopUsers.concat(sortedScoredUsers);

    recommendedUsers = recommendedUsers.filter(recommendedUser => {
        return !user.blockedUsers.includes(recommendedUser._id) && !recommendedUser.blockedUsers.includes(user._id)
    })

    return recommendedUsers;
}

//ChatGPT Usage: No
function getPartnerQuery(user){
    return User.find({
        _id: { $ne: user._id }, // Exclude User
        _id: { $nin: [...user.likedUsers, ...user.matchedUsers] }, // Exclude users that user already liked or matched
        learningPreference: { $in: ["Partner", "Both"] },
        interestedLanguages: { $in: user.interestedLanguages },
        proficientLanguages: { $in: user.proficientLanguages },
    }).exec();
}

// CHatGPT Usage: No
function getExpertQuery(user){
    return User.find({
        _id: { $ne: user._id }, // Exclude user
        _id: { $nin: [...user.likedUsers, ...user.matchedUsers] }, // Exclude users that user already liked or matched
        learningPreference: { $in: ["Expert", "Both"] },
        proficientLanguages: { $in: user.interestedLanguages },
        interestedLanguages: { $in: user.proficientLanguages },
    }).exec();
}

//ChatGPT Usage: No
function sortUsersOnScore (users, idealMatch) {
    const usersWithScore = users.map((user) => {
        const score = getScore(user, idealMatch);
        return { user, score };
    });
    const sortedUsersWithScore = usersWithScore.sort((a, b) => a.score - b.score);
    return sortedUsersWithScore.map((userWithScore) => userWithScore.user);
}

//ChatGPT Usage: No
function getScore(user, idealMatch) {
    const formatedUser = getDefaultInitialIdealMatch(user);
    const score = calculateScore(formatedUser, idealMatch);
    return score;
}

//ChatGPT Usage: Yes
function calculateScore(user, targetUser) {
    // Step 1: Calculate Euclidean distances
    const ageDistance = Math.abs(user.age - targetUser.age);
    
    const learningPreferenceDistance = Math.sqrt(
        Math.pow(user.learningPreference.expert - targetUser.learningPreference.expert, 2) +
        Math.pow(user.learningPreference.partner - targetUser.learningPreference.partner, 2)
    );
    
    const interestsDistance = Math.sqrt(
        Object.keys(user.interests).reduce((acc, interest) => {
            return acc + Math.pow(user.interests[interest] - targetUser.interests[interest], 2);
        }, 0)
    );

    // Step 2: Scale the distances
    const maxAgeDifference = 80; // Maximum age difference (adjust as needed)
    const maxLearningPreferenceDistance = Math.sqrt(2); // Maximum distance for learningPreference
    const maxInterestsDistance = Math.sqrt(Object.keys(user.interests).length); // Maximum distance for interests

    const scaledAge = ageDistance / maxAgeDifference;
    const scaledLearningPreference = learningPreferenceDistance / maxLearningPreferenceDistance;
    const scaledInterests = interestsDistance / maxInterestsDistance;

    // Step 3: Calculate the overall similarity score
    const interestsWeight = 3;
    const similarityScore = Math.sqrt(
        Math.pow(scaledAge, 2) +
        Math.pow(scaledLearningPreference, 2) +
        Math.pow(scaledInterests, 2) * interestsWeight
    );

    return similarityScore;
}

// ChatGPT usage: No
function mergeArraysNoDuplicatesId(arr1, arr2){
    const idSet = new Set();
    const mergedArray = [];

    for (const obj of arr1) {
        if (!idSet.has(obj._id.toString())) {
          mergedArray.push(obj);
          idSet.add(obj._id.toString());
        }
    }

    for (const obj of arr2) {
        if (!idSet.has(obj._id.toString()  )) {
          mergedArray.push(obj);
          idSet.add(obj._id.toString());
        }
    }
    return mergedArray;
}

module.exports = {getRecommendedUsers};