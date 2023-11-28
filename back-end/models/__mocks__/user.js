const  {mockUsers}  = require("./mockedUsers");
const { ObjectId } = require("mongodb");


class User {
    // ChatGPT Usage: Partial
    constructor(obj) {
        this._id = obj._id ?? new ObjectId();
        this.age = obj.age ?? 0;
        this.displayName = obj.displayName;
        this.registered = obj.registered ?? false;
        this.picture = obj.picture;
        this.email = obj.email;
        this.proficientLanguages = obj.proficientLanguages ?? [];
        this.interestedLanguages = obj.interestedLanguages ?? [];
        this.matchedUsers = obj.matchedUsers ?? [];
        this.blockedUsers = obj.blockedUsers ?? [];
        this.likedUsers = obj.likedUsers ?? [];
        this.chatroomIDs = obj.chatroomIDs ?? [];
        this.badges = obj.badges ?? [];
        this.interests = obj.interests ?? {};
        this.admin = obj.admin ?? false;
        this.banned = obj.banned ?? false;
        this.registered = obj.registered;
        this.idealMatch = obj.idealMatch ?? {};
        this.learningPreference = obj.learningPreference ?? "Both"; 
        this.tokens = obj.tokens ?? {
            accessToken: null,
            refreshToken: null,
            expiresAt: null,
        };

    }
    // ChatGPT Usage: Partial
    save() {
        if(this.email.includes("erroremail")){
            throw new Error('Error saving user');
        }
        const index = mockedUsers.findIndex(u => u._id.equals(this._id));
        if (index !== -1) {
            mockedUsers[index] = new User({
                ...mockedUsers[index],
                ...this,
                });
        } else {
            mockedUsers.push(this);
        }
        return { success: true, message: "User saved successfully" };
    }
}

// ChatGPT Usage: Partial
User.find = jest.fn((query) => {
    if (!query) return { exec: () => mockedUsers };
    const { $and, learningPreference, interestedLanguages, proficientLanguages } = query;

    const userId = $and.find((cond) => cond._id && cond._id.$ne)._id.$ne;
    const notInterestUsers = $and.find((cond) => cond._id && cond._id.$nin)._id.$nin;
    let filteredUsers = mockedUsers.filter((user) => {
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
});

// ChatGPT Usage: Partial
User.findById = jest.fn().mockImplementation((id) =>{ 
    if(id === "errorId"){
        throw new Error('User not found');
    }
    let user = mockedUsers.find((user) => user._id.equals(id));
    return user;
})

// ChatGPT Usage: Partial
User.findOne = jest.fn().mockImplementation((query) =>{
    const { email } = query;
    let user = mockedUsers.find((user) => user.email === email) ?? null;
    return user;
})

const mockedUsers = mockUsers.map((user) => new User(user));

  
module.exports = { User, mockedUsers };
  