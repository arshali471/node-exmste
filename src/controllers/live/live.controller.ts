import { Request, Response, NextFunction, response } from "express";
import { CONFIG } from "../../config/environment";
import { CryptoHelper } from "../../helper/cryptoHelper";
import CandidateTimingDao from "../../lib/dao/candidateTimings.dao";
import LiveMappingDao from "../../lib/dao/liveMapping.dao";
import { QuestionDao } from "../../lib/dao/question.dao";
import StudentRegisterationDao from "../../lib/dao/studentRegistration.dao";
import { SuspectDao } from "../../lib/dao/suspect.dao";
import LiveMappingModel from "../../models/LiveMapping.model";
import LiveExamService from "../../services/liveexam/liveexam.service";
import { LiveMappingService } from "../../services/liveMapping/liveMappingService";
import { ResponseService } from "../../services/response/responseService";
import { Utility } from "../../util";
import { CustomResponse } from "../../util/Response";
import { SymmetricCrypt } from "../../util/symmetricCrypt";
import fs from 'fs';
import { AsymmetricCrypt } from "../../util/asymmetricCrypt";
import { ClockDao } from "../../lib/dao/clock.dao";
import { ClockEnum } from "../../lib/enums/clock.enum";
import moment from "moment";
import ExtraTime from "../../lib/dao/extratime.dao";

export class LiveController {
  static async candidateLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const public_key:any = req.body.key;

