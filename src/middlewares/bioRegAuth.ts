import express from 'express';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config/environment';
import { RoleEnum } from '../lib/enums';
import { BioRegUser } from '../models';

// Bio RegAuth middleware
export function BioRegAuth() {
    return async function (req: express.Request, res: express.Response, next: express.NextFunction) {
        try {

            if (!req.headers.authorization) {
                return res.status(401).send("Invalid Token");
            }

            const decoded = jwt.verify(req.headers.authorization, CONFIG.jwt.secret) as any;
            

            const user = await BioRegUser.findById(decoded['id']);
            if (!user) {
                return res.status(401).send("Invalid Token")
            }
            req.bioUser = user;

            next();

        } catch (error) {
            next(error);
        }
    }
}
