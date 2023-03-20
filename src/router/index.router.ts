import express, { NextFunction, Request, Response } from 'express';
import { IServer } from '../lib/interfaces';
import BioRegRouter from './bioReg.router';
import QuestionPaperRouter from './questionPaper';
import ExmwallRouter from './exmwall.router';
import CandidateRouter from './candidate.router';
import LiveRouter from './live.router';
import NixsteRouter from './nixste.router';
import LabDeviceRouter from './labDevice.router';

export default class Routes {

    static init(server: IServer): void {
        const router: express.Router = express.Router();

        server.app.use('/', router);
        // Health check
        server.app.get('/healthCheck', async (req: Request, res: Response, next: NextFunction) => {
            let healthcheck = {
                dbConnect: server.isDbConnected,
                uptime: process.uptime(),
                message: 'OK',
                time: new Date().toLocaleString()
            };
            try {
                res.send(healthcheck);
            } catch (e) {
                healthcheck.message = e as any;
                res.status(503).send(healthcheck);
            }
        });


        // Bio registerations
        server.app.use('/api/v1/bioReg', new BioRegRouter().router);

        // Question paper
        server.app.use('/api/v1/qp', new QuestionPaperRouter().router);
        
        //exmste login
        server.app.use('/api/v1/exmwall', new ExmwallRouter().router);

        // Candidate
        server.app.use('/api/v1/basic', new CandidateRouter().router);

        //live
        server.app.use('/api/v1/live', new LiveRouter().router);

        server.app.use("/api/v1/nixste", new NixsteRouter().router);

        server.app.use("/api/v1", new LabDeviceRouter().router);

    }
}
