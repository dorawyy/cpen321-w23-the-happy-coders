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

module.exports = { findOrCreateUser };