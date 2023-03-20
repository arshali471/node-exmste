import { Request, Response, NextFunction } from "express";
import { CONFIG } from "../../config/environment";
import { ExmwallService } from "../../services/exmwall/exmwallService";
import fs from "fs"
import { connectSocket } from "../../helper/socket.helper";
import { StudentRegisteration } from "../../models/StudentRegisterations";
import { Utility } from "../../util";
import { CustomResponse } from '../../util/Response';
import { ClocksModel } from "../../models/Clocks.model";
import SettingsDao from "../../lib/dao/settings.dao";
import { SettingsEnum } from "../../lib/enums/settings.enum";
import { WallSyncService } from "../../services/wallSync/wallSyncService";
import { ResponseDao } from "../../lib/dao/response.dao";
import LiveMappingDao from "../../lib/dao/liveMapping.dao";
import CandidateDeviceDao from "../../lib/dao/candidate-device.dao";
import CandidateTimingDao from "../../lib/dao/candidateTimings.dao";
import { LabDeviceDao } from "../../lib/dao/labDevice.dao";
import ExtraTime from "../../lib/dao/extratime.dao";
import { LogsDao } from "../../lib/dao/log.dao";
import { SuspectDao } from "../../lib/dao/suspect.dao";

export default class ExmwallController {


    static async exmwallLogin(req: Request, res: Response, next: NextFunction) {
        try{
            // let ipAddress = req.body.ipAddress;
            let apiKey = req.body.apikey;
            let wall_url = req.body.url;
            let protocol = req.body.protocol || "https";
            
            let api_version = CONFIG.configApiVersion
            // if(!apikey || ipAddress){
            //     return res.status(404).send("Apikey or ipAddress is not valid.")
            fs.writeFileSync(CONFIG.configUrl, protocol +"://"+ wall_url + api_version)
            fs.writeFileSync(CONFIG.socketUrl, protocol +"://"+ wall_url)
            // } 
            const inputPayload = { apiKey}
            const response = await ExmwallService.makeBasicRequest(CONFIG.exmwall.login, "POST", inputPayload);
            if(response && response.status == 200){
                fs.writeFileSync(CONFIG.configApi, apiKey)
                const token = Utility.generateApiJwt(apiKey);
                let shiftClocks = response.data.clocks;
                for(let clock of shiftClocks){
                    await ClocksModel.findOneAndUpdate({label: clock.label}, {$set: {
                        label: clock.label,
                        value: clock.value
                    } 
                    }, {upsert: true})
                }
                connectSocket()
                res.send(new CustomResponse({token}, "Login successfully."))
            }
            else {
                return res.status(400).send("Credentials Not Valid")
            }
        }
        catch(error){
            next(error)
        }
    }

    static async getCandidates(req: Request, res: Response, next: NextFunction) {
        try{
            const candidates = await ExmwallService.makeRequest(CONFIG.exmwall.getCandidates, "GET").then(response => {
                if(response.status == 200){
                    res.send(response.data)
                }
            })  
        }
        catch(error){
            next(error)
        }
    }

    // static async seatAllotment(req: Request, res: Response, next: NextFunction) {
    //     try{
    //        let candidateId = req.params.candidateId;
    //        let candidatePhoto = req.body.photo;
    //        let fingerPrint = req.body.fingerPrint
    //        let iris = req.body.iris;
    //        let registeredUser: any = {candidatePhoto, fingerPrint, iris}
    //        if (candidatePhoto){
    //         const user = await ExmwallService.seatAllotment(registeredUser, candidateId);
    //         if(!user){
    //             return res.status(404).send("User is not registered yet.")
    //         }
            
