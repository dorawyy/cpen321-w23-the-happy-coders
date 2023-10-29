require('dotenv').config()
const {User} = require('../models/user');
const {getDefaultInitialIdealMatch} = require('../models/idealMatch');

async function findUnregistredOrCreateUser(ticket) {
    const payload = ticket.getPayload();
    const email = payload.email;
    const picture = payload.picture;
    const displayName = payload.name;

    let user = await User.findOne({ email: email });

    if (!user){
        try {
            user = await createUser(email, displayName, picture);
            
            return {success: true, user: user};
        } catch (error) {
            return {success: false, error: error};
        }
    }else if (user.registered === false){
        return {success: true, user: user};
    }
    else{
        return {success: false, error: "User already registered"};
    }
}

async function findUserByEmail(email) {
    console.log("Find user by email " + email)
    const user = await User.findOne({ email: email });
    if (!user || user.registered === false) {
        return {success: false, error: 'User not registered'};
    }

    return {success: true, user: user};
}


async function findUserByID(userID) {
    // let user = await User.findOne({ _id : userID });
    let user = await User.findById(userID);

    if (!user) {
        return null;
    }

    return user;
}

async function findUsers(filter){
    let users = await User.find(filter);

    return users;
}

async function createUser(email, displayName, picture) {
    userData = {
        email: email,
        displayName: displayName,
        picture: picture,
    }
    let user = new User(userData);
    await user.save();
    return user; 
}

async function updateUser(userID, userData) {
    user = await User.findById(userID);

    if (!user) {
        return {success: false, error: "User not found"};
    }

    try {
        user.proficientLanguages = userData.proficientLanguages;
        user.interestedLanguages = userData.interestedLanguages;
        user.learningPreference = userData.learningPreference;
        user.interests = userData.interests;
        user.age = userData.age;

        if (user.registered === false) {
            user.idealMatch = getDefaultInitialIdealMatch(user);
            user.registered = true;
        }

        user.save();

        return {success: true, message: "User updated successfully"};
    } catch (error) {
        return {success: false, error: error};
    }
}

module.exports = { findUnregistredOrCreateUser, findUserByEmail, findUserByID, findUsers, createUser, updateUser };