      const liveMappingOfUser = await LiveMappingService.getLiveMappingOfUser(user._id);
      if(liveMappingOfUser){
        
        liveMappingOfUser.publicKey = public_key;
        let token = Utility.generateJwtTokenForLiveCandidate(
          user.studentid,
          user.shiftId,
          user.allotedSeat.computer_id,
          liveMappingOfUser._id
        );
          
        const lastSyncOn = new Date();
        const payload = { lastSyncOn };
        await CandidateTimingDao.updateUserTimings(
          user.studentid,
          user.examId,
          user.shiftId,
          user._id,
          payload
        );
          
        const server_pk = fs.readFileSync(CONFIG.PUBLIC_KEY_PATH).toString();
        await liveMappingOfUser.save();
        
        res.send({ username: user.name, liveToken: token, key: liveMappingOfUser.key, publicKeyServer: server_pk });
      }
      if(!liveMappingOfUser){
        const gateClosingTime = await ClockDao.get(ClockEnum.GATE_CLOSING_TIME)
        if(moment(gateClosingTime?.value).isBefore(moment())){
  
          const liveMapping: any = await LiveMappingService.createLiveMapping(user, public_key);
          
          let token = Utility.generateJwtTokenForLiveCandidate(
            user.studentid,
            user.shiftId,
            user.allotedSeat.computer_id,
            liveMapping._id
          );
            
          const examStartedAt = new Date();
          const payload = { examStartedAt };
          await CandidateTimingDao.updateUserTimings(
            user.studentid,
            user.examId,
            user.shiftId,
            user._id,
            payload
          );
            
          const server_pk = fs.readFileSync(CONFIG.PUBLIC_KEY_PATH).toString();
          
          res.send({ username: user.name, liveToken: token, key: liveMapping.key, publicKeyServer: server_pk });
        }
      }
      else{
        res.status(400).send("Gate Closed.")
      }
    } catch (error) {
      next(error);
    }
  }

  static async getQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const lastQuestionId = req.params.id;
      const liveUser = req.live_user;
      const question: any = await LiveExamService.getQuestionById(
        req.params.id
      );

      const payload = { lastQuestionId };
      await CandidateTimingDao.updateUserTimings(
        liveUser.student,
        liveUser.examId,
        liveUser.shiftId,
        liveUser._id,
        payload
      );
      if (!question) {
        return res.status(404).send("No Question found.");
      }

      const key = SymmetricCrypt.createKey();
      const encryptedQuestion = await CryptoHelper.Encrypt(question, key);
      const encryptedKey = await AsymmetricCrypt.publicEncrypt(req.live_user.publicKey, key);


      res.send({ encryptedKey: encryptedKey, encryptedQuestion: encryptedQuestion.encryptedData });

    } catch (error) {
      next(error);
    }
  }

  static async getCurrentQuestion(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // const current_question_id = await LiveExamService.getCurrentQuestion(req.user.studentid)
      // res.send(current_question_id);
    } catch (e) {
      next(e);
    }
  }

  static async syncTime(req: Request, res: Response, next: NextFunction) {
    try {
      const cad_time = Number(req.body.userTime);
      const live_mapping = await LiveMappingService.getMappingById(req.live_user._id);


      if (!live_mapping || !cad_time) return res.status(404).send(new CustomResponse({}, "No Exam Time found over server", 404));

      let liveUserRemainingTime = live_mapping.timeRemaining;

      let updateRequired = false;

      if(live_mapping.blocked){
        return res.status(410).send(new CustomResponse({  }, "Blocked: Contact Admin", 410))
      }

      const extraTimeData = await ExtraTime.getNotAllotedTimeForMapping(live_mapping._id);
      let extraTime = 0
      if(extraTimeData && extraTimeData.length > 0 ) {
        for(const time of extraTimeData){
          extraTime = extraTime + Number(time.time);
          time.alloted = true;
          await time.save();
        }
      }

      if (cad_time < liveUserRemainingTime) {
        const updatedLiveMapping = await LiveMappingDao.updateTimeRemainingForLiveUser(live_mapping.student, live_mapping.examId, live_mapping.shiftId, (cad_time + extraTime))
        if (!updatedLiveMapping) {
          return res.status(400).send("live mapping is unable to update.")
        }
        if(extraTime > 0){
          updateRequired = true;
        }
        res.send(new CustomResponse({ timeRemaining: (cad_time + extraTime), updateRequired: updateRequired }, "Remaining Time is " + liveUserRemainingTime, 200));
      }

      if (cad_time >= liveUserRemainingTime) {

        const suspect = await SuspectDao.create(live_mapping._id, live_mapping.student, "User is sending more or same remaining time sending " + cad_time + " remaining "+ liveUserRemainingTime)
        if (!suspect) {
          return res.status(400).send("Suspected model facing issues while creating.")
        }
        
        if(extraTime > 0){
          liveUserRemainingTime = liveUserRemainingTime + extraTime;
          await LiveMappingDao.updateTimeRemainingForLiveUser(live_mapping.student, live_mapping.examId, live_mapping.shiftId, liveUserRemainingTime)
        }

        updateRequired = true
        res.send(new CustomResponse({ timeRemaining: liveUserRemainingTime, updateRequired: updateRequired }, "Remaining Time is " + liveUserRemainingTime, 200));
      }

    }

    catch (e) {
      next(e);
    }
  }

  static async getCandidateTimings(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const liveUser = req.live_user;
      const candidateTimings = await CandidateTimingDao.getCandidateTimings(
        liveUser.student,
        liveUser.student_id,
        liveUser.examId,
        liveUser.shiftId
      );
      if (!candidateTimings) {
        return res.status(404).send("Candidate Timings Not found");
      }
      res.send(candidateTimings);
    } catch (e) {
      next(e);
    }
  }

  static async getCandidateMapping(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const liveUser = req.live_user;
      const mapping = await LiveMappingDao.getCandidateMapping(
        liveUser.student,
        liveUser.student_id,
        liveUser.examId,
        liveUser.shiftId
      );
      if (!mapping) {
        return res.status(404).send("Candidate Mapping Not found");
      }
      res.send(mapping);
    } catch (e) {
      next(e);
    }
  }

  static async getNextQuestion(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      let questionId = req.params.questionId;
      let sectionId = req.params.sectionId
      const liveUser = req.live_user;

      const questions = liveUser.questionPaper.find((section) => section.sectionId == sectionId);
      if (!questions) return res.status(400).send("No questions found in this section");

      const index = questions.questions.findIndex((question) => question == questionId);
      if (index + 1 > questions.questions.length - 1) return res.status(400).send("This is the last question");

      const nextQuestion = questions.questions[index + 1];
      res.send(nextQuestion)

    } catch (e) {
      next(e);
    }
  }


  static async getPreviousQuestion(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      let questionId = req.params.questionId;
      let sectionId = req.params.sectionId
      const liveUser = req.live_user;

      const questions = liveUser.questionPaper.find((section) => section.sectionId == sectionId);
      if (!questions) return res.status(400).send("No questions found in this section");

      const index = questions.questions.findIndex((question) => question == questionId);
      if (index - 1 < 0) return res.status(400).send("You are on first Question");

      const previousQuestion = questions.questions[index - 1];
      res.send(previousQuestion)
    } catch (e) {
      next(e);
    }
  }



  static async saveResponse(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      let questionId = req.params.questionId;
      let examId = req.live_user.examId;
      let shiftId = req.live_user.shiftId;
      let markedForReview = payload.markedForReview;
      let response = payload.response;
      const encryptedResponse = await CryptoHelper.Encrypt(response, req.live_user.key)
      const liveMappingId = req.live_user._id;
      const studentId = req.live_user.student;
      const student_id = req.live_user.student_id;

      const saveResponse = await ResponseService.saveResponse(questionId, examId, shiftId, markedForReview, liveMappingId, encryptedResponse.encryptedData, studentId, student_id)
      res.send("Response saved")
    }
    catch (e) {
      next(e)
    }
  }

  static async getResponse(req: Request, res: Response, next: NextFunction) {
    try {
      const questionId = req.params.questionId;
      const response = await ResponseService.getResponseByQuestionId(questionId)
      if (!response) {
        return res.status(404).send("No response found with this questionId.")
      }
      res.send(response)
    }
    catch (e) {
      next(e)
    }
  }

  static async getStudentRegistration(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.live_user;
      const studentRegistration = await StudentRegisterationDao.getStudentRegistration(user.student_id)
      if (!studentRegistration) {
        return res.status(404).send("No student registartion found.")
      }
      res.send(studentRegistration)
    }
    catch (e) {
      next(e)
    }
  }

  static async clearResponse(req: Request, res: Response, next: NextFunction) {
    try {
      const questionId = req.params.questionId;
      const clearResponse = await ResponseService.clearResponse(questionId)
      if (!clearResponse) {
        return res.status(404).send("No student registartion found.")
      }
      res.send(clearResponse)
    }
    catch (e) {
      next(e)
    }
  }

  static async submitExam(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.live_user;
      const getAllResponses = await ResponseService.getAllUserResponses(user._id);

      let markedForReview = 0;
      let notAnswered = 0;
      let answered = 0;

      let totalQuestions = 0

      for (const questionPaper of user.questionPaper) {
        totalQuestions = totalQuestions + questionPaper.questions.length
        notAnswered = notAnswered + questionPaper.questions.length
      }

      for (const response of getAllResponses) {
        if (response.markedForReview) markedForReview++;
        if (response.selectedOption) {
          answered = answered + 1;
          notAnswered = notAnswered - 1
        }
      }

      res.send({ markedForReview, notAnswered, answered, totalQuestions });
    }
    catch (e) {
      next(e)
    }
  }

  static async examState(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.live_user;
      const sectionId = req.params.sectionId;

      const getAllResponses = await ResponseService.getAllUserResponses(user._id);

      let markedForReview = 0;
      let notAnswered = 0;
      let answered = 0;
      let totalQuestions = 0

      let questionStats = [];

      const sectionQuestions = user.questionPaper.find((section) => section.sectionId == sectionId);

      if (!sectionQuestions) {
        return res.status(404).send("No section found with this sectionId.")
      }

      totalQuestions = totalQuestions + sectionQuestions.questions.length;
      notAnswered = notAnswered + sectionQuestions.questions.length;

      for (const response of getAllResponses) {
        if (response.markedForReview) markedForReview++;
        if (response.selectedOption) {
          answered = answered + 1;
          notAnswered = notAnswered - 1
        }
      }

      for (const question of sectionQuestions.questions) {
        let question_stats = {
          questionId: question,
          markedForReview: false,
          visited: false,
          answered: false
        }

        const response = getAllResponses.find((response) => String(response.questionId) == String(question));
        if (response) {
          question_stats.visited = true;
          question_stats.markedForReview = response.markedForReview;
          question_stats.answered = response.selectedOption ? true : false;
        }

        questionStats.push(question_stats);
      }

      res.send({ markedForReview, notAnswered, answered, totalQuestions, questionStats });

    }
    catch (e) {
      next(e)
    }
  }

  static async finalSubmission(req: Request, res: Response, next: NextFunction){
    try{
      let liveMapping = req.live_user

      liveMapping.blocked = true;
      liveMapping.isSubmitted = true;
      liveMapping.isOnline = false;

      await liveMapping.save();

      res.send(new CustomResponse({timeRemaining: liveMapping.timeRemaining}, "Exam Submitted", 200))

    }
    catch(e){
      next(e)
    }
  }
}

