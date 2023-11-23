const { ObjectId } = require('mongodb');
const { Chatroom } = require('../chatroom');

const mockChat0 = new Chatroom({
    _id: new ObjectId('5f9d88b9d4b4d4c6a0b0f6a8'),
    messages: [
      {
        sourceUserId: '5f9d88b9d4b4d4c6a0b0f6a0',
        content: 'User 1',
      },
      {
        sourceUserId: '5f9d88b9d4b4d4c6a0b0f6a1',
        content: 'User 2',
      },
    ],
    user1Id: '5f9d88b9d4b4d4c6a0b0f6a0', 
    user2Id: '5f9d88b9d4b4d4c6a0b0f6a1', 
  });
  
  const mockChat1 = new Chatroom({
    _id: new ObjectId('5f9d88b9d4b4d4c6a0b0f6a9'),
    messages: [
        {
          sourceUserId: '5f9d88b9d4b4d4c6a0b0f6a2',
          content: 'User 1',
        },
        {
          sourceUserId: '5f9d88b9d4b4d4c6a0b0f6a3',
          content: 'User 2',
        },
      ],
      user1Id: '5f9d88b9d4b4d4c6a0b0f6a2', 
      user2Id: '5f9d88b9d4b4d4c6a0b0f6a3', 
  });

  const mockChat2 = new Chatroom({
    _id: new ObjectId('5f9d88b9d4b4d4c6a0b0f6b1'),
    messages: [
    ],
      user1Id: '5f9d88b9d4b4d4c6a0b0f6a7', 
      user2Id: '5f9d88b9d4b4d4c6a0b0f6a6', 
  });
  
  const mockedChats = [mockChat0, mockChat1, mockChat2];  

  module.exports = {mockedChats};
  