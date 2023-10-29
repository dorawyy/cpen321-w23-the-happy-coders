require('dotenv').config()
const {User, getDefaultUser} = require('../models/user');

async function findUnregistredOrCreateUser(ticket) {
    const payload = ticket.getPayload();
    const email = payload.email;
    const picture = payload.picture;
    const displayName = payload.name;

    let user = await User.findOne({ email: email });

    if (!user){
        try {
            user = getDefaultUser(email,displayName, picture);
            await user.save();
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

async function createUser(body) {
    let user = getDefaultUser(body.email, body.displayName, body.picture);
    await user.save();
    return user;
}

module.exports = { findUnregistredOrCreateUser, findUserByEmail, findUserByID, findUsers, createUser };
