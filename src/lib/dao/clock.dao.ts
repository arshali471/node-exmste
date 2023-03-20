import { ClocksModel } from "../../models/Clocks.model";
import { ClockEnum } from "../enums/clock.enum";

export class ClockDao{
    static async getClocks(){
        return await ClocksModel.find({})
    }
    
    static async getExamStartTime(){
        return await ClocksModel.findOne({label: "examstarttime"})
    }
    
    static async getExamEndTime(){
        return await ClocksModel.findOne({label: "examendtime"})
    }
    static async get(clock: ClockEnum){
        return await ClocksModel.findOne({label: clock});
    }

}