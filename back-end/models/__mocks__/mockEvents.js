const { ObjectId } = require('mongodb');
const {mockUsers} = require("./mockedUsers");

// 3 events for mockUser 5
// 2 events for mockUser 6
// 1 event for mockUser 7

const mockEvent0 = {
    _id: new ObjectId('5f9d88b9d4b4d4c6a0b0f6e0'),
    invitedUserId: mockUsers[6]._id,
    hostUserId: mockUsers[5]._id,
    googleEventId: "1",
    startTime: "2020-10-20T16:00:00.000Z",
    endTime: "2020-10-20T16:30:00.000Z",
}

const mockEvent1 = {
    _id: new ObjectId('5f9d88b9d4b4d4c6a0b0f6e1'),
    invitedUserId: mockUsers[6]._id,
    hostUserId: mockUsers[5]._id,
    googleEventId: "2",
    startTime: "2020-11-20T16:00:00.000Z",
    endTime: "2020-11-20T16:30:00.000Z",
}

const mockEvent2 = {
    _id: new ObjectId('5f9d88b9d4b4d4c6a0b0f6e2'),
    invitedUserId: mockUsers[7]._id,
    hostUserId: mockUsers[5]._id,
    googleEventId: "3",
    startTime: "2020-12-20T16:00:00.000Z",
    endTime: "2020-12-20T16:30:00.000Z",
}

const mockEvents = [mockEvent0, mockEvent1, mockEvent2];

module.exports = {mockEvents};