import { Request, Response, NextFunction } from "express";
import CandidateTimingDao from "../../lib/dao/candidateTimings.dao";
import SettingsDao from "../../lib/dao/settings.dao";
import { CandidateService } from "../../services/candidate/candidateService";
import CandidateDeviceService from "../../services/candidateDevice/candidate-device.service";
import { ClockService } from "../../services/clock/clockService";
import { Utility } from "../../util";

export class CandidateController{
    static async login(req: Request, res: Response, next: NextFunction){
        try{
            let regno = req.body.regno;
            let password = req.body.password;
            let deviceId = req.body.deviceId;

            // const candidate = await CandidateService.getCandidateByApplicationNo(applicationNumber);
            const candidate = await CandidateService.getCandidateByRegNo(regno);
            
            if(!candidate){
                return res.status(404).send("No candidate found. Contact Admin!")
            }

            if (!Utility.comparePasswordHash(candidate.password, password)) {
                return res.status(400).send("Incorrect Password");
            }

            let token = Utility.generateJwtTokenForCandidate(candidate?._id);

            
            await CandidateDeviceService.updateDeviceId(candidate.allotedSeat.computer_mac, candidate.studentid, {
                computer_ip: JSON.stringify(req.headers['x-forwarded-for'] || req.socket.remoteAddress),
                deviceId: deviceId
            })

            const loggedInAt = new Date()
            const payload = {loggedInAt}

            await CandidateTimingDao.updateUserTimings(candidate.studentid, candidate.examId, candidate.shiftId, candidate._id,  payload)
           
            res.send({ user: candidate.name, token: token })


        }
        catch(error){
            next(error)
        }
    }

    static async getDetails(req: Request, res: Response, next: NextFunction){
        try{
            const user = req.user;
            res.send(user)
        }
        catch(error){
            next(error)
        }
    }

    // static async isAllowed()

    static async getInstructions(req: Request, res: Response, next: NextFunction){
        try{
            const instructions = await SettingsDao.get("instructions");
           
            await CandidateTimingDao.updateUserTimings(req.user.studentid, req.user.examId, req.user.shiftId, req.user._id, {
                instructionReadAt: new Date()
            })

            const timeRemainingBeforeExamStart = await ClockService.getTimeRemainingBeforeExamStart()
           
            res.send({instructions: instructions, ExamStartsIn: timeRemainingBeforeExamStart})
        }
        catch(error){
            next(error)
        }
    }

    static async checkOk(req: Request, res: Response, next: NextFunction){
        try{
           
            res.send("ok")
        }
        catch(error){
            next(error)
        }
    }
}