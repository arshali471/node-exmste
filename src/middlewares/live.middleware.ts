import express from 'express';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config/environment';
import CandidateDeviceDao from '../lib/dao/candidate-device.dao';
import LiveMappingDao from '../lib/dao/liveMapping.dao';
import { LogEnum } from '../lib/enums/log.enum';
import candidateDeviceModel from '../models/candidateDevice.model';
import LogModel from '../models/Log.model';

// Bio RegAuth middleware
export function LiveMiddleWare() {
    return async function (req: express.Request, res: express.Response, next: express.NextFunction) {
        try {

            if (!req.headers.authorization) {
                return res.status(401).send("Invalid Token");
            }

            
            const decoded = jwt.verify(req.headers.authorization, CONFIG.jwt.live_secret) as any;
            

            const live_mapping = await LiveMappingDao.getLiveMappingByStudentId(decoded['student_id']);

            
            if(!live_mapping){
                return res.status(404).send("No mapping found.")
            }
            const devices = await CandidateDeviceDao.getStudentActiveDevice(live_mapping.student, req.headers.devinfo);

            // if(!devices){
            //     return res.status(404).send("No devices found.")
            // }


            if (live_mapping?.isSubmitted == true) {
                return res.status(401).send("Exam is submitted! Contact Admin.");
            }

            if (live_mapping?.timeRemaining <= 0) {
                return res.status(400).send("No Time Remaining!");;
            }

            if (live_mapping?.blocked == true) {
                return res.status(401).send("Student is blocked! Contact Admin.");
            }



            const user_devices = await candidateDeviceModel.find({ studentId: decoded['student_id'], allowed: true });
            if (user_devices.length >= 2) {
                return res.status(400).send("2 or more devices are allowed for the user! Contact Admin to allow only one device");;
            }

            if (user_devices.length <=  0) {
                return res.status(400).send("No devices registered for the user! Contact Admin.");;
            }

            LogModel.create({
                type: LogEnum.LIVE_EXAM,
                user: live_mapping.student_id,
                student: live_mapping.student,
                // email: string,
                isLogin: true,
                isActive: true,
                status: "Live Exam Middleware Called",
                accessLevel : 7,
                meta: "Live Token Authorization Successful",
                payload: JSON.stringify(req.body),
                params: JSON.stringify(req.params),
                origin: req.headers.origin as string,
                devInfo: req.headers.devinfo as string,
                originalUrl: req.originalUrl,
                examMappingId: live_mapping._id
              })


            req.live_user = live_mapping;
            next();


        } catch (error) {
            next(error);
        }
    }
}

