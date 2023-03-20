import { Router } from 'express';
import { LabDeviceController } from '../controllers/labDevice/labDevice.controller';

export default class LabDeviceRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public routes(): void {
        // GET
        this.router.get("/lab/device", LabDeviceController.get);
        this.router.get("/checkServer", LabDeviceController.checkServer);

        
        // POST
        this.router.post('/lab/device', LabDeviceController.create)

        //TEST

        



        // PUT
    }
}
