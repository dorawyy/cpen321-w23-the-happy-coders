
const request = require('supertest');
const app = require('../app'); 
const { ObjectId } = require('mongodb');
const {mockedUsers} = require('../models/__mocks__/user');
const {mockedEvents} = require('../models/__mocks__/event');

jest.mock('googleapis');
jest.mock('google-auth-library');
jest.mock('../models/user');
jest.mock('../models/event');

describe('GET /events/:hostUserId', () => {
    // Input:  valid hostUserId (mockUser[5])
    // Expected status code: 200
    // Expected behaviour: return events for hostUserId
    // Expected output: { success: true, events: [mockEvent0, mockEvent1, mockEvent2] }
    // ChatGPT Usage: No
    test('Succesfully get events for hostUserId', async () => {

        const response = await request(app).get(`/events/${mockedUsers[5]._id}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toEqual(true);
        expect(response.body.events.length).toEqual(mockedEvents.length);
        
        const expectedEventsId = mockedEvents.map(event => event._id.toString());
        for (let i = 0; i < response.body.events.length; i++) {
            expect(expectedEventsId).toContain(response.body.events[i]._id);
        }
    });

    // Input:  invalid hostUserId
    // Expected status code: 401
    // Expected behaviour: return error message
    // Expected output: { success: false, error: 'Error finding host or invited user' }
    // ChatGPT Usage: No
    test('Getting events for invalid hostUserId', async () => {

        const response = await request(app).get(`/events/errorId`);
        console.log(response.body)
        expect(response.status).toBe(401);  
        expect(response.body).toEqual({ success: false, error: 'Error finding host or invited user' });
    });
});

describe('GET /events/:hostUserId/:invitedUserId', () => {
    // Input:  valid hostUserId (mockUser[5]), valid invitedUserId (mockUser[7])
    // Expected status code: 200
    // Expected behaviour: return events for hostUserId
    // Expected output: { success: true, events: [ mockEvent2] }
    // ChatGPT Usage: No
    test('Succesfully get events for hostUserId and invitedUserId', async () => {

        const response = await request(app).get(`/events/${mockedUsers[7]._id}/${mockedUsers[5]._id}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toEqual(true);
        expect(response.body.events.length).toEqual(1);
        expect(response.body.events[0]._id).toEqual(mockedEvents[2]._id.toString());
    });

    // Input:  valid hostUserId, invalid invitedUserId
    // Expected status code: 401
    // Expected behaviour: return error message
    // Expected output: { success: false, error: 'Error finding host or invited user' }
    // ChatGPT Usage: No
    test('Try get events for invalid invitedUserId', async () => {
        const response = await request(app).get(`/events/${mockedUsers[5]._id}/errorId`);
        
        console.log(response.body);
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ success: false, error: 'Error finding host or invited user' });
    });

    // Input:  valid hostUserId, invalid invitedUserId (Will throw error when looking for events, hardcoded on mock)
    // Expected status code: 401
    // Expected behaviour: return error message
    // Expected output: { success: false, error: 'Error while fetching events' }
    // ChatGPT Usage: No
    test('Try get events for invalid invitedUserId', async () => {
        const response = await request(app).get(`/events/${mockedUsers[5]._id}/throwEventErrorId`);
        
        console.log(response.body);
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ success: false, error: 'Error while fetching events' });
    });
});

