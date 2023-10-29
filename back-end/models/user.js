const mongoose = require('mongoose');
const { idealMatchSchema } = require('./idealMatch');

const userSchema = new mongoose.Schema({
    age: {
        type: Number,
        required: true,
        default: 0
    },
    displayName: {
        type: String,
        required: true
    },
    registered:{
        type: Boolean,
        required: true,
        default: false
    },
    picture: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    proficientLanguages: {
        type: [String],
        required: true,
        default: []
    },
    interestedLanguages: {
        type: [String],
        required: true,
        default: []
    },
    learningPreference: {
        type: String,
        enum: ['Expert', 'Partner', 'Both'],
        required: true,
        default: 'Both',
    },
    matchedUsers: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        default: [],
    },
    blockedUsers: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        default: [],
    },
    likedUsers: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        default: [],
    },
    chatroomIDs: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        default: [],
    },
    badges: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        default: [],
    },
    interests: {
        business: {
            type: Boolean,
            required: true,
            default: false,
        },
        sports: {
            type: Boolean,
            required: true,
            default: false
        },
        cooking: {
            type: Boolean,
            required: true,
            default: false
        },
        travel: {
            type: Boolean,
            required: true,
            default: false
        },
        movies: {
            type: Boolean,
            required: true,
            default: false
        },
        art: {
            type: Boolean,
            required: true,
            default: false
        },
        music: {
            type: Boolean,
            required: true,
            default: false
        }, 
        reading: {
            type: Boolean,
            required: true,
            default: false
        },
        gaming: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    idealMatch:{
        type: idealMatchSchema,
        required: true,
        default:  {
            age: 0,
            interests: {
                business: 0,
                sports: 0,
                cooking: 0,
                travel: 0,
                movies: 0,
                art: 0,
                music: 0,
                reading: 0,
                gaming: 0
            },
            learningPreference: {
                expert: 0,
                partner: 0
            }
        }
    }
});

const User = mongoose.model('User', userSchema);

module.exports = {User};
