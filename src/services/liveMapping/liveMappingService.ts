import LiveMappingDao from "../../lib/dao/liveMapping.dao";
import LiveMappingModel from "../../models/LiveMapping.model";
import { ClockService } from "../clock/clockService";
import { QuestionDao } from '../../lib/dao/question.dao';
import { throwError, Utility } from "../../util";
import SettingsDao from "../../lib/dao/settings.dao";
import CandidateTimingDao from "../../lib/dao/candidateTimings.dao";
import { SettingsEnum } from "../../lib/enums/settings.enum";
import { CryptoHelper } from "../../helper/cryptoHelper";

export class LiveMappingService{
    static async createLiveMapping(user: any, public_key: string){
        const timeAlloted = await ClockService.getTimeAllotedForExam();

        const existLiveMapping = await LiveMappingDao.getLiveMappingByStudentExamShift(user.studentid, user.examId, user.shiftId)
        if(existLiveMapping){
           
            existLiveMapping.lastLoginTime = new Date()
            existLiveMapping.loginAttempts = existLiveMapping.loginAttempts + 1;
            existLiveMapping.publicKey = public_key;

            return await existLiveMapping.save()
        }
        else{
            // @TODO: add section in questionPaper @kunalvohra @mukulsindhu
            const sections = await SettingsDao.get(SettingsEnum.SECTIONS);
            let allQuestions = []
            for(let section of sections?.value){

                const exam_questions = await QuestionDao.getAllExamShiftSectionQuestions(user.examId, user.shiftId, section.sectionId)
                if(!exam_questions){
                    return throwError("No questions found for this exam", 404)
                }
                let questionsOfExam = exam_questions.map((question: any) => {
                    return question._id
                })    
                
                // shuffling questions
                const shuffling = await SettingsDao.get("shuffling");
                if(shuffling?.value === true){
                    questionsOfExam = Utility.shuffleArr(questionsOfExam);
                }
                allQuestions.push({questions: questionsOfExam, sectionId: section.sectionId, sectionName: section.sectionName})
            }
            const liveMapping = new LiveMappingModel({
                student: user.studentid,
                student_id: user._id,
                examId: user.examId,
                shiftId: user.shiftId,
                timeAlloted: Number(timeAlloted) + Number(user.extraTime),
                questionPaper: allQuestions,
                timeRemaining: Number(timeAlloted) + Number(user.extraTime),
                lastLoginTime: new Date(),
                loginAttempts: 1,
                key: await CryptoHelper.createRandomKey(),
                publicKey: public_key
            })

            const lastQuestionId = liveMapping.questionPaper[0].questions[0]
            const payload = {lastQuestionId}
            await CandidateTimingDao.updateUserTimings(user.studentid, user.examId, user.shiftId, user._id, payload)
            
            return await liveMapping.save();

        }
    }

    static async getLiveMappingOfUser(userId: any){
        return await LiveMappingDao.getLiveMappingOfUser(userId)
    }

    static async getMappingById(_id: any){
        return await LiveMappingDao.getMappingById(_id)
    }
}