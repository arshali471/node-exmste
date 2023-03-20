import express from 'express';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config/environment';
import axios from 'axios';
import { apiURLs } from '../config/apiUrls';
import { ISTE_User } from '../lib/interfaces/ISTE_User';
import { StudentRegisteration } from '../models/StudentRegisterations';
// import { Lab } from '../models/Lab.model';

// STE_CLD Auth middleware
export function StudentRegisterationLock() {
    return async function (req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            let studentRegisterations = await StudentRegisteration.find();
            if (studentRegisterations.length) {
                return res.status(403).send({ message: "Student Registerations are already fetched" });
            } else {
                next();
            }

        } catch (error) {
            next(error);
        }
    }
}

// export function ExamCenterDataLock() {
//     return async function (req: express.Request, res: express.Response, next: express.NextFunction) {
//         try {
//             let labs = await Lab.find();
//             if (labs.length) {
//                 return res.status(403).send({ message: "Exam Center data is already fetched" });
//             } else {
//                 next();
//             }

//         } catch (error) {
//             next(error);
//         }
//     }
// }
// pm2 
// export function ExamQuestionPaperLock() {
//     return async function (req: express.Request, res: express.Response, next: express.NextFunction) {
//         try {
//             let questionPaper = await QuestionPaperModel.find();
//             if (questionPaper.length) {
//                 return res.status(403).send({ message: "Exam Question paper data is already fetched" });
//             } else {
//                 next();
//             }

//         } catch (error) {
//             next(error);
//         }
//     }
// }
