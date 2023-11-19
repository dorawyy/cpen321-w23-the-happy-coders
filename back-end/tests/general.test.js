const request = require('supertest');
const app = require('../server'); // Adjust the path as needed
const mongoose = require('mongoose');


describe('GET /', () => {
    afterAll(async () => {
        // Disconnect from the database after running tests
        await mongoose.disconnect();
    });

    it('responds with "LangSync"', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('LangSync');
    });
});