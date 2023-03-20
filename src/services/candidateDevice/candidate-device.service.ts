import CandidateDeviceDao from "../../lib/dao/candidate-device.dao";
import { ICreateDevicePayload } from "../../lib/interfaces/device.interface";

export default class CandidateDeviceService {
    static async create(payload: ICreateDevicePayload){
        await CandidateDeviceDao.markDeviceUserDevicesAsBlocked(payload.studentId);
        return await CandidateDeviceDao.create({
            cid: payload.computer_id,
            mac: payload.computer_mac,
            alloted_by: payload.alloted_by,
            studentId: payload.studentId,
            allowed: true,
            allotedSeat: {
                labId: payload.labId,
                computer_id: payload.computer_id,
                computer_mac: payload.computer_mac,
                centerId: payload.centerId,
            }
        });
    }

    static async updateDeviceId(mac: string, studentId: string, paylaod: {
        computer_ip: string
        deviceId: string
    }){
        return await CandidateDeviceDao.updateDevice(mac, studentId, paylaod);
    }

    static async getAllDevices(skip: number, count: number){
        return await CandidateDeviceDao.getAllDevices(skip, count);
    }
}