import { ResponseModel } from "../../models/Response.model";

export class ResponseDao{
    static async saveResponse(questionId: any, examId: any, shiftId: any, markedForReview: boolean, mappingId: any, encryptedResponse: any, studentId: any, student_id: any){
        return await ResponseModel.findOneAndUpdate({questionId: questionId, examId: examId, shiftId: shiftId, mappingId: mappingId}, {
            $set: {
                examId: examId,
                shiftId: shiftId,
                questionId: questionId,
                mappingId: mappingId,
                markedForReview: markedForReview,
                selectedOption: encryptedResponse,
                student_id: student_id,
                studentId: studentId
            }
        }, {upsert: true})
    }

    static async getResponses(){
        return await ResponseModel.find()
    }

    static async getResponseByQuestionId(questionId: any){
        return await ResponseModel.findOne({questionId: questionId})
    }

    static async getResponsesAfterExmwallLastUpdated(exmwallLastUpdatedAt: Date){
        return await ResponseModel.find({updatedAt: {$gte : exmwallLastUpdatedAt}})
    }

    static async clearResponse(questionId: any){
        return await ResponseModel.findOneAndUpdate({questionId: questionId}, {
            $unset: {
                selectedOption: 1
            }
        }, {new: true})
    }
    
    static async getAllUserResponses(mappingId: any){
        return await ResponseModel.find({mappingId: mappingId})
    }

    static async getResponse(mongo_id: any){
        return await ResponseModel.findOne({_id: mongo_id})
    }

    static async saveRecoveredResponse(responseData: any){
        return await ResponseModel.create({
            _id: responseData._id,
            examId: responseData.examId,
            shiftId: responseData.shiftId,
            questionId: responseData.questionId,
            mappingId: responseData.mappingId,
            markedForReview: responseData.markedForReview,
            selectedOption: responseData.selectedOption,
            student_id: responseData.student_id,
            studentId: responseData.studentId,
            createdAt: responseData.createdAt,
            updatedAt: responseData.lastUpdatedAt
        })
    }
}