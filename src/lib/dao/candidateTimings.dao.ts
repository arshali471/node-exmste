import candidateTimingsModel from "../../models/candidateTimings.model";

export default class CandidateTimingDao {
    static async updateUserTimings(studentId: any, examId: any, shiftId: any, student_id: any, payload : {
        loggedInAt?: Date,
        lastSyncOn?: Date,
        lastQuestionId?: any,
        instructionReadAt?: Date,
        examStartedAt?: Date,
        mappingId?: any
    }) {
        await candidateTimingsModel.findOneAndUpdate({
            student_id: student_id,
            studentId: studentId,
            examId: examId,
            shiftId: shiftId 
        }, {$set: payload}, {upsert: true})
    }

    static async getCandidateTimings(studentId: any, student_id: any, examId: any, shiftId: any){
        return await candidateTimingsModel.findOne({studentId: studentId, student_id: student_id,examId: examId, shiftId: shiftId})
    }

    static async getAll(){
        return await candidateTimingsModel.find()
    }

    static async getCandidateTiming(mongo_id: any){
        return await candidateTimingsModel.findOne({_id: mongo_id})
    }
    
    static async saveRecoveredCandidateTiming(candidateTiming: any) {
        return await candidateTimingsModel.create( {
            _id: candidateTiming._id,
            studentId: candidateTiming.studentId,
            student_id: candidateTiming.student_id,
            loggedInAt : candidateTiming.loggedInAt,
            lastSyncOn : candidateTiming.lastSyncOn,
            lastQuestionId: candidateTiming.lastQuestionId,
            instructionReadAt: candidateTiming.instructionReadAt,
            examStartedAt: candidateTiming.examStartedAt,
            examId: candidateTiming.examId,
            shiftId: candidateTiming.shiftId,
            mappingId: candidateTiming.mappingId,
            createdAt: candidateTiming.createdAt,
            updatedAt: candidateTiming.updatedAt
        })
    }
}