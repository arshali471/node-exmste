import candidateDeviceModel from "../../models/candidateDevice.model";

export default class CandidateDeviceDao {
    static async create(payload:any){
        return await candidateDeviceModel.create(payload);
    }

    static async markDeviceUserDevicesAsBlocked(studentId:any){
        return await candidateDeviceModel.updateMany({studentId: studentId}, {$set: {allowed: false}});
    }

    static async updateDevice(mac:string, studentId:string, paylaod:any){

        return await candidateDeviceModel.findOneAndUpdate({mac: mac, allowed: true, studentId: studentId}, {$set: {
            deviceId: paylaod.deviceId,
            "allotedSeat.computer_ip": paylaod.computer_ip
            }
        }, {new: true});
    }
    
    static async getAllDevices(skip: number, count: number){
        let result = await candidateDeviceModel.aggregate([
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $skip: skip },
                        { $limit: Number(count) },
                    ],
                },
            },
        ]);
        return result[0];
    }

    static async getStudentActiveDevice(studentId: any, deviceId: any){
        return await candidateDeviceModel.findOne({studentId: studentId, deviceId: deviceId, allowed: true})
    }

    static async getAll(){
        return await candidateDeviceModel.find()
    }

    static async getCandidateDevice(mongo_id: any){
        return await candidateDeviceModel.findOne({_id: mongo_id})
    }

    static async saveRecoveredCandidateDevice(candidateDevice: any){
        return await candidateDeviceModel.create({
            _id: candidateDevice._id,
            deviceId: candidateDevice.deviceId,
            cid: candidateDevice.cid,
            mac: candidateDevice.mac,
            alloted_by: candidateDevice.alloted_by,
            studentId: candidateDevice.studentId,
            allowed: candidateDevice.allowed,
            allotedSeat: candidateDevice.allotedSeat,
            createdAt: candidateDevice.createdAt,
            updatedAt: candidateDevice.updatedAt
        })
    }
}