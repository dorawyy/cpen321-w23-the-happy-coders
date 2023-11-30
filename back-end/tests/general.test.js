const request = require('supertest');
const app = require('../app');

// ChatGPT Usage: No
describe('GET /', () => {

    it('responds with "LangSync"', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('LangSync');
    });
});