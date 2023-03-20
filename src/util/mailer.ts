import nodemailer from 'nodemailer';
import { CONFIG } from '../config/environment';
import { STUDENT_VERIFICATION_HTML } from './emailTemplates/studentVerified';
import { throwError } from './functions';

export class Mailer {
    static async sendEmail(mailType: string, email: string, subject: string, username: string) {

        let mailOptions = {
            from: CONFIG.mailFrom,
            to: email,
            subject: `${subject}`,
            html: Mailer.getHTML(mailType, { username })
        }

        return await Mailer.sendMail(mailOptions);
    }

    static getHTML(mailType: string, data: any) {
        switch (mailType) {
            case 'STUDENT_VERIFIED':
                return STUDENT_VERIFICATION_HTML(data.username);

            default:
                throwError('Cannot find email template', 400);
        }
    }

    static async sendMail(mailOptions: nodemailer.SendMailOptions) {
        let transperter = nodemailer.createTransport({
            service: CONFIG.mailCredential.service,
            auth: {
                user: CONFIG.mailCredential.auth.user,
                pass: CONFIG.mailCredential.auth.pass
            }
        });

        try {
            return await transperter.sendMail(mailOptions);
        } catch (error) {
            throwError("Failed sending email", 400);
        }
    }

}