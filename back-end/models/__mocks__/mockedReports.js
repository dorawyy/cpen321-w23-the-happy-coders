const { ObjectId } = require('mongodb');
const { mockedUsers } = require('./user');

const mockReport0 = {
    _id: new ObjectId('5f9d88b9d4b4d4c6a0c7d8e1'),
    reporterUserId: mockedUsers[4]._id,
    reportedUserId: mockedUsers[2]._id,
    chatRoomId: new ObjectId('5f9d88b9d4b4d4c6a0b0f7d1'),
    reportMessage: 'They were mean to me!',
};

const mockReport1 = {
    _id: new ObjectId('5f9d88b9d4b4d4c6a0c7d8e2'),
    reporterUserId: mockedUsers[3]._id,
    reportedUserId: mockedUsers[5]._id,
    chatRoomId: new ObjectId('5f9d88b9d4b4d4c6a0b0f7d4'),
    reportMessage: 'So rude!',
};

const mockReport2 = {
    _id: new ObjectId('5f9d88b9d4b4d4c6a0c7d8e4'),
    reporterUserId: mockedUsers[6]._id,
    reportedUserId: mockedUsers[5]._id,
    chatRoomId: new ObjectId('5f9d88b9d4b4d4c6a0b0f7d6'),
    reportMessage: 'They cursed my lineage in Sanskrit!',
};


const mockedReports = [mockReport0, mockReport1, mockReport2];

module.exports = { mockedReports };

