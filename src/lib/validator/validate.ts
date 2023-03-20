import express, { NextFunction } from 'express';
import Joi from 'joi';

export function Validate(validationSchema: Joi.Schema) {
    return function (req: express.Request, res: express.Response, next: NextFunction) {
        let result = validationSchema.validate(req.body);
        if (result.error) {
            return res.status(400).send(result.error.message);
        } else {
            next();
        }
    }
}

export function ValidateParams(validationSchema: Joi.Schema) {
    return function (req: express.Request, res: express.Response, next: NextFunction) {
        let result = validationSchema.validate(req.params);
        if (result.error) {
            return res.status(400).send(result.error.message);
        } else {
            next();
        }
    }
}
