const request = require('supertest');
const app = require('../app'); // Adjust the path as needed
const { RtcTokenBuilder } = require('agora-access-token');



describe('GET /:channel/:role/:tokentype/:uid', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });


    // Input: empty channel, valid role, tokenType, uid
    // Expected status code: 400 
    // Expected behaviour: return error message
    // Expected output: {'error': 'channel is required'}
    // ChatGPT Usage: No
    test('Make request with empty channel', async () => {
        const channel = " ";
        const role = "publisher";
        const tokentype = "uid";
        const uid = "1";

        const response = await request(app).get(`/agoraToken/${channel}/${role}/${tokentype}/${uid}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ 'error': 'channel is required'  });
    });

    // Input: wrong role, valid uid, tokenType, channel
    // Expected status code: 400 
    // Expected behaviour: return error message
    // Expected output: {'error': 'role is incorrect'}
    // ChatGPT Usage: No
    test('Make request with incorrect role', async () => {
        const channel = "test";
        const role = "publisherd";
        const tokentype = "uid";
        const uid = "1";

        const response = await request(app).get(`/agoraToken/${channel}/${role}/${tokentype}/${uid}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ 'error': 'role is incorrect'  });
    });

    // Input: invalid tokenType, valid uid, role, channel
    // Expected status code: 400 
    // Expected behaviour: return error message
    // Expected output: {'error': 'token type is incorrect'}
    // ChatGPT Usage: No
    test('Make request with invalid token type', async () => {
        const channel = "test";
        const role = "publisher";
        const tokentype = "djfdsj";
        const uid = "1";

        const response = await request(app).get(`/agoraToken/${channel}/${role}/${tokentype}/${uid}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ 'error': 'token type is incorrect'  });
    });

    // Input: tokenType = userAccount , valid uid, role, channel
    // Expected status code: 200 
    // Expected behaviour: return token
    // Expected output: { 'agoraToken': 'testToken'  }
    // ChatGPT Usage: No
    test('Make succesfull request for userAccount Token type', async () => {
        const channel = "test";
        const role = "audience";
        const tokentype = "userAccount";
        const uid = "1";

        RtcTokenBuilder.buildTokenWithAccount = jest.fn().mockReturnValue("testToken");

        const response = await request(app).get(`/agoraToken/${channel}/${role}/${tokentype}/${uid}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ 'agoraToken': 'testToken'  });
    });

    // Input: tokenType = uid , valid uid, role, channel
    // Expected status code: 200 
    // Expected behaviour: return token
    // Expected output: { 'agoraToken': 'testToken'  }
    // ChatGPT Usage: No
    test('Make succesfull request for uid Token type', async () => {
        const channel = "test";
        const role = "audience";
        const tokentype = "uid";
        const uid = "1";

        RtcTokenBuilder.buildTokenWithUid = jest.fn().mockReturnValue("testToken");

        const response = await request(app).get(`/agoraToken/${channel}/${role}/${tokentype}/${uid}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ 'agoraToken': 'testToken'  });
    });
});



