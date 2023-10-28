require('dotenv').config()
const {User, getDefaultUser} = require('../models/user');

async function findOrCreateUser(ticket) {
    const payload = ticket.getPayload();
    const email = payload.email;
    const picture = payload.picture;
    const displayName = payload.name;

    let user = await User.findOne({ email: email });

    if (!user) {
        user = getDefaultUser(email,displayName, picture);

        await user.save();
    }

    return user;
}

async function findUserByID(userID) {
    let user = await User.findOne({ userID : userID });

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

module.exports = { findOrCreateUser, findUserByID, findUsers, createUser };