const request = require('supertest');
const app = require('../app'); // Adjust the path as needed
const { mockedUsers} = require('../models/__mocks__/user.js');
const { mockedChats} = require('../models/__mocks__/chatroom.js');

jest.mock('../models/user');
jest.mock('../models/chatroom');
jest.mock('openai');
jest.mock('google-auth-library');

describe('GET /chatrooms/all/:userId/:idToken', () => {

    // Input: valid userId, valid idToken
    // Expected status code: 200
    // Expected behaviour: return list of chatrooms
    // Expected output: [mockedChats[0]._id.toString()]
    // ChatGPT Usage: No
    test('Get chatrooms for valid user 0', async () => {
        const response = await request(app).get(`/chatrooms/all/${mockedUsers[0]._id}/validTokenRegisteredMockUser0`);
        expect(response.status).toBe(200);
        const chatroomIds = response.body.chatroomList.map((chatroom) => chatroom._id);
        expect(chatroomIds).toEqual([mockedChats[0]._id.toString()]);
    });

    // Input: valid userId, valid idToken
    // Expected status code: 200
    // Expected behaviour: return list of chatrooms
    // Expected output: [mockedChats[1]._id.toString()]
    // ChatGPT Usage: No
    test('Get chatrooms for valid user 1', async () => {
        const response = await request(app).get(`/chatrooms/all/${mockedUsers[1]._id}/validTokenRegisteredMockUser1`);
        expect(response.status).toBe(200);
        const chatroomIds = response.body.chatroomList.map((chatroom) => chatroom._id);
        expect(chatroomIds).toEqual([mockedChats[0]._id.toString()]);
    });

    // Input: invalid userId, valid idToken
    // Expected status code: 500
    // Expected behaviour: return error message
    // Expected output: {error: "Error getting chatrooms"}
    // ChatGPT Usage: No
    test('Get chatrooms for invalid user', async () => {
        const response = await request(app).get(`/chatrooms/all/1/validToken`);
        expect(response.status).toBe(500);
        expect(response.body.error).toEqual("Error getting chatrooms");
    });

    // Input: valid userId, valid idToken
    // Expected status code: 200
    // Expected behaviour: return empty list
    // Expected output: []
    // ChatGPT Usage: No
    test('Get chatrooms for user with no chatrooms', async () => {
        const response = await request(app).get(`/chatrooms/all/${mockedUsers[5]._id}/validTokenRegisteredMockUser5`);
        expect(response.status).toBe(200);
        const chatroomIds = response.body.chatroomList.map((chatroom) => chatroom._id);
        expect(chatroomIds).toEqual([]);
    });

    // Input: valid userId, invalid idToken
    // Expected status code: 401
    // Expected behaviour: return error message
    // Expected output: {error: "Error authenticating user"}    
    test("Try to get chatrooms with invalid idToken", async () => {
        const response = await request(app).get(`/chatrooms/all/${mockedUsers[0]._id}/invalidToken`);
        expect(response.status).toBe(401);
        expect(response.body.error).toEqual("Error authenticating user");
    });

     // Input: valid userId, valid idToken, but not relative to same user
    // Expected status code: 401
    // Expected behaviour: return error message
    // Expected output: {error: "Error authenticating user"}    
    test("Try to get chatrooms with another user idToken", async () => {
        const response = await request(app).get(`/chatrooms/all/${mockedUsers[0]._id}/validTokenRegisteredMockUser5`);
        expect(response.status).toBe(401);
        expect(response.body.error).toEqual("Error authenticating user");
    });
});


describe('GET chatrooms/:id/messages', () => {
    // Input: valid chatroom id
    // Expected status code: 200
    // Expected behaviour: return list of messages in chatroom
    // Expected output: { messages: mockedChats[0].messages }
    // ChatGPT Usage: No
    test('Get messages for valid chatroom id', async () => {
        const response = await request(app).get(`/chatrooms/${mockedChats[0]._id}/messages`);
        expect(response.status).toBe(200);
        expect(response.body.messages).toEqual(mockedChats[0].messages);
    });

    // Input: invalid chatroom id
    // Expected status code: 500
    // Expected behaviour: return error message
    // Expected output: {error: "Error getting messages"}
    // ChatGPT Usage: No
    test('Get messages for invalid chatroom id', async () => {
        const response = await request(app).get(`/chatrooms/1/messages`);
        expect(response.status).toBe(500);
        expect(response.body).toEqual({error: "Error getting messages"});
    });

    // Input: valid chatroom id
    // Expected status code: 200
    // Expected behaviour: return empty list
    // Expected output: { messages: [] }
    // ChatGPT Usage: No
    test('Get messages for valid chatroom id that contains no messages', async () => {
        const response = await request(app).get(`/chatrooms/${mockedChats[2]._id}/messages`);
        expect(response.status).toBe(200);
        expect(response.body.messages).toEqual(mockedChats[2].messages);
    });
});

describe('POST chatrooms/:id/messages', () => {

    // Input: valid chatroom id, ai turned off
    // Expected status code: 200
    // Expected behaviour: return sent message and user id
    // Expected output: { sourceUserId: mockedUsers[0]._id.toString(), content: "Hello"}
    // ChatGPT Usage: No
    test('Send message to valid chatroom with ai bot turned off', async () => {
        const response = await request(app).post(`/chatrooms/${mockedChats[0]._id.toString()}/messages`).send({content: "Hello", sourceUserId: mockedUsers[0]._id, learningSession: false});
        expect(response.status).toBe(200);
        expect(response.body.message).toEqual({ sourceUserId: mockedUsers[0]._id.toString(), content: "Hello"});
    });

    // Input: valid chatroom id, ai turned off
    // Expected status code: 200
    // Expected behaviour: return ai message and ai userid
    // Expected output: { sourceUserId: "6541a9947cce981c74b03ecb", content: "AI Assistant: Mocked completion content"}
    // ChatGPT Usage: No
    test('Send message to valid chatroom with ai bot turned on', async () => {
        const response = await request(app).post(`/chatrooms/${mockedChats[2]._id}/messages`).send({content: "Hello", sourceUserId: mockedUsers[0]._id, learningSession: true});
        expect(response.status).toBe(200);
        expect(response.body.message).toEqual({ sourceUserId: "6541a9947cce981c74b03ecb", content: "AI Assistant: Mocked completion content"});
    });

    // Input: invalid chatroom id
    // Expected status code: 500 
    // Expected behaviour: return error message
    // Expected output: {error: "Error sending message"}
    // ChatGPT Usage: No
    test('Send message to invalid chatroom', async () => {
        const response = await request(app).post(`/chatrooms/1/messages`).send({content: "Hello", sourceUserId: mockedUsers[0]._id, learningSession: false});
        expect(response.status).toBe(500);
        expect(response.body).toEqual({error: "Error sending message"});
    });

});
