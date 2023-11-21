const request = require('supertest');
const app = require('../app'); 
const { mockedUsers, unregisteredUser, unregisteredAdmin } = require('../models/__mocks__/mockedUsers');
const {User} = require('../models/user');


describe('GET /users/:id', () => {

    // Input: A valid userId - mockedUsers[0]
    // Expected status code: 200
    // Expected behaviour: Returns the user
    // Expected output: { success: true, user: mockedUsers[0] }
    test('Valid id', async () => {
        const response = await request(app).get(`/users/${mockedUsers[0]._id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({success: true, user: mockedUsers[0]});
    });


    // Input: An invalid userId (one not in the database)
    // Expected status code: 400
    // Expected behaviour: Returns an error message
    // Expected output: { success: false, error: 'Invalid user id' }
    test('Invalid id', async () => {
        const response = await request(app).get('/users/invalidId');
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({success: false, error: 'Invalid user id'});
    });


    // Input: A userId that will throw error when searching for user in the database (hardcoded to throw an error in our mock)
    // Expected status code: 500
    // Expected behaviour: Returns an error message
    // Expected output: { success: false, error: 'Error getting user' }
    test('Get a database error', async () => {
        const response = await request(app).get(`/users/errorId}`);
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({success: false, error: 'Error getting user'});
    });
});


describe('PUT /users/:id/prefs', () => {

    // Input: A valid userId belonging to a registered user - mockedUsers[0]
    // Expected status code: 200
    // Expected behaviour: Returns success message
    // Expected output: { success: true }
    test('Valid registered id', async () => {
        const response = await request(app).put(`/users/${mockedUsers[0]._id}/prefs`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({success: true, message: "User updated successfully"});
    });


    // Input: A valid userId belonging to an unregistered user - mockedUsers[8]
    // Expected status code: 200
    // Expected behaviour: Returns success message
    // Expected output: { success: true }
    test('Valid unregistered id', async () => {
        const response = await request(app).put(`/users/${mockedUsers[8]._id}/prefs`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({success: true, message: "User updated successfully"});
    });


    // Input: A userId for a user that is banned - mockedUsers[7]
    // Expected status code: 400
    // Expected behaviour: Returns an error message
    // Expected output: { success: false, error: 'User banned' }
    test('Banned user', async () => {
        const response = await request(app).put(`/users/${mockedUsers[7]._id}/prefs`);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({success: false, error: 'User banned'});
    });


    // Input: An invalid userId
    // Expected status code: 400
    // Expected behaviour: Returns an error message
    // Expected output: { success: false, error: 'Invalid user id' }
    test('Invalid id', async () => {
        const response = await request(app).put('/users/invalidId/prefs');
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({success: false, error: 'Invalid user id'});
    });


    // Input: A userId that will throw error when searching for user in the database (hardcoded to throw an error in our mock)
    // Expected status code: 500
    // Expected behaviour: Returns an error message
    // Expected output: { success: false, error: 'Error saving updates to user' }
    test('Get a database error', async () => {
        const response = await request(app).get(`/users/errorId}`);
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({success: false, error: 'Error saving updates to user'});
    });
});