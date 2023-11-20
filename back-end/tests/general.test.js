const request = require('supertest');
const app = require('../app'); // Adjust the path as needed


describe('GET /', () => {

    it('responds with "LangSync"', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('LangSync');
    });
});