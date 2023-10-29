const mongoose = require('mongoose');

const desiredUserSchema = new mongoose.Schema({
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

function getDefaultDesiredUserInterests(interest){
    const defaultInterests = {};
    for (const [key, value] of Object.entries(interest)) {
        defaultInterests[key] = value ? 1.0 : 0;
    }
    return defaultInterests;
}

function getDefaultDesiredUserLearningPreference(learningPreference){
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

function getDefaultInitialDesiredUser( user) {
    const desiredUserInterest = getDefaultDesiredUserInterests(user.interests);
    const desiredUserLearningPreference = getDefaultDesiredUserLearningPreference(user.learningPreference);

    return {
        age: user.age,
        interests: desiredUserInterest,
        learningPreference: desiredUserLearningPreference
    }
}



module.exports = {desiredUserSchema, getDefaultInitialDesiredUser};
