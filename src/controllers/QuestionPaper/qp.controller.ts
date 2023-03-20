import express from 'express';
import { QuestionDao } from '../../lib/dao/question.dao';
import { WallSyncService } from '../../services/wallSync/wallSyncService';


export default class QPController {
  static async testRoute(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      res.send("ok");
    } catch (error) {
      next(error);
    }
  }

  static async syncQuestions(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const questions = await WallSyncService.downloadQuestions();
      if(!questions){
        return res.status(404).send("Unable to sync questions.")
      }
      res.send(questions)
    } catch (error) {
      next(error);
    }
  }

  static async getQuestionPaperKeys(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const qpKeys = await WallSyncService.downloadQuestionPaperKeys();
      if(!qpKeys){
        return res.status(400).send("Unable to sync qp keys.")
      }
      res.send(qpKeys);
    } catch (error) {
      next(error);
    }
  }

  static async getQuestions(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      let count: any = req.query.count || 50;
      let skip: any = 0;
      let page = req.query.page || 0;

      if (req.query.count) {
        count = count;
      }
      if (req.query.page) {
        skip = Math.max(Number(count) * (Number(page) - 1), 0);
      }
      let searchText: string = req.query.searchText as string;

      const questions = await QuestionDao.getQuestions(skip, count, searchText);
      if (!questions || questions.length == 0) {
        return res.status(404).send("Unable to find Suspected Candidates.");
      }
      let totalCount = questions.metadata.length ? questions.metadata[0].total : 0;
      let questionsDetail = questions.data;
      const totalPages = Math.ceil(totalCount / count);

      return res.send({ questionsDetail, totalPages });
    } catch (e) {
      next(e);
    }
  }
}
