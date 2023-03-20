import { ExtraTimeModal } from "../../models/extraTime.modal";

export default class ExtraTime {
    static async getNotAllotedTimeForMapping(mappingId: any){
        return await ExtraTimeModal.find({givenTo: mappingId, alloted: false})
    }


    static async getAll(){
        return await ExtraTimeModal.find()
    }


    static async getAllById(mappingId: any) {
        return await ExtraTimeModal.find({givenTo: mappingId});
    }
    
    static async alotExtraTime(mappingId: any, time: number, givenBy: string){
        const newTime = new ExtraTimeModal({
            givenBy: givenBy,
            time: time,
            givenTo: mappingId
        });

        return await newTime.save();
    }

    static async getExtraTiming(mongo_id: any){
        return await ExtraTimeModal.findOne({_id: mongo_id})
    }

    static async saveRecoveredExtraTiming(extraTiming: any) {
        return await ExtraTimeModal.create({
            _id: extraTiming._id,
            givenTo: extraTiming.givenTo,
            givenBy: extraTiming.givenBy,
            alloted: extraTiming.alloted,
            time: extraTiming.time,
            createdAt: extraTiming.createdAt,
            updatedAt: extraTiming.updatedAt
        })
    }

}