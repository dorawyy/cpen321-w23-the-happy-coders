const  mockUsers  = require("./mockedUsers");

  
// Mocking the User model methods
const User = {
    find: jest.fn((query) => {
        const { $and, learningPreference, interestedLanguages, proficientLanguages, banned } = query;

        const userId = $and.find((cond) => cond._id && cond._id.$ne)._id.$ne;
        const notInterestUsers = $and.find((cond) => cond._id && cond._id.$nin)._id.$nin;

        let filteredUsers = mockUsers.filter((user) => {
            return (
                user._id !== userId &&
                !notInterestUsers.includes(user._id) &&
                learningPreference.$in.includes(user.learningPreference) &&
                user.interestedLanguages.some((lang) => interestedLanguages.$in.includes(lang)) &&  
                user.proficientLanguages.some((lang) => proficientLanguages.$in.includes(lang)) &&
                !user.banned
            );
        });
        return { exec: () => filteredUsers}
    }),
    findById: jest.fn().mockImplementation((id) =>{
        if(id === "errorId"){
            throw new Error('User not found');
        }
        user = mockUsers.find((user) => user._id.equals(id));
        return user;
    }),
};
  
module.exports = { User };
  