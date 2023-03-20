import { ResponseDao } from "../../lib/dao/response.dao";

export class ResponseService{
    static async saveResponse(questionId: any, examId: any, shiftId: any, markedForReview: boolean, mappingId: any, encryptedResponse: any, studentId: any, student_id: any){
        return await ResponseDao.saveResponse(questionId, examId, shiftId, markedForReview, mappingId, encryptedResponse, studentId, student_id)
    }

    static async getResponseByQuestionId(questionId: any){
        return await ResponseDao.getResponseByQuestionId(questionId)
    }

    static async clearResponse(questionId: any){
        return await ResponseDao.clearResponse(questionId)
    }
    
    static async getAllUserResponses(mappingId: any){
        return await ResponseDao.getAllUserResponses(mappingId)
    }
}