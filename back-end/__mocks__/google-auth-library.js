const { unregisteredUser, errorUser} = require('../models/__mocks__/mockedUsers');
const { mockedUsers } = require('../models/__mocks__/user');

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
        case 'validTokenRegisteredMockUser1':
            email = mockedUsers[1].email;
            break;
        case 'validTokenRegisteredMockUser5':
          email = mockedUsers[5].email;
          break;
        case 'validTokenBannedMockUser7':
          email = mockedUsers[7].email;
          break;
        case 'validTokenErrorOnSave':
          email = errorUser.email;
          break;
        case 'validTokenUnregisteredAlreadyInDbMockedUser8':
          email = mockedUsers[8].email;
          break;
        default:
          throw new Error('Invalid token or audience');
      }
      const returnObj ={ 
        getPayload: () => ({
          sub: 'mockedUserID', 
          email
      })};

      return returnObj;    
    }
  
    async getToken(authorizationCode) {
      if (authorizationCode === 'validAuthorizationCode') {
        const tokens = {
          access_token: 'validAccessToken',
          refresh_token: 'validRefreshToken',
          expiry_date: Date.now() + 1000000,
        }

        const returnObj = {tokens};
        return returnObj;
      } else {
        throw new Error('Invalid authorization code');
      }
      // Mocked implementation of token retrieval
    }

    async refreshToken (refreshToken) {
      if(refreshToken === 'validRefreshToken'){
        const tokens = {
          access_token: 'validAccessToken',
        }

        const returnObj = {tokens};
        return returnObj;
      }
    }
  }
  
  module.exports = {
    OAuth2Client: MockedOAuth2Client,
  };
  