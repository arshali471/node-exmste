import {QuestionDao} from "../../lib/dao/question.dao";
import { CONFIG } from "../../config/environment";
import fs from 'fs';
import { QpKeyDao } from "../../lib/dao/qpKey.dao";
import { SymmetricCrypt } from "../../util/symmetricCrypt";

export default class LiveExamService {
    static async getQuestionById(questionId: any){
        const question = await QuestionDao.getLeanQuestionById(questionId);
        if(!question){
            return false
        }

        if(question.image){
            const path = question.image.split("/")
            const enc_data = fs.readFileSync(CONFIG.questionDataFolderPath + "/" + path[path.length-1] + ".exm").toString();
            const key: any = await QpKeyDao.getKeyForUrl(question.image);
            const dec_data = SymmetricCrypt.decipherData(enc_data, key.key);
            question.image = dec_data;

        }

        if(question.video){
            const path = question.video.split("/")
            const enc_data = fs.readFileSync(CONFIG.questionDataFolderPath + "/" + path[path.length-1]+ ".exm").toString();
            const key: any = await QpKeyDao.getKeyForUrl(question.video);
            const dec_data = SymmetricCrypt.decipherData(enc_data, key.key);
            question.video = dec_data;

        }

        if(question.audio){
            const path = question.audio.split("/")
            const enc_data = fs.readFileSync(CONFIG.questionDataFolderPath + "/" + path[path.length-1]+ ".exm").toString();
            const key: any = await QpKeyDao.getKeyForUrl(question.audio);
            const dec_data = SymmetricCrypt.decipherData(enc_data, key.key);
            question.audio = dec_data;

        }

        if(question.attachments){
            let dec_attachments = [];
            for(let attachment of question.attachments){
                const path = attachment.split("/")
                const enc_data = fs.readFileSync(CONFIG.questionDataFolderPath + "/" + path[path.length-1]+ ".exm").toString();
                const key: any = await QpKeyDao.getKeyForUrl(attachment);
                const dec_data = SymmetricCrypt.decipherData(enc_data, key.key);
               attachment = dec_data;
               dec_attachments.push(attachment)
            }
            question.attachments = dec_attachments
        }
        const final_question = question;
        return final_question
    }

}

//getExamdetails, studentdetails