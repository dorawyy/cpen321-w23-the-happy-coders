const { ObjectId } = require('mongodb');

const mockUser0 = {
  _id: new ObjectId('5f9d88b9d4b4d4c6a0b0f6a0'),
  age: 25,
  displayName: 'Alice',
  registered: true,
  picture: 'alice.jpg',
  email: 'alice@example.com',
  proficientLanguages: ['English', 'Spanish'],
  interestedLanguages: ['French'],
  learningPreference: 'Expert',
  matchedUsers: [],
  blockedUsers: [],
  likedUsers: [new ObjectId('5f9d88b9d4b4d4c6a0b0f6a3')],
  chatroomIDs: [],
  badges: [],
  interests: {
    business: true,
    sports: false,
    cooking: true,
    travel: false,
    movies: true,
    art: false,
    music: true,
    reading: true,
    gaming: false,
  },
  admin: false,
  banned: false,
  idealMatch: {
    age: 30,
    interests: {
      business: 0.5,
      sports: 0.3,
      cooking: 0.7,
      travel: 0.2,
      movies: 0.6,
      art: 0.4,
      music: 0.8,
      reading: 0.9,
      gaming: 0.1,
    },
    learningPreference: {
      expert: 0.9,
      partner: 0.6,
    },
  },
};

const mockUser1 ={
  _id: new ObjectId('5f9d88b9d4b4d4c6a0b0f6a1'),
  age: 30,
  displayName: 'Bob',
  registered: true,
  picture: 'bob.jpg',
  email: 'bob@example.com',
  proficientLanguages: ['English', 'Portuguese'],
  interestedLanguages: ['Arabic'],
  learningPreference: 'Partner',
  matchedUsers: [],
  blockedUsers: [],
  likedUsers: [],
  chatroomIDs: [],
  badges: [],
  interests: {
    business: false,
    sports: true,
    cooking: false,
    travel: true,
    movies: false,
    art: true,
    music: false,
    reading: true,
    gaming: true,
  },
  admin: true,
  banned: false,
  idealMatch: {
    age: 28,
    interests: {
      business: 0.3,
      sports: 0.7,
      cooking: 0.6,
      travel: 0.8,
      movies: 0.4,
      art: 0.5,
      music: 0.9,
      reading: 0.2,
      gaming: 0.6,
    },
    learningPreference: {
      expert: 0.8,
      partner: 0.4,
    },
  },
};

const mockUser2 ={
  _id: new ObjectId('5f9d88b9d4b4d4c6a0b0f6a2'),
  age: 28,
  displayName: 'Charlie',
  registered: true,
  picture: 'charlie.jpg',
  email: 'charlie@example.com',
  proficientLanguages: ['English', 'Portuguese'],
  interestedLanguages: ['Arabic'],
  learningPreference: 'Both',
  matchedUsers: [],
  blockedUsers: [],
  likedUsers: [],
  chatroomIDs: [],
  badges: [],
  interests: {
    business: true,
    sports: true,
    cooking: false,
    travel: false,
    movies: true,
    art: false,
    music: true,
    reading: false,
    gaming: true,
  },
  admin: false,
  banned: false,
  idealMatch: {
    age: 25,
    interests: {
      business: 0.8,
      sports: 0.6,
      cooking: 0.3,
      travel: 0.2,
      movies: 0.9,
      art: 0.4,
      music: 0.7,
      reading: 0.1,
      gaming: 0.5,
    },
    learningPreference: {
      expert: 0.7,
      partner: 0.5,
    },
  },
};

const mockUser3 = {
  _id: new ObjectId('5f9d88b9d4b4d4c6a0b0f6a3'),
  age: 32,
  displayName: 'David',
  registered: true,
  picture: 'david.jpg',
  email: 'david@example.com',
  proficientLanguages: ['French', 'Spanish'],
  interestedLanguages: ['English', 'Punjabi'],
  learningPreference: 'Both',
  matchedUsers: [],
  blockedUsers: [],
  likedUsers: [],
  chatroomIDs: [],
  badges: [],
  interests: {
    business: true,
    sports: false,
    cooking: true,
    travel: true,
    movies: false,
    art: true,
    music: false,
    reading: true,
    gaming: false,
  },
  admin: false,
  banned: false,
  idealMatch: {
    age: 30,
    interests: {
      business: 0,
      sports: 0,
      cooking: 0,
      travel: 0,
      movies: 0,
      art: 0,
      music: 0,
      reading: 0,
      gaming: 0,
    },
    learningPreference: {
      expert: 1,
      partner: 0,
    },
  },
};

