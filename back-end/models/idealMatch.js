const mongoose = require('mongoose');

const idealMatchSchema = new mongoose.Schema({
    age: {
        type: Number,
        required: true,
        default: 0
    },
    interests: {
        business: {
            type: Number,
            required: true,
            default: 0,
        },
        sports: {
            type: Number,
            required: true,
            default: 0
        },
        cooking: {
            type: Number,
            required: true,
            default: 0
        },
        travel: {
            type: Number,
            required: true,
            default: 0
        },
        movies: {
            type: Number,
            required: true,
            default: 0
        },
        art: {
            type: Number,
            required: true,
            default: 0
        },
        music: {
            type: Number,
            required: true,
            default: 0
        },
        reading: {
            type: Number,
            required: true,
            default: 0
        },
        gaming: {
            type: Number,
            required: true,
            default: 0
        }
    },
    learningPreference: {
        expert: {
            type: Number,
            required: true,
            default: 0
        },
        partner: {
            type: Number,
            required: true,
            default: 0
        }
    }
});


// ChatGPT Usage: No
// Get interests in Ideal match format
function getDefaultIdealMatchInterests(interest){
    const defaultInterests = {};
    for (const [key, value] of Object.entries(interest)) {
        defaultInterests[key] = value ? 1.0 : 0;
    }
    return defaultInterests;
}

// ChatGPT Usage: No
// Get learning preference in Ideal match format
function getDefaultIdealMatchLearningPreference(learningPreference){
    const defaultLearningPreference = {
        expert: 1.0,
        partner: 1.0
    };

    if(learningPreference === 'Expert'){
        defaultLearningPreference.partner = 0;
    }

    if(learningPreference === 'Partner'){
        defaultLearningPreference.expert = 0;
    }

    return defaultLearningPreference;
}

// ChatGPT Usage: No
// Get default ideal match
function getDefaultInitialIdealMatch( user) {
    const idealMatchInterest = getDefaultIdealMatchInterests(user.interests);
    const idealMatchLearningPreference = getDefaultIdealMatchLearningPreference(user.learningPreference);

    return {
        age: user.age,
        interests: idealMatchInterest,
        learningPreference: idealMatchLearningPreference
    }
}

module.exports = {idealMatchSchema, getDefaultInitialIdealMatch};
