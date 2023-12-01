const { mockedBadges} = require('../models/__mocks__/badge.js');
const { mockedUsers } = require('../models/__mocks__/user.js');
const badgeService = require('../services/badgeService.js');

jest.mock('../models/badge');
jest.mock('../models/user');

describe('Assigning badges to users', () => {
    // Input: valid userId with 5 lessons
    // Expected behaviour: silver badge is assigned to mockedUsers[8] 
    // Expected output: true
    // ChatGPT Usage: No
    test('Assigning silver badge to user', async () => {
        let response = await badgeService.assignBadge(mockedUsers[8], "Lesson");
        expect(response).toBe(true);
        expect(mockedUsers[8].badges).toContainEqual(mockedBadges[4]._id);
    });

    // Input: valid userId with 1 lesson
    // Expected behaviour: bronze badge is assigned to mockedUsers[7] 
    // Expected output: true
    // ChatGPT Usage: No
    test('Assigning bronze badge to user', async () => {
        let response = await badgeService.assignBadge(mockedUsers[7], "Lesson");
        expect(response).toBe(true);
        expect(mockedUsers[7].badges).toContainEqual(mockedBadges[5]._id);
    });

    // Input: valid userId with 10 lessons
    // Expected behaviour: gold badge is assigned to mockedUsers[6] 
    // Expected output: true
    // ChatGPT Usage: No
    test('Assigning silver badge to user', async () => {
        let response = await badgeService.assignBadge(mockedUsers[6], "Lesson");
        expect(response).toBe(true);
        expect(mockedUsers[6].badges).toContainEqual(mockedBadges[3]._id);
    });
});

