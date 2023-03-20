
import { Router } from 'express';
import { BioRegController } from '../controllers/bioRegisterations/bioRegisteration.controller';
import { RegisterUser } from '../lib/validator/schema/bioreg.schema';
import { Validate } from '../lib/validator/validate';
import { ApiKeyMiddleWare } from '../middlewares/apiKey.middleware';
import { BioRegAuth } from '../middlewares/bioRegAuth';
export default class BioRegRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public routes(): void {
        // GET
        this.router.get('/candidates/registered', BioRegAuth(), BioRegController.getRegisteredCandidates);
        this.router.get('/candidates/notRegistered', BioRegAuth(), BioRegController.getNotRegisteredCandidates)
        this.router.get('/candidates/search', BioRegAuth(), BioRegController.searchCandidate);
        this.router.get('/candidates/:candidateId', BioRegAuth(), BioRegController.getCandidateById);
        this.router.get('/bio-user/get', ApiKeyMiddleWare(), BioRegController.getBioUsers);
        this.router.get('/candidates/get/:candidate', ApiKeyMiddleWare(), BioRegController.getCandidateDetails);

        // POST
        this.router.post('/login', BioRegController.login);
        this.router.post('/bio-user/create', ApiKeyMiddleWare(), BioRegController.createBioUsers);
        
        this.router.post('/candidates/register/:candidateId', BioRegAuth(), Validate(RegisterUser), BioRegController.registerCandidate);

        // PUT
        this.router.put('/candidates/re-register/:candidateId', BioRegAuth(), BioRegController.reRegisterCandidate);
        this.router.put('/bio-user/resetPassword', ApiKeyMiddleWare(), BioRegController.resetPasswordOfBioUser);
        this.router.put('/candidates/resetPassword/:candidate', BioRegAuth(), BioRegController.resetPasswordOfCandidate);


        //NEW ROUTES


    }
}
