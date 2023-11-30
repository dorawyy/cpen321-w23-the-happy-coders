// ChatGPT Usage: Partial
const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
    icon: String,
    count: Number,
    type: String
});

const Badge = mongoose.model('Badge', badgeSchema);

module.exports = {Badge};
