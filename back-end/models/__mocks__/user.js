const  mockUsers  = require("./mockedUsers");

  
// Mocking the User model methods
const User = {
    find: jest.fn().mockResolvedValue(mockUsers),
    findById: jest.fn().mockImplementation((id) =>{
        user = mockUsers.find((user) => user._id.equals(id));
        return user;
    }),
};
  
module.exports = { User };
  