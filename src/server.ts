import express from 'express';
import { DB } from './config/DB';
import Middleware from './config/middleware';
import ErrorHandler from './helper/error.handler';
import Routes from './router/index.router';

export class Server {
    public app: express.Application;
    isDbConnected: boolean;
    constructor() {
        this.app = express();
        this.isDbConnected = false;

        // DB connection
        DB.connect(this); 
        // Moved to login controller

        // Initializing app middlewares
        Middleware.init(this);

        // Intializing Routes
        Routes.init(this);

        // Error handling
        ErrorHandler.init(this);

        // Listen Socket from EXMCLD
        // listenSocket('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiZTJhNmM4ZTEtOGM3ZC00NmIzLWE4ODMtNWQyMDMwNGZmNjJlIiwiaWF0IjoxNjI2MzQ0MjMzLCJleHAiOjE2MjY0MzA2MzN9.wiJD-H9q0C7VmkFoJrgj2pkWq7YYijZ02Uhnxlrvkew');

        // listen for new exam paper
        // listenForQuestionPaper();

    }
}
