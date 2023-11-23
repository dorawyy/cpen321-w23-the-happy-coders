const  {mockedReports}  = require("./mockedReports");
class Report {
    constructor(obj) {
        this._id = obj._id;
        this.reporterUserId = obj.reporterUserId;
        this.reportedUserId = obj.reportedUserId;
        this.chatRoomId = obj.chatRoomId;
        this.reportMessage = obj.reportMessage;
        
        this.save = jest.fn().mockImplementation(() => {
            const index = mockedReports.findIndex(r => r._id === obj._id);
            if (index !== -1) {
                mockedReports[index] = {
                ...mockedReports[index],
                ...obj,
                };
            } else {
                mockedReports.push({
                        _id: obj._id,
                        reporterUserId: obj.reporterUserId,
                        reportedUserId: obj.reportedUserId,
                        chatRoomId: obj.chatRoomId,
                        reportMessage: obj.reportMessage
                    });
            }
            return { success: true, message: "Report saved successfully" };
        });
    }
}

Report.find = jest.fn((query) => {
    if (!query) return  mockedReports;
    const { $and, reporterUserId, reportedUserId, chatRoomId } = query;
    const reportId = $and.find((cond) => cond._id && cond._id.$ne)._id.$ne;

    let filteredReports = mockedReports.filter((report) => {
        return (
            report._id === reportId &&
            report.reporterUserId === reporterUserId &&
            report.reportedUserId === reportedUserId &&
            report.chatRoomId === chatRoomId
        );
    });
    return filteredReports;
});

Report.findById = jest.fn().mockImplementation((id) =>{
    if(id === "errorId"){
        throw new Error('Report not found');
    }
    if(id === "invalidId"){
        return null;
    }
    const report = mockedReports.find((r) => r._id.toString() === id);
    return report;
});

Report.findByIdAndDelete = jest.fn().mockImplementation((id) =>{
    if(id === "errorId"){
        throw new Error('Report not found');
    }
    if(id === "invalidId"){
        return null;
    }
    const report = mockedReports.find((r) => r._id.toString() === id);
    const index = mockedReports.indexOf(report);
    mockedReports.splice(index, 1);
    return report;
});

Report.findOne = jest.fn().mockImplementation((query) =>{
    const report = mockedReports.find((r) => r._id.toString() === query._id);
    return report;
});


module.exports = { Report };