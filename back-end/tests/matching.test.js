const request = require('supertest');
const app = require('../app');
const {User, mockedUsers} = require('../models/__mocks__/user.js');

jest.mock('../models/user');
jest.mock('../models/chatroom');
jest.mock('../models/badge');

describe('POST /matches', () => {

    // Input: valid sourceUserId, valid targetUserId that has sourceUserId in likedUsers list
    // Expected status code: 200
    // Expected behaviour: return match status
    // Expected output: {match: true}
    // ChatGPT Usage: No
    test('Like user who previously liked user', async () => {
        const response = await request(app).post('/matches').send({
            sourceUserId: mockedUsers[0]._id.toString(), 
            targetUserId: mockedUsers[1]._id.toString()});
        expect(response.status).toBe(200);
        expect(response.body).toEqual({match: true});
        let user = await User.findById(mockedUsers[0]._id.toString())
        expect(user.matchedUsers.includes(mockedUsers[1]._id.toString())).toBe(true);
    });

    // Input: invalid user id
    // Expected status code: 500
    // Expected behaviour: return error message
    // Expected output: {error: "Error creating match"}
    // ChatGPT Usage: No
    test('Invalid user id', async () => {
        const response = await request(app).post('/matches').send({
            sourceUserId: '1', 
            targetUserId: mockedUsers[1]._id.toString()});
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
        const response = await request(app).post('/matches').send({
            sourceUserId: mockedUsers[5]._id.toString(), 
            targetUserId: mockedUsers[4]._id.toString()});
        expect(response.status).toBe(200);
        expect(response.body).toEqual({match: false});
    });
});