describe('POST /events', () => {
    // Input: valid authCode, valid event, user that has not requested access token
    // Expected status code: 200
    // Expected behaviour: return success message
    // Expected output: { success: true, message: 'Event Created' }
    // ChatGPT Usage: No
    test('Succesfully create event for user first time', async () => {

        const response = await request(app).post('/events').send({
            "authCode": "validAuthorizationCode",
            "event": {
                invitedUserId: mockedUsers[1]._id,
                hostUserId: mockedUsers[0]._id,
                startTime: "2020-10-20T16:00:00.000Z",
                durationMinutes: "30"
            }
        })

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true, message: 'Event Created' });
    });

    // Input: valid authCode, valid event, user that has requested access token
    // Expected status code: 200
    // Expected behaviour: return success message
    // Expected output: { success: true, message: 'Event Created' }
    // ChatGPT Usage: No
    test('Succesfully create event for user with valid access token', async () => {

        const response = await request(app).post('/events').send({
            "authCode": "validAuthorizationCode",
            "event": {
                invitedUserId: mockedUsers[1]._id,
                hostUserId: mockedUsers[0]._id,
                startTime: "2020-11-20T16:00:00.000Z",
                durationMinutes: "30"
            }
        })

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true, message: 'Event Created' });
    });

    // Input: valid authCode, valid event, user that has requested expired access token
    // Expected status code: 200
    // Expected behaviour: return success message
    // Expected output: { success: true, message: 'Event Created' }
    // ChatGPT Usage: No
    test('Succesfully create event for user with expired access token', async () => {

        const response = await request(app).post('/events').send({
            "authCode": "validAuthorizationCode",
            "event": {
                invitedUserId: mockedUsers[0]._id,
                hostUserId: mockedUsers[1]._id,
                startTime: "2020-12-20T16:00:00.000Z",
                durationMinutes: "30"
            }
        })

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true, message: 'Event Created' });
    });


    // Input: valid authCode, invalid event due to invalid hostUserId
    // Expected status code: 401
    // Expected behaviour: return error message
    // Expected output: { success: false, erro: 'Error finding host or invited user' }
    // ChatGPT Usage: No
    test('Creating event with invalid hostUserId', async () => {

        const response = await request(app).post('/events').send({
            "authCode": "validAuthorizationCode",
            "event": {
                invitedUserId: mockedUsers[1]._id,
                hostUserId: new ObjectId(111),
                startTime: "2020-10-20T16:00:00.000Z",
                durationMinutes: "30"
            }
        })

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ success: false, error: 'Error finding host or invited user' });
    });

    // Input: valid authCode, invalid event due to invalid invitedUserId
    // Expected status code: 401
    // Expected behaviour: return error message
    // Expected output: { success: false, erro: 'Error finding host or invited user' }
    // ChatGPT Usage: No
    test('Creating event with invalid invitedUserId', async () => {

        const response = await request(app).post('/events').send({
            "authCode": "validAuthorizationCode",
            "event": {
                invitedUserId:  new ObjectId(111),
                hostUserId: mockedUsers[0]._id,
                startTime: "2020-10-20T16:00:00.000Z",
                durationMinutes: "30"
            }
        })

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ success: false, error: 'Error finding host or invited user' });
    });

    // Input: invalid authCode, valid event
    // Expected status code: 401
    // Expected behaviour: return error message
    // Expected output: { success: false, erro: 'Invalid authorization code' }
    // ChatGPT Usage: No
    test('Creating event fails due to invalid authorization code', async () => {

        const response = await request(app).post('/events').send({
            "authCode": "invalidAuthorizationCode",
            "event": {
                invitedUserId: mockedUsers[0]._id,
                hostUserId: mockedUsers[4]._id,
                startTime: "2020-10-20T16:00:00.000Z",
                durationMinutes: "30"
            }
        })

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ success: false, error: 'Invalid authorization code' });
    });

    // Input: valid authCode, valid event (But with durationMinutes = 0, this is hardcoded in our mock to throw an error when inserting into calendar)
    // Expected status code: 401
    // Expected behaviour: return error message
    // Expected output: { success: false, erro: 'Invalid authorization code' }
    // ChatGPT Usage: No
    test('Creating event fails when inserting into calendar', async () => {

        const response = await request(app).post('/events').send({
            "authCode": "validAuthorizationCode",
            "event": {
                invitedUserId: mockedUsers[1]._id,
                hostUserId: mockedUsers[0]._id,
                startTime: "2020-10-20T16:00:00.000Z",
                durationMinutes: "0"
            }
        })

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ success: false, error: 'Error creating event' });
    });
});