    //         if(user.status == 200){
    //             const candidate = user.data;
    //             let updatedCandidate = new StudentRegisteration({
    //                 studentid: candidate.studentId,
    //                 roll_no: candidate.rollNo,
    //                 fathername: candidate.fatherName,
    //                 dob: candidate.dob,
    //                 photo: candidate.photo,
    //                 email: candidate.email,
    //                 phone_number: candidate.phone,
    //                 regno: candidate.regNo,
    //                 sex: candidate.sex,
    //                 category: candidate.category,
    //                 application_number: candidate.applicationNumber,
    //                 mode_of_exam: candidate.modeOfExam,
    //                 phd: candidate.phd,
    //                 createdAt: Date(),
    //                 updatedAt: Date(),
    //                 bioRegistration: {iris: iris, photo: candidatePhoto, fingerPrint: fingerPrint},
    //                 allotedSeat: {labId: candidate.labId}
    //             })
    //             await updatedCandidate.save();
    //             let availableComputer = await ExamCenterDao.getAvailableComputerByLabId(candidate.labId);
    //             // await ExamCenterDao.allotComputer(availableComputer?._id, student?._id);
    //             res.send(updatedCandidate)
    //         }
    //     }
    //     }
    //     catch(error){
    //         next(error)
    //     }
    // }

    static async getExamDetails(req: Request, res: Response, next: NextFunction){
        try{
            const examDetails = await WallSyncService.downloadExamDetails();
            if(!examDetails){
                return res.status(400).send("Unable to get exam details.")
            }
            res.send(examDetails)
        }
        catch(error){
            next(error)
        }
    }

    static async recoverData(req: Request, res: Response, next: NextFunction){
        try{
            console.log("started recovering data")
            const recoveredData = await ExmwallService.makeRequest(CONFIG.exmwall.recoverData, "GET")
            if(!recoveredData){
                return res.status(404).send("Unable to recover data from server.")
            }
            
            for(let response of recoveredData.responses){
                const existingResponse = await ResponseDao.getResponse(response._id);
                if(!existingResponse){
                    await ResponseDao.saveRecoveredResponse(response)
                }
            }
            for(let liveMapping of recoveredData.liveMappings){
                const existingLiveMapping = await LiveMappingDao.getLiveMapping(liveMapping._id);
                if(!existingLiveMapping){
                    await LiveMappingDao.saveRecoveredLiveMapping(liveMapping)
                }
            }
            for(let candidateDevice of recoveredData.candidateDevices){
                const existingCandidateDevice = await CandidateDeviceDao.getCandidateDevice(candidateDevice._id);
                if(!existingCandidateDevice){
                    await CandidateDeviceDao.saveRecoveredCandidateDevice(candidateDevice)
                }
            }
            for(let candidateTiming of recoveredData.candidateTimings){
                const existingCandidateTiming = await CandidateTimingDao.getCandidateTiming(candidateTiming._id);
                if(!existingCandidateTiming){
                    await CandidateTimingDao.saveRecoveredCandidateTiming(candidateTiming)
                }
            }
            for(let labDevice of recoveredData.labDevices){
                const existingLabDevice = await LabDeviceDao.getLabDevice(labDevice._id);
                if(!existingLabDevice){
                    await LabDeviceDao.saveRecoveredLabDevice(labDevice)
                }
            }
            for(let extraTiming of recoveredData.extraTimings){
                const existingExtraTiming = await ExtraTime.getExtraTiming(extraTiming._id);
                if(!existingExtraTiming){
                    await ExtraTime.saveRecoveredExtraTiming(extraTiming)
                }
            }
            for(let log of recoveredData.logs){
                const existingLog = await LogsDao.getLog(log._id);
                if(!existingLog){
                    await LogsDao.saveRecoveredLog(log)
                }
            }

            for(let suspect of recoveredData.suspects){
                const existingSuspect = await SuspectDao.getSuspect(suspect._id);
                if(!existingSuspect){
                    await SuspectDao.saveRecoveredSuspect(suspect)
                }
            }
            console.log("Data recovered.")
            res.send("Data recovered.")
        }
        catch(error){
            next(error)
        }
    }


    // ["123", "Center1", "Center2", "Center3", "Center4"]

}
