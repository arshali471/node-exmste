import { CONFIG } from "../../config/environment";
import { QuestionDao } from "../../lib/dao/question.dao";
import { QuestionsModel } from "../../models/questions.model";
import { ExmwallService } from "../exmwall/exmwallService";
import fs from "fs";
import { QpKeyModel } from "../../models/QpKey.model";
import { QpKeyDao } from "../../lib/dao/qpKey.dao";
import SettingsDao from "../../lib/dao/settings.dao";
import { SettingsEnum } from "../../lib/enums/settings.enum";

export class WallSyncService {
  static async downloadQuestions() {
    const questions = await ExmwallService.makeRequest(
      CONFIG.exmwall.getQuestions,
      "GET"
    );
    for (let question of questions) {
      const existingQuestion = await QuestionDao.getQuestionById(question._id);
      if (!existingQuestion) {
        let newQuestion = new QuestionsModel({
          _id: question._id,
          image: question.image,
          language: question.language,
          options: question.options,
          questionType: question.questionType,
          optionType: question.optionType,
          topicId: question.topicId,
          subjectId: question.subjectId,
          audio: question.audio,
          video: question.video,
          createdAt: question.createdAt,
          updatedAt: question.updatedAt,
          examId: question.examId,
          shiftId: question.shiftId,
          sectionId: question.sectionId,
        });
        await newQuestion.save();
      }

      if (question?.image) {
        const url = await question.image;
        const fileName = await url.split("/");
        const questionImage = await ExmwallService.getQuestionData(url);
        if (
          !fs.existsSync(
            `${CONFIG.questionDataFolderPath}/${
              fileName[fileName.length - 1]
            }.exm`
          )
        ) {
          fs.writeFileSync(
            `${CONFIG.questionDataFolderPath}/${
              fileName[fileName.length - 1]
            }.exm`,
            questionImage
          );
        }
      }

      if (question?.audio) {
        const url = await question.audio;
        const fileName = await url.split("/");
        const questionAudio = await ExmwallService.getQuestionData(url);
        if (
          !fs.existsSync(
            `${CONFIG.questionDataFolderPath}/${
              fileName[fileName.length - 1]
            }.exm`
          )
        ) {
          fs.writeFileSync(
            `${CONFIG.questionDataFolderPath}/${
              fileName[fileName.length - 1]
            }.exm`,
            questionAudio
          );
        }
      }

      if (question?.video) {
        const url = await question.video;
        const fileName = await url.split("/");
        const questionVideo = await ExmwallService.getQuestionData(url);
        if (
          !fs.existsSync(
            `${CONFIG.questionDataFolderPath}/${
              fileName[fileName.length - 1]
            }.exm`
          )
        ) {
          fs.writeFileSync(
            `${CONFIG.questionDataFolderPath}/${
              fileName[fileName.length - 1]
            }.exm`,
            questionVideo
          );
        }
      }

      if (question?.attachments && question?.attachments.length > 0) {
        const url = await question.attachments;
        const fileName = await url.split("/");
        const questionAttachments = await ExmwallService.getQuestionData(url);
        if (
          !fs.existsSync(
            `${CONFIG.questionDataFolderPath}/${
              fileName[fileName.length - 1]
            }.exm`
          )
        ) {
          fs.writeFileSync(
            `${CONFIG.questionDataFolderPath}/${
              fileName[fileName.length - 1]
            }.exm`,
            questionAttachments
          );
        }
      }
      // console.log(fileName[3])
    }

    return await questions;
  }

  static async downloadQuestionPaperKeys() {
    const keys = await ExmwallService.getQuestionPaperKeys();
    if (keys.length == 0) {
      return false;
    }
    for (let key of keys) {
      const existingKey = await QpKeyDao.getExistingKey(key.key);
      if (existingKey) {
        const updateKey = await QpKeyDao.updateKey(key.key, key.url);
        if (!updateKey) {
          return false;
        }
      }
      if (!existingKey) {
        let dbKey = new QpKeyModel({
          url: key.url,
          key: key.key,
        });
        await dbKey.save();
      }
    }
    return await keys;
  }

    static async downloadExamDetails(){
        const examDetails = await ExmwallService.getExamDetails()
        if(!examDetails){
            return false
        }

        await SettingsDao.create(examDetails.instructions, SettingsEnum.INSTRUCTIONS)
        await SettingsDao.create(examDetails.sectionIds, SettingsEnum.SECTIONS)
        return await examDetails;
    
    }
}
