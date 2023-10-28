const { google } = require('googleapis');
const { getGoogleClient } = require('./authenticationService');


async function createEvent(authCode, event) {
    console.log("Creating event");
    const clientResponse = await getGoogleClient(authCode);

    if(!clientResponse.success) {
        return clientResponse;
    }

    const auth = clientResponse.auth;

    try {
        const calendar = google.calendar({ version: 'v3', auth });
        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: eventTest,
        });
        console.log(`Event created: ${response.data.htmlLink}`);
        return { success: true, message: `Event created: ${response.data.htmlLink}` };
    } catch (error) {
        console.error('Error creating event:', error);
        return { success: false, error: 'Error creating event' };
    }
}

const eventTest = {
    summary: 'Test Event',
    location: 'Vancouver, BC',
    description: 'This is a test event',
    start: {
        dateTime: '2023-10-29T09:00:00-07:00',
        timeZone: 'America/Vancouver',
    },
    end: {
        dateTime: '2023-10-29T10:00:00-07:00',
        timeZone: 'America/Vancouver',
    },
    reminders: {
        useDefault: true,
    },
};

module.exports = { createEvent };