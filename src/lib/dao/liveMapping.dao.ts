import LiveMappingModel from "../../models/LiveMapping.model";

export default class LiveMappingDao{
    static async getLiveMappingByStudentId(studentid: string){
        return await LiveMappingModel.findOne({student: studentid});
    }
    
    static async getLiveMappingByStudentExamShift(studentid: string, examId: string, shiftid: string){
        return await LiveMappingModel.findOne({student: studentid, examId: examId, shiftId: shiftid});
    }

    static async getCandidateMapping(studentid: string, student_id: any, examId: string, shiftid: string){
        return await LiveMappingModel.findOne({student: studentid, student_id: student_id, examId: examId, shiftId: shiftid});
    }

    static async updateTimeRemainingForLiveUser(studentid: any, examId: any, shiftId: any, userTime: any){
        return await LiveMappingModel.findOneAndUpdate({student: studentid, examId: examId, shiftId: shiftId}, {
            $set: {
                timeRemaining: userTime
            }
        }, {new: true})
    }

    static async disconnectSocket(socketId: any){
        return await LiveMappingModel.findOneAndUpdate({socketId: socketId}, {
            isOnline: false
        }, {
            new: true
        })
    }

    static async connectSocket(socketId: any){
        return await LiveMappingModel.findOneAndUpdate({socketId: socketId}, {
            isOnline: true
        }, {
            new: true
        })
    }

    static async getAll(){
        return await LiveMappingModel.find()
    }

    static async getLiveMappingOfUser(userId: any){
        return await LiveMappingModel.findOne({student_id: userId})
    }

    static async getMappingById(_id: any){
        return await LiveMappingModel.findOne({_id});
    }

    static async getLiveMapping(mongo_id: any){
        return await LiveMappingModel.findOne({_id: mongo_id})
    }
    
    static async saveRecoveredLiveMapping(liveMapping: any){
        return await LiveMappingModel.create({
            _id: liveMapping._id,
            student: liveMapping.student,
            student_id: liveMapping.student_id,
            examId: liveMapping.examId,
            shiftId:liveMapping.shiftId,
            timeAlloted:liveMapping.timeAlloted,
            questionPaper:liveMapping.questionPaper,
            timeRemaining:liveMapping.timeRemaining,
            lastLoginTime:liveMapping.lastLoginTime,
            loginAttempts:liveMapping.loginAttempts,
            isOnline:liveMapping.isOnline,
            socketId:liveMapping.socketId,
            blocked:liveMapping.blocked,
            key:liveMapping.key,
            publicKey:liveMapping.publicKey,
            createdAt:liveMapping.createdAt,
            updatedAt:liveMapping.updatedAt
        })
    }
}