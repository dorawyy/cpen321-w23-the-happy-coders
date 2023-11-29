
  // __mocks__/googleapis.js

const mockGoogleApis = {
    // Create mocked versions of the methods or objects you're using
    google: {

      calendar: jest.fn(() => ({
        events: {
          insert: jest.fn().mockImplementation((object) =>{
            if (object.resource.end.dateTime === object.resource.start.dateTime) {  // If the event has no duration
              throw new Error('Error creating event');
            }
            return { data: { htmlLink: 'mockLink' } };
          }),
          delete: jest.fn().mockImplementation(({eventId}) =>{
            if (eventId === "invalidGoogleEventId") {
              throw new Error('Error deleting event');
            }
            return;
          })
        },
      })),

      auth: {
        OAuth2: jest.fn().mockImplementation((clientId, clientSecret) => ({
          clientId,
          clientSecret,
          setCredentials: jest.fn(),
        })),
      },
    
    },
  };
  
  module.exports = mockGoogleApis;
  