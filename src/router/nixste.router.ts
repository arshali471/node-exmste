import { Router } from "express";
import NixSteController from "../controllers/Nixste/Nixste.controller";
import { ApiKeyMiddleWare } from "../middlewares/apiKey.middleware";

export default class NixsteRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public routes(): void {
        // GET
        this.router.get('/candidates', ApiKeyMiddleWare(), NixSteController.getCandidates);
        this.router.get('/clocks/get', ApiKeyMiddleWare(), NixSteController.getAllClocks);
        this.router.get('/devices/get', ApiKeyMiddleWare(), NixSteController.getDevices);
        this.router.get('/suspects', ApiKeyMiddleWare(), NixSteController.getSuspects);
        this.router.get('/client-url', ApiKeyMiddleWare(), NixSteController.getClientUrl);
        this.router.get('/liveMappings', ApiKeyMiddleWare(), NixSteController.getAllLiveMappings);
        this.router.get('/extra-time/get', ApiKeyMiddleWare(), NixSteController.extraTimeGet);
        this.router.get('/logs/get', ApiKeyMiddleWare(), NixSteController.getLogs)

        // POST
        this.router.post('/client-url', ApiKeyMiddleWare(), NixSteController.addClientUrl);
        this.router.post('/extra-time/add/:mappingId', ApiKeyMiddleWare(), NixSteController.extraTimeAdd);


        // PUT
    }
}
