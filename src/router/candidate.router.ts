import { Router } from 'express';
import { CandidateController } from '../controllers/candidate/candidate.controller';
import ExmwallController from '../controllers/exmwall/exmwall.controller';
import { ClockEnum } from '../lib/enums/clock.enum';
import { CandidateLoginSchema } from '../lib/validator/schema/bioreg.schema';
import { Validate } from '../lib/validator/validate';
import { BasicAuthMiddleWare } from '../middlewares/basic.middleware';
import { ClockMiddleware } from '../middlewares/clock.middleware';

export default class CandidateRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public routes(): void {
        // GET
        this.router.get('/candidate', BasicAuthMiddleWare(), CandidateController.getDetails);
        this.router.get("/instructions", BasicAuthMiddleWare(), ClockMiddleware([ClockEnum.CANDIDATE_START_TIME]), CandidateController.getInstructions)
        this.router.get("/check/instructions", BasicAuthMiddleWare(), ClockMiddleware([ClockEnum.CANDIDATE_START_TIME]), CandidateController.checkOk)

        
        // POST
        this.router.post('/candidate/login', Validate(CandidateLoginSchema), ClockMiddleware([ClockEnum.LOGIN_TIME]), CandidateController.login);

        // PUT
    }
}
