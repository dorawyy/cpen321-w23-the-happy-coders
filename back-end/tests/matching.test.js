const request = require('supertest');
const app = require('../app'); // Adjust the path as needed
const {User, mockedUsers} = require('../models/__mocks__/user.js');

jest.mock('../models/user');
jest.mock('../models/chatroom');
jest.mock('openai');

describe('POST /matches', () => {

    // Input: valid sourceUserId, valid targetUserId that has sourceUserId in likedUsers list
    // Expected status code: 200
    // Expected behaviour: return match status
    // Expected output: {match: true}
    // ChatGPT Usage: No
    test('Like user who previously liked user', async () => {
        const response = await request(app).post('/matches').send({sourceUserId: '5f9d88b9d4b4d4c6a0b0f6a0', targetUserId: '5f9d88b9d4b4d4c6a0b0f6a1'});
        expect(response.status).toBe(200);
        expect(response.body).toEqual({match: true});
        let user = await User.findById('5f9d88b9d4b4d4c6a0b0f6a0')
        expect(user.matchedUsers.includes('5f9d88b9d4b4d4c6a0b0f6a1')).toBe(true);
    });

    // Input: invalid user id
    // Expected status code: 500
    // Expected behaviour: return error message
    // Expected output: {error: "Error creating match"}
    // ChatGPT Usage: No
    test('Invalid user id', async () => {
        const response = await request(app).post('/matches').send({sourceUserId: '1', targetUserId: '5f9d88b9d4b4d4c6a0b0f6a1'});
        expect(response.status).toBe(500);
        expect(response.body).toEqual({error: "Error creating match"});
    });


    // Input: empty body
    // Expected status code: 500
    // Expected behaviour: return error message
    // Expected output: {error: "Error creating match"}
    // ChatGPT Usage: No
    test('Not passing in a body', async () => {
        const response = await request(app).post('/matches').send();
        expect(response.status).toBe(500);
        expect(response.body).toEqual({error: "Error creating match"});
    });

    // Input: valid sourceUserId, valid targetUserId that does not have sourceUserId in likedUsers list
    // Expected status code: 200
    // Expected behaviour: return match status
    // Expected output: {match: false}
    // ChatGPT Usage: No
    test('Liking a user who does not like you back', async () => {
        const response = await request(app).post('/matches').send({sourceUserId: '5f9d88b9d4b4d4c6a0b0f6a5', targetUserId: '5f9d88b9d4b4d4c6a0b0f6a4'});
        expect(response.status).toBe(200);
        expect(response.body).toEqual({match: false});
    });
});

