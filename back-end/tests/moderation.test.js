const request = require('supertest');
const app = require('../app'); 

jest.mock('../models/user');
jest.mock('../models/report');

const { mockedUsers } = require('../models/__mocks__/mockedUsers');
const { mockedReports } = require('../models/__mocks__/mockedReports');

describe('GET /moderation/:adminId', () => {

    // Input: A valid adminId
    // Expected status code: 200
    // Expected behaviour: Returns the reports
    // Expected output: { success: true, reports: mockedReports }
    test('Valid adminId', async () => {
        const response = await request(app).get(`/moderation/${mockedUsers[1]._id}`);
        expect(response.statusCode).toBe(200);
        const expectedReports = { success: true, reports: mockedReports };
        expect(response.body).toEqual(expectedReports);
    });


    // Input: An invalid adminId (one not in the database)
    // Expected status code: 403
    // Expected behaviour: Returns an error message
    // Expected output: { success: false, error: 'Unauthorized access to admin actions' }
    test('Invalid adminId', async () => {
        const response = await request(app).get('/moderation/invalidId');
        expect(response.statusCode).toBe(403);
        expect(response.body).toEqual({success: false, error: 'Unauthorized access to admin actions'});
    });


    // Input: An adminId that will throw error when searching for admin in the database (hardcoded to throw an error in our mock)
    // Expected status code: 500
    // Expected behaviour: Returns an error message
    // Expected output: { success: false, error: 'Error getting reports' }
    test('Get a database error', async () => {
        const response = await request(app).get(`/moderation/errorId`);
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({success: false, error: 'Error getting reports'});
    });
});

