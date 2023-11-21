const {mockedUsers, unregisteredUser} = require('../models/__mocks__/mockedUsers');

class MockedOAuth2Client {
    constructor({ clientId, clientSecret }) {
      this.clientId = clientId;
      this.clientSecret = clientSecret;
      // Add any necessary initialization code
    }
  
    setCredentials({ access_token }) {
      this.access_token = access_token;
      // Mocked implementation of setting credentials
    }
  
    async verifyIdToken({ idToken, audience }) {
      let email
      switch (idToken) {
        case 'validToken':
          email = 'mocked@email.com';
          break;
        case 'validTokenUnregisteredUser':
          email = unregisteredUser.email;
          break;
        case 'validTokenRegisteredMockUser0':
          email = mockedUsers[0].email;
          break;
        case 'validTokenBannedMockUser7':
          email = mockedUsers[7].email;
          break;
        default:
          throw new Error('Invalid token or audience');
      }
      return { 
        getPayload: () => ({
          sub: 'mockedUserID', 
          email: email 
      })};    }
  
    async getToken(authorizationCode) {
      if (authorizationCode === 'validAuthorizationCode') {
        return {
          tokens: {
            access_token: 'mockedAccessToken',
            refresh_token: 'mockedRefreshToken',
          },
        };
      } else {
        throw new Error('Invalid authorization code');
      }
      // Mocked implementation of token retrieval
    }
  }
  
  module.exports = {
    OAuth2Client: MockedOAuth2Client,
  };
  