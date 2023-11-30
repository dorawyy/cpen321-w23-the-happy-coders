const { google } = require('googleapis');
const moment = require('moment');
const { getGoogleClient } = require('./authenticationService');
const { findUserByID } = require('./userService');
const { Event } = require('../models/event');
const { User } = require('../models/user');
const { Chatroom } = require('../models/chatroom');
const badgeService = require('./badgeService');

// ChatGPT Usage: No
// Create new Google Calendar event
async function createEvent(authCode, rawEvent) {
    const clientResponse = await getGoogleClient(authCode);

    if(!clientResponse.success) {
        return clientResponse;
    }

    const auth = clientResponse.auth;
    const eventResponse = await generateLangSyncEventObject(rawEvent);

    if(!eventResponse.success) {
        return { success: false, error: eventResponse.error };
    }

    const event = eventResponse.event;

    try {
        const calendar = google.calendar({ version: 'v3', auth });
        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
            sendNotifications: true,
        });

        const chatroom = await Chatroom.findOne({ 
            $or: [{ user1Id: rawEvent.hostUserId, user2Id: rawEvent.invitedUserId },
            { user1Id: rawEvent.invitedUserId, user2Id: rawEvent.hostUserId }]
        });

        if(!chatroom) {
            return { success: false, error: 'Error connecting users' };
        }

        const newEvent = new Event({
            googleEventId: response.data.id,
            hostUserId: rawEvent.hostUserId,
            invitedUserId: rawEvent.invitedUserId,
            startTime: event.start.dateTime,
            endTime: event.end.dateTime,
            chatroomId: chatroom._id.toString(),
        })

        newEvent.save();

        const user = await User.findById(rawEvent.hostUserId);

        user.lessonCount += 1;
        await badgeService.assignMatchBadge(user, 'Lesson');

        return { success: true, message: `Event created: ${response.data.htmlLink}` };
    } catch (error) {
        console.error('Error creating event:', error);
        return { success: false, error: 'Error creating event' };
    }
    
}

// ChatGPT Usage: No
async function getEvents(hostUserId, invitedUserId) {
    try {
        var events;
        if (invitedUserId) {
            events = await Event.find({ $or: [{ hostUserId,  invitedUserId }, { hostUserId: invitedUserId, invitedUserId: hostUserId }] });
        } else{
            events = await Event.find({ $or: [{  hostUserId }, { invitedUserId: hostUserId }] });
        }
        const eventsModified = []; 
        for (var i = 0; i < events.length; i++) {
            var event = events[i].toObject();
            const otherUser = (event.hostUserId == hostUserId) ? 
                await User.findById(event.invitedUserId) : 
                await User.findById(event.hostUserId);
            event.otherUserName = otherUser.displayName
            eventsModified.push(event);
        }

        return { success: true, events: eventsModified };    
    } catch (error) {
        return { success: false, error: error.message };
    }
    
}

// ChatGPT Usage: No
async function deleteEvent(authCode, eventId) {
    const clientResponse = await getGoogleClient(authCode);

    if(!clientResponse.success) {
        return clientResponse;
    }

    const auth = clientResponse.auth;
    const event = await Event.findById(eventId);
    const googleId = event.googleEventId;

    await Event.findByIdAndDelete(eventId);

    try {
        const calendar = google.calendar({ version: 'v3', auth });
        await calendar.events.delete({
            calendarId: 'primary',
            eventId: googleId,
        });
    } catch (error) {
        return { success: true, message: `Event deleted: error deleting on google` };
    }

    return { success: true, message: `Event deleted` };
}

//ChatGPT Usage: No
// Create properly formatted Google Calendar event object
async function generateLangSyncEventObject(rawEvent) {
    const hostUser = await findUserByID(rawEvent.hostUserId);
    const invitedUser = await findUserByID(rawEvent.invitedUserId);

    if(!hostUser || !invitedUser) {
        return { success: false, error: 'Error finding host or invited user' };
    }

    const timeZone = rawEvent.timeZone;
    const startTime = new Date(new Date(rawEvent.startTime));
    const durationMinutes = rawEvent.durationMinutes;
    const endTime = await moment(startTime).add(durationMinutes, 'm').toDate();

    const event = {
        summary: 'LangSync Learning Session',
        location: 'LangSync App',
        description: 'A LangSync Learning Session between ' + hostUser.displayName + ' and ' + invitedUser.displayName,
        attendees: [
            { email: invitedUser.email },
        ],
        end: {
            dateTime: endTime.toISOString(),
            timeZone,
        },
        start: {
            dateTime: startTime.toISOString(),
            timeZone,
        },    
        reminders: {
            useDefault: true,
        }
    }

    return { success: true, event };
}

module.exports = { createEvent, getEvents, deleteEvent };