const mockUser4 = {
  _id: new ObjectId('5f9d88b9d4b4d4c6a0b0f6a4'),
  age: 25,
  displayName: 'Leo',
  registered: true,
  picture: 'leo.jpg',
  email: 'leo@example.com',
  proficientLanguages: ['English', 'Spanish'],
  interestedLanguages: ['French', 'Punjabi'],
  learningPreference: 'Both',
  matchedUsers: [],
  blockedUsers: [],
  likedUsers: [],
  chatroomIDs: [],
  badges: [],
  interests: {
    business: true,
    sports: false,
    cooking: true,
    travel: false,
    movies: true,
    art: false,
    music: true,
    reading: true,
    gaming: false,
  },
  admin: false,
  banned: false,
  idealMatch: {
    age: 30,
    interests: {
      business: 0.5,
      sports: 0.3,
      cooking: 0.7,
      travel: 0.2,
      movies: 0.6,
      art: 0.4,
      music: 0.8,
      reading: 0.9,
      gaming: 0.1,
    },
    learningPreference: {
      expert: 0.9,
      partner: 0.6,
    },
  },
};

const mockUser5 = {
  _id: new ObjectId('5f9d88b9d4b4d4c6a0b0f6a5'),
  age: 30,
  displayName: 'Daniel',
  registered: true,
  picture: 'daniel.jpg',
  email: 'daniel@example.com',
  proficientLanguages: ['English', 'Spanish'],
  interestedLanguages: ['French'],
  learningPreference: 'Expert',
  matchedUsers: [],
  blockedUsers: [],
  likedUsers: [],
  chatroomIDs: [],
  badges: [],
  interests: {
    business: false,
    sports: false,
    cooking: false,
    travel: false,
    movies: false,
    art: false,
    music: false,
    reading: false,
    gaming: false,
  },
  admin: false,
  banned: false,
  idealMatch: {
    age: 30,
    interests: {
      business: 0.5,
      sports: 0.3,
      cooking: 0.7,
      travel: 0.2,
      movies: 0.6,
      art: 0.4,
      music: 0.8,
      reading: 0.9,
      gaming: 0.1,
    },
    learningPreference: {
      expert: 0.9,
      partner: 0.6,
    },
  },
};

const mockUser6 = {
  _id: new ObjectId('5f9d88b9d4b4d4c6a0b0f6a6'),
  age: 30,
  displayName: 'Daniel',
  registered: true,
  picture: 'daniel.jpg',
  email: 'daniel@example.com',
  proficientLanguages: ['Portuguese'],
  interestedLanguages: ['French'],
  learningPreference: 'Expert',
  matchedUsers: [],
  blockedUsers: [],
  likedUsers: [],
  chatroomIDs: [],
  badges: [],
  interests: {
    business: false,
    sports: false,
    cooking: false,
    travel: false,
    movies: false,
    art: false,
    music: false,
    reading: false,
    gaming: false,
  },
  admin: false,
  banned: false,
  idealMatch: {
    age: 30,
    interests: {
      business: 0.5,
      sports: 0.3,
      cooking: 0.7,
      travel: 0.2,
      movies: 0.6,
      art: 0.4,
      music: 0.8,
      reading: 0.9,
      gaming: 0.1,
    },
    learningPreference: {
      expert: 0.9,
      partner: 0.6,
    },
  },
};


const mockUser7 = {
  _id: new ObjectId('5f9d88b9d4b4d4c6a0b0f6a7'),
  age: 30,
  displayName: 'hasan',
  registered: true,
  picture: 'hasan.jpg',
  email: 'hasan@example.com',
  proficientLanguages: ['English'],
  interestedLanguages: ['Portuguese'],
  learningPreference: 'Expert',
  matchedUsers: [],
  blockedUsers: [],
  likedUsers: [],
  chatroomIDs: [],
  badges: [],
  interests: {
    business: false,
    sports: false,
    cooking: false,
    travel: false,
    movies: false,
    art: false,
    music: false,
    reading: false,
    gaming: false,
  },
  admin: false,
  banned: true,
  idealMatch: {
    age: 30,
    interests: {
      business: 0.5,
      sports: 0.3,
      cooking: 0.7,
      travel: 0.2,
      movies: 0.6,
      art: 0.4,
      music: 0.8,
      reading: 0.9,
      gaming: 0.1,
    },
    learningPreference: {
      expert: 0.9,
      partner: 0.6,
    },
  },
};

const unregisteredUser = {
  email: "unregistered@gmail.com"
}

const unregisteredAdmin = {
  email: "unregistered@admin.com"
}

const mockedUsers = [mockUser0, mockUser1, mockUser2, mockUser3, mockUser4, mockUser5, mockUser6, mockUser7 ];  

module.exports = {mockedUsers, unregisteredUser, unregisteredAdmin};