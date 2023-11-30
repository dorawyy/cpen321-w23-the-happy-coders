const request = require('supertest');
const app = require('../app'); // Adjust the path as needed
const { mockedBadges} = require('../models/__mocks__/badge.js');
const { mockedUsers } = require('../models/__mocks__/user.js');

jest.mock('../models/badge');
jest.mock('../models/user');

describe('GET /badges/:userId', () => {

    // Input: valid userId with badges
    // Expected status code: 200
    // Expected behaviour: return list badge icons
    // Expected output: [mockedBadges[0].icon, mockedBadges[1].icon]
    // ChatGPT Usage: No
    test('Get badge icons for valid user with badges', async () => {
        const response = await request(app).get(`/badges/${mockedUsers[0]._id}`);
        expect(response.status).toBe(200);
        expect(response.body.icons).toEqual([mockedBadges[0].icon, mockedBadges[1].icon]);
    });

    // Input: valid userId with no badges
    // Expected status code: 200
    // Expected behaviour: return list badge icons
    // Expected output: [mockedBadges[0].icon, mockedBadges[1].icon]
    // ChatGPT Usage: No
    test('Get badge icons for valid user with no badges', async () => {
        const response = await request(app).get(`/badges/${mockedUsers[1]._id}`);
        expect(response.status).toBe(200);
        expect(response.body.icons).toEqual([]);
    });

    // Input: invalid userId with no badges
    // Expected status code: 500
    // Expected behaviour: return error message
    // Expected output: {error: "Error getting badge icons"}
    // ChatGPT Usage: No
    test('Get badge icons for invalid user', async () => {
        const response = await request(app).get(`/badges/1`);
        expect(response.status).toBe(500);
        expect(response.body).toEqual({error: "Error getting badge icons"});
    });
});

