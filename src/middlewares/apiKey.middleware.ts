import express from 'express';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config/environment';
import fs from 'fs';

// Bio RegAuth middleware
export function ApiKeyMiddleWare() {
    return async function (req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            if (!req.headers.authorization) {
                return res.status(401).send("Invalid Token");
            }

            const decoded = jwt.verify(req.headers.authorization, CONFIG.jwt.secret) as any;

            if(!fs.existsSync(CONFIG.configApi)){
                return res.status(401).send("Wall Api key not found")
            }
            
            const apikey = fs.readFileSync(CONFIG.configApi).toString();

            if (apikey != decoded['apikey']) {
                return res.status(401).send("Invalid Token")
            }
            next();

        } catch (error) {
            next(error);
        }
    }
}
