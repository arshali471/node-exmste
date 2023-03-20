import moment from "moment";
import { ClockDao } from "../../lib/dao/clock.dao";

export class ClockService{
    static async getTimeAllotedForExam(){
        const examStartTime: any = await ClockDao.getExamStartTime()
        const examEndTime: any = await ClockDao.getExamEndTime()

        let momentExamStartTime = moment(examStartTime.value)
        let momentExamEndTime = moment(examEndTime.value)

        const timeAllotedTime = momentExamEndTime.diff(momentExamStartTime, 'seconds')
        return await timeAllotedTime

    }

    static async getTimeRemaining(){
        const examEndTime: any = await ClockDao.getExamEndTime()
        let momentExamEndTime = moment(examEndTime.value)
        const timeRemaining = momentExamEndTime.diff(moment(), 'seconds')
        return timeRemaining

    }

    static async getTimeRemainingBeforeExamStart(){
        const examStartTime: any = await ClockDao.getExamStartTime()
        const momentExamStartTime = moment(examStartTime.value)
        const timeRemainingBeforeExamStart = momentExamStartTime.diff(moment(), 'seconds')
        return timeRemainingBeforeExamStart

    }

    static async getAll(){
        return await ClockDao.getClocks()
    }
}