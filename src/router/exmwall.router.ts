import { Router } from 'express';
import ExmwallController from '../controllers/exmwall/exmwall.controller';
import QPController from '../controllers/QuestionPaper/qp.controller';
import { ApiKeyMiddleWare } from '../middlewares/apiKey.middleware';

export default class ExmwallRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public routes(): void {
        // GET

        // POST
        this.router.post('/login', ExmwallController.exmwallLogin);

        this.router.get('/getCandidates', ExmwallController.getCandidates)
        this.router.get('/questions', ApiKeyMiddleWare(), QPController.syncQuestions)
        this.router.get('/qpKeys', ApiKeyMiddleWare(), QPController.getQuestionPaperKeys)
        this.router.get('/examDetails', ApiKeyMiddleWare(), ExmwallController.getExamDetails)
        this.router.get('/recoverData', ApiKeyMiddleWare(), ExmwallController.recoverData) 


        // this.router.get('/seatAllotment/:candidateId', ExmwallController.seatAllotment)

        // PUT
    }
}
