const { ObjectId } = require("mongodb");
const {mockEvents} = require("./mockEvents");

class Event {
    // ChatGPT Usage: Partial
    constructor(obj) {
        this._id = obj._id ?? new ObjectId();
        this.invitedUserId = obj.invitedUserId.toString();
        this.hostUserId = obj.hostUserId.toString();
        this.googleEventId = obj.googleEventId;
        this.startTime = obj.startTime;
        this.endTime = obj.endTime;

    }

    toObject() {
        const transformed = {
            _id : this._id.toString(),
            invitedUserId : this.invitedUserId,
            hostUserId : this.hostUserId,
            googleEventId : this.googleEventId,
            startTime : this.startTime,
            endTime : this.endTime,
        }
        return transformed ;
    }
    // ChatGPT Usage: Partial
    save() {
        const index = mockedEvents.findIndex(u => u._id.equals(this._id));
        if (index !== -1) {
            mockedEvents[index] = {
            ...mockedEvents[index],
            ...this,
            };
        } else {
            mockedEvents.push(this);
        }
        return { success: true, message: "Event saved successfully" };
    }
}

// ChatGPT Usage: Partial
Event.find = jest.fn((query) => {
    if (!query) return mockedEvents;
    const { $or } = query;
    let filteredEvents;
    if(Object.keys($or[0]).length === 1){
        const userId = $or[0].hostUserId;
        console.log(userId);
        console.log(mockedEvents);
        filteredEvents = mockedEvents.filter((event) => {
            return event.hostUserId === userId || event.invitedUserId === userId;
        }) 
    }else{
        const userId1 = $or[0].hostUserId;
        const userId2 = $or[1].hostUserId;
        filteredEvents = mockedEvents.filter((event) => {
            return (event.hostUserId === userId1 && event.invitedUserId === userId2) || (event.hostUserId === userId2 && event.invitedUserId === userId1);
        })

        if(userId1 === "throwEventErrorId" || userId2 === "throwEventErrorId"){
            throw new Error("Error while fetching events");
        }
    }

    return  filteredEvents;
});



const mockedEvents = mockEvents.map((event) => new Event(event));

  
module.exports = { Event, mockedEvents };
  