const request = require('supertest');
const app = require('../app'); 
const {  unregisteredUser, unregisteredAdmin, errorUser } = require('../models/__mocks__/mockedUsers');
const {User, mockedUsers} = require('../models/user');
require('dotenv').config();

jest.mock('googleapis');
jest.mock('google-auth-library');
jest.mock('../models/user');


describe('POST /authentication/login', () => {
     // Input: valid idToken
    // Expected status code: 200
    // Expected behaviour: return success message
    // Expected output: { success: true, userId: mockedUsers[0]._id.toString() }
    test('Login with registered user', async () => {
        const response = await request(app).post('/authentication/login').send({idToken: 'validTokenRegisteredMockUser0'});
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({success: true, userId: mockedUsers[0]._id.toString()});
    });

    // Input: invalid idToken
    // Expected status code: 401
    // Expected behaviour: return error message
    // Expected output: { success: false, error: 'Token verification failed' }
    test('Test login with invalid Token', async () => {
        const response = await request(app).post('/authentication/login').send({idToken: 'invalidToken'});
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({success: false, error: 'Token verification failed'});
    });

    // Input: valid idToken for unregistered user
    // Expected status code: 401
    // Expected behaviour: return error message
    // Expected output: { success: false, error: 'User not registered' }
    test('Try login with unregistered user', async () => {
        const response = await request(app).post('/authentication/login').send({idToken: 'validTokenUnregisteredUser'});
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({success: false, error: 'User not registered'});
    });

    // Input: valid idToken for banned user
    // Expected status code: 401
    // Expected behaviour: return error message
    // Expected output: {success: false, error: "User banned"}
    test('Try login with banned user', async () => {
        const response = await request(app).post('/authentication/login').send({idToken: 'validTokenBannedMockUser7'});
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({success: false, error: "User banned"});
    });
});

describe('POST /authentication/admin-login', () => {
    // Input: valid access code and registered user email (mockedUser[0])
    // Expected status code: 200
    // Expected behaviour: return success message
    // Expected output: {success: true, userId: mockedUsers[0]._id.toString()}
    test('Correct accessCode and registered  user', async () => {
        const response = await request(app).post('/authentication/admin-login').send({
            accessCode: process.env.ADMIN_ACCESS_CODE,
            email: mockedUsers[0].email
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({success: true, userId: mockedUsers[0]._id.toString()});
    });

    // Input: invalid access code
    // Expected status code: 401
    // Expected behaviour: return error message
    // Expected output: {success: false, error: "Invalid access code"}
    test('Invalid admin access code', async () => {
        const response = await request(app).post('/authentication/admin-login').send({
            accessCode: 'invalidToken',
            email:'email'
        });
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({success: false, error: 'Invalid access code'});
    });

    // Input: valid access code and unregistered email
    // Expected status code: 200
    // Expected behaviour: return success message and create new admin user
    // Expected output: {success: true, userId: <new random user id> }
    test('Valid access code and unregistered user', async () => {
        expect(User.findOne({email: unregisteredAdmin.email})).toBeNull();

        const response = await request(app).post('/authentication/admin-login').send({
            accessCode: process.env.ADMIN_ACCESS_CODE,
            email:unregisteredAdmin.email   
        });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toEqual(true);

        expect(User.findOne({email: unregisteredAdmin.email})).not.toBeNull();
    });

    // Input: valid access code and user email that will throw error on save (hard coded on mock)
    // Expected status code: 401
    // Expected behaviour: return success message and create new admin user
    // Expected output: {success: true, userId: <new random user id> }
    test('Valid access code and user that will throw error on save', async () => {
        const response = await request(app).post('/authentication/admin-login').send({
            accessCode: process.env.ADMIN_ACCESS_CODE,
            email:errorUser.email   
        });

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({"error": "Error saving user", "success": false}   );
    });

    // Input: valid access code and email of banned user
    // Expected status code: 401
    // Expected behaviour: return error message
    // Expected output: {success: false, error: "User banned"}
    test('Banned user', async () => {
        const response = await request(app).post('/authentication/admin-login').send({
            accessCode: process.env.ADMIN_ACCESS_CODE,
            email:mockedUsers[7].email
        });
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({success: false, "error": "User banned"});
    });
});

describe('POST /authentication/signup', () => {
    // Input: valid idToken for user not registered
    // Expected status code: 200
    // Expected behaviour: return success message and create user
    // Expected output: {success: true, userId: <new random user id> }
    test('Unregistered user', async () => {
        expect(User.findOne({email: unregisteredUser.email})).toBeNull();

        const response = await request(app).post('/authentication/signup').send({idToken: 'validTokenUnregisteredUser'});
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toEqual(true);

        expect(User.findOne({email: unregisteredUser.email})).not.toBeNull();
    });

    // Input: valid idToken for user not registered but already tried once and is on db
    // Expected status code: 200
    // Expected behaviour: return success message
    // Expected output: {success: true, userId: mockedUsers[8]._id.toString() }
    test('Unregistered user that already tried to register once', async () => {
        expect(User.findOne({email: mockedUsers[8].email})).not.toBeNull();

        const response = await request(app).post('/authentication/signup').send({idToken: 'validTokenUnregisteredAlreadyInDbMockedUser8'});
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual( {success: true, userId: mockedUsers[8]._id.toString() });
    });

    // Input: invalid idToken
    // Expected status code: 401
    // Expected behaviour: return error message and not create user
    // Expected output: {success: false, error: "Token verification failed"}
    test('Invalid Token', async () => {
        const response = await request(app).post('/authentication/signup').send({idToken: 'invalidToken'});
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({success: false, error: 'Token verification failed'});
    });

    // Input: valid idToken for  user already registered
    // Expected status code: 401
    // Expected behaviour: return error message
    // Expected output: {success: false, error: "User already registered"}
    test('Registered user', async () => {
        const response = await request(app).post('/authentication/signup').send({idToken: 'validTokenRegisteredMockUser0'});
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({success: false, "error": "User already registered"});
    });

    // Input: valid idToken for  user that will throw error on save (hard coded in mock)
    // Expected status code: 401
    // Expected behaviour: return error message
    // Expected output: {success: false, error: "Error saving user"}
    test('Error when saving user', async () => {
        const response = await request(app).post('/authentication/signup').send({idToken: 'validTokenErrorOnSave'});
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({success: false, error: "Error saving user"});
    });
});