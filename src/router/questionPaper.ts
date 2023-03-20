
import { Router } from 'express';
import { ApiKeyMiddleWare } from '../middlewares/apiKey.middleware';
import QPController from '../controllers/QuestionPaper/qp.controller';

export default class QuestionPaperRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public routes(): void {
        // GET
            this.router.get("/test-route", ApiKeyMiddleWare(), QPController.testRoute)
            this.router.get("/questions", ApiKeyMiddleWare(), QPController.getQuestions)
            
        // POST

        // PUT


    }
}