describe('POST /moderation', () => {
    
    // Input: A valid report
    // Expected status code: 200
    // Expected behaviour: Returns success message
    // Expected output: { success: true }
    test('Valid report', async () => {
        const response = await request(app).post('/moderation').send(
            {
                reporterUserId: new ObjectId('5f9d88b9d4b4d4c6a0b0f6a6'),
                reportedUserId: new ObjectId('5f9d88b9d4b4d4c6a0b0f6a7'),
                chatRoomId: new ObjectId('5f9d88b9d4b4d4c6a0b0f7g9'),
                reportMessage: 'Literally jail them',
            }
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({success: true, message: "Report saved successfully"});
    });

    // Input: An invalid report (missing fields)
    // Expected status code: 400
    // Expected behaviour: Returns an error message
    // Expected output: { success: false, error: 'Invalid report' }
    test('Malformed report', async () => {
        const response = await request(app).post('/moderation').send({});
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({success: false, error: "Invalid report"});
    });


    // Input: An invalid report with invalid reporterUserId
    // Expected status code: 400
    // Expected behaviour: Returns an error message
    // Expected output: { success: false, error: 'Invalid user ids' }
    test('Invalid reporterUserId', async () => {
        const response = await request(app).post('/moderation').send(
            {
                reporterUserId: 'invalidId',
                reportedUserId: new ObjectId('5f9d88b9d4b4d4c6a0b0f6a7'),
                chatRoomId: new ObjectId('5f9d88b9d4b4d4c6a0b0f7g9'),
                reportMessage: 'Why be mean?',
            }
        );
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({success: false, error: "Invalid user ids"});
    });


    // Input: An invalid report with invalid reportedUserId
    // Expected status code: 400
    // Expected behaviour: Returns an error message
    // Expected output: { success: false, error: 'Invalid user ids' }
    test('Invalid reportedUserId', async () => {
        const response = await request(app).post('/moderation').send(
            {
                reporterUserId: new ObjectId('5f9d88b9d4b4d4c6a0b0f6a6'),
                reportedUserId: 'invalidId',
                chatRoomId: new ObjectId('5f9d88b9d4b4d4c6a0b0f7g9'),
                reportMessage: 'Why be mean?',
            }
        );
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({success: false, error: "Invalid user ids"});
    });


    // Input: A report that will throw error when saving to database (hardcoded to throw an error in our mock)
    // Expected status code: 500
    // Expected behaviour: Returns an error message
    // Expected output: { success: false, error: 'Error while adding a report' }
    test('Get a database error', async () => {
        const response = await request(app).post('/moderation').send(
            {
                reporterUserId: 'errorId',
                reportedUserId: new ObjectId('5f9d88b9d4b4d4c6a0b0f6a7'),
                chatRoomId: new ObjectId('5f9d88b9d4b4d4c6a0b0f7g9'),
                reportMessage: 'Why be mean?',
            }
        );
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({success: false, error: "Error while adding a report"});
    });

});

describe('PUT /moderation/:adminId/ban', () => {

    // Input: A valid adminId, a valid userId, valid reportId
    // Expected status code: 200
    // Expected behaviour: Returns success message
    // Expected output: { success: true }
    test('Valid ids', async () => {
        const response = await request(app).put(`/moderation/${mockedUsers[1]._id}/ban`).send(
            { 
                userId: mockedUsers[2]._id,
                reportId: mockedReports[0]._id
            }
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({success: true, message: "User banned successfully"});
    });

    // Input: An invalid adminId (one not in the database), a valid userId, valid reportId
    // Expected status code: 403
    // Expected behaviour: Returns an error message
    // Expected output: { success: false, error: 'Unauthorized access to admin actions' }
    test('Invalid adminId', async () => {
        const response = await request(app).put(`/moderation/invalidId/ban`).send(
            {
                userId: mockedUsers[2]._id,
                reportId: mockedReports[0]._id
            }
        );
        expect(response.statusCode).toBe(403);
        expect(response.body).toEqual({success: false, error: "Unauthorized access to admin actions"});
    });

    // Input: An adminId that will throw error when searching for admin in the database (hardcoded to throw an error in our mock)
    // Expected status code: 500
    // Expected behaviour: Returns an error message
    // Expected output: { success: false, error: 'Error while banning user' }
    test('Get a database error', async () => {
        const response = await request(app).put(`/moderation/errorId/ban`).send(
            {
                userId: mockedUsers[2]._id,
                reportId: mockedReports[0]._id
            }
        );
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({success: false, error: "Error while banning user"});
    });

    // Input: A valid adminId, an invalid userId (one not in the database), valid reportId
    // Expected status code: 400
    // Expected behaviour: Returns an error message
    // Expected output: { success: false, error: 'Invalid user id' }
    test('Invalid userId', async () => {
        const response = await request(app).put(`/moderation/${mockedUsers[1]._id}/ban`).send(
            {
                userId: 'invalidId',
                reportId: mockedReports[0]._id
            }
        );
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({success: false, error: "Invalid user id"});
    });

    // Input: A valid adminId, a valid userId, an invalid reportId (one not in the database)
    // Expected status code: 400
    // Expected behaviour: Returns an error message
    // Expected output: { success: false, error: 'Report not found' }
    test('Invalid reportId', async () => {
        const response = await request(app).put(`/moderation/${mockedUsers[1]._id}/ban`).send(
            {
                userId: mockedUsers[2]._id,
                reportId: 'invalidId'
            }
        );
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({success: false, error: "Report not found"});
    });

    // Input: A valid adminId, a valid userId, a reportId that will throw error when searching for report in the database (hardcoded to throw an error in our mock)
    // Expected status code: 500
    // Expected behaviour: Returns an error message
    // Expected output: { success: false, error: 'Error while banning user' }
    test('Get a database error from report', async () => {
        const response = await request(app).put(`/moderation/${mockedUsers[1]._id}/ban`).send(
            {
                userId: mockedUsers[2]._id,
                reportId: 'errorId'
            }
        );
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({success: false, error: "Error while banning user"});
    });

    // Input: A valid adminId, a userId that will throw error when searching for user in the database (hardcoded to throw an error in our mock)
    // Expected status code: 500
    // Expected behaviour: Returns an error message
    // Expected output: { success: false, error: 'Error while banning user' }
    test('Get a database error from user', async () => {
        const response = await request(app).put(`/moderation/${mockedUsers[1]._id}/ban`).send(
            {
                userId: 'errorId',
                reportId: mockedReports[0]._id
            }
        );
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({success: false, error: "Error while banning user"});
    });
});

describe('DELETE /moderation/:adminId/:reportId', () => {


    // Input: A valid adminId, a valid reportId
    // Expected status code: 200
    // Expected behaviour: Returns success message
    // Expected output: { success: true, message: 'Report deleted successfully' }
    test('Valid ids', async () => {
        const response = await request(app).delete(`/moderation/${mockedUsers[1]._id}/${mockedReports[0]._id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({success: true, message: 'Report deleted successfully'});
    });


    // Input: An invalid adminId (one not in the database), a valid reportId
    // Expected status code: 403
    // Expected behaviour: Returns an error message
    // Expected output: { success: false, error: 'Unauthorized access to admin actions' }
    test('Invalid adminId', async () => {
        const response = await request(app).delete(`/moderation/invalidId/${mockedReports[0]._id}`);
        expect(response.statusCode).toBe(403);
        expect(response.body).toEqual({success: false, error: 'Unauthorized access to admin actions'});
    });


    // Input: An adminId that will throw error when searching for admin in the database (hardcoded to throw an error in our mock)
    // Expected status code: 500
    // Expected behaviour: Returns an error message
    // Expected output: { success: false, error: 'Error while deleting report' }
    test('Get a database error from admin', async () => {
        const response = await request(app).delete(`/moderation/errorId/${mockedReports[0]._id}`);
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({success: false, error: 'Error while deleting report'});
    });


    // Input: A valid adminId, an invalid reportId (one not in the database)
    // Expected status code: 400
    // Expected behaviour: Returns an error message
    // Expected output: { success: false, error: 'Report not found' }
    test('Invalid reportId', async () => {
        const response = await request(app).delete(`/moderation/${mockedUsers[1]._id}/invalidId`);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({success: false, error: 'Report not found'});
    });


    // Input: A valid adminId, a reportId that will throw error when searching for report in the database (hardcoded to throw an error in our mock)
    // Expected status code: 500
    // Expected behaviour: Returns an error message
    // Expected output: { success: false, error: 'Error while deleting report' }
    test('Get a database error from report', async () => {
        const response = await request(app).delete(`/moderation/${mockedUsers[1]._id}/errorId`);
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({success: false, error: 'Error while deleting report'});
    });
});