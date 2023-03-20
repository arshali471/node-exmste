import { Router } from 'express';
import { LiveController } from '../controllers/live/live.controller';
import { BasicAuthMiddleWare } from '../middlewares/basic.middleware';
import { ClockMiddleware } from '../middlewares/clock.middleware';
import { LiveMiddleWare } from '../middlewares/live.middleware';

export default class LiveRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public routes(): void {
        // GET
        this.router.get('/question/:id', LiveMiddleWare(), LiveController.getQuestion);
        this.router.post('/syncTime', LiveMiddleWare(), LiveController.syncTime);
        this.router.get('/candidate/timings', LiveMiddleWare(), LiveController.getCandidateTimings);
        this.router.get('/candidate/mapping', LiveMiddleWare(), LiveController.getCandidateMapping);
        this.router.get('/nextQuestion/:sectionId/:questionId', LiveMiddleWare(), LiveController.getNextQuestion);
        this.router.get('/previousQuestion/:sectionId/:questionId', LiveMiddleWare(), LiveController.getPreviousQuestion);
        this.router.get('/response/:questionId', LiveMiddleWare(), LiveController.getResponse);
        this.router.get('/studentRegistration', LiveMiddleWare(), LiveController.getStudentRegistration);
        this.router.get('/candidate/submit-stats', LiveMiddleWare(), LiveController.submitExam);
        this.router.get('/candidate/exam-state/:sectionId', LiveMiddleWare(), LiveController.examState);



        // POST
        this.router.post('/candidate/login', BasicAuthMiddleWare(), LiveController.candidateLogin);
        this.router.post('/saveResponse/:questionId', LiveMiddleWare(), LiveController.saveResponse);
        this.router.post('/exam/submit', LiveMiddleWare(), LiveController.finalSubmission);

        // PUT
        this.router.put('/clearResponse/:questionId', LiveMiddleWare(), LiveController.clearResponse);

    }
}
