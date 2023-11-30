const { ObjectId } = require('mongodb');

class Badge {
    constructor(obj) {
        this._id = obj._id;
        this.icon = obj.icon;
        this.count = obj.count;
        this.type = obj.type;
    }
}

    const mockBadge0 = new Badge({
        _id: new ObjectId('5f6d88b9d4b4d4c6a0b0f6b1'),
        icon: "bronze_match_badge",
        count: 1,
        type: "Match"
    });

    const mockBadge1 = new Badge({
        _id: new ObjectId('5f6d88b9d4b4d4c6a0b0f6b2'),
        icon: "silver_match_badge",
        count: 5,
        type: "Match"
    });
    
    const mockBadge2 = new Badge({
        _id: new ObjectId('5f6d88b9d4b4d4c6a0b0f6b3'),
        icon: "gold_match_badge",
        count: 10,
        type: "Match"
    });

    const mockBadge3 = new Badge({
        _id: new ObjectId('5f6d88b9d4b4d4c6a0b0f6b4'),
        icon: "gold_session_badge",
        count: 10,
        type: "Lesson"
    });

    const mockBadge4 = new Badge({
        _id: new ObjectId('5f6d88b9d4b4d4c6a0b0f6b5'),
        icon: "gold_session_badge",
        count: 10,
        type: "Lesson"
    });

    const mockBadge5 = new Badge({
        _id: new ObjectId('5f6d88b9d4b4d4c6a0b0f6b6'),
        icon: "gold_session_badge",
        count: 10,
        type: "Lesson"
    });

    const mockedBadges = [mockBadge0, mockBadge1, mockBadge2, mockBadge3, mockBadge4, mockBadge5];  

    Badge.findById = jest.fn().mockImplementation((id) => {
        let badge = mockedBadges.find((badge) => badge._id == id);

        return badge;
    })

    Badge.findOne = jest.fn().mockImplementation((query) =>{
        if (!query) return mockedBadges[0];
        const {count, type} = query;
        if(count == -1){
            throw new Error('Error finding badge');
        }
        
        let badge = mockedBadges.find((badge) => badge.count == count && badge.type == type);

        return badge;
    });

    module.exports = { Badge, mockedBadges };