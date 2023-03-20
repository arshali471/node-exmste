import express from 'express';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config/environment';
import StudentRegisterationDao from '../lib/dao/studentRegistration.dao';
import { CandidateService } from '../services/candidate/candidateService';

// Bio RegAuth middleware
export function BasicAuthMiddleWare() {
    return async function (req: express.Request, res: express.Response, next: express.NextFunction) {
        try {

            if (!req.headers.authorization) {
                return res.status(401).send("Invalid Token");
            }

            const decoded = jwt.verify(req.headers.authorization, CONFIG.jwt.secret) as any;

            const user = await CandidateService.getCandidateBy_id(decoded['id']);
            if (!user) {
                return res.status(401).send("Unauthorized");
            }
            req.user = user;
            next();

        } catch (error) {
            next(error);
        }
    }
}

