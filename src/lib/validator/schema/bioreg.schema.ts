import Joi from 'joi';
import { DefaultMessage } from '../messages/default.mesage';

export const RegisterUser = Joi.object({
   photo: Joi.string().required().messages(DefaultMessage.defaultRequired("Photo")),
   iris: Joi.string(),
   fingerPrint: Joi.string()
}).required();

export const CandidateLoginSchema = Joi.object({
   regno: Joi.string().required().messages(DefaultMessage.defaultRequired("Registration Number")),
   password: Joi.string().required().messages(DefaultMessage.defaultRequired("Password")),
   deviceId: Joi.string().required().messages(DefaultMessage.defaultRequired("Device Id")),
}).required();


