import express from "express";
import moment from "moment";
import { ClockEnum } from "../lib/enums/clock.enum";
import { throwError } from "../util";
import jwt from "jsonwebtoken";
import { CONFIG } from "../config/environment";
import { CandidateService } from "../services/candidate/candidateService";
import { ClockDao } from "../lib/dao/clock.dao";

export function ClockMiddleware(clocks: ClockEnum[]) {
  return async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      let currentTime = moment();


      for (let clock of clocks) {

        const clock_detail = await ClockDao.get(clock);

        if (!clock_detail) {
          return res.status(400).send("Clock Not Available");
        }

        switch (clock) {
          case ClockEnum.SHIFT_START_DATE_AND_TIME: {
            if (moment(clock_detail.value).isAfter(currentTime)) {
              const timeRemaining = moment(clock_detail.value).diff(currentTime, "minutes");
              return res.status(400).send(`Exam has not started yet, Exam starts in ${timeRemaining} minutes .`);
            }
            continue;
          }


          case ClockEnum.SHIFT_END_DATE_AND_TIME: {
            if (moment(clock_detail.value).isBefore(currentTime)) {
              return res.status(400).send("Exam Shift has ended.");
            }
            continue;
          }

          case ClockEnum.QP_DELIVERY_TIME: {
            if (moment(clock_detail.value).isAfter(currentTime)) {
              const timeRemaining = moment(clock_detail.value).diff(currentTime, "minutes");
              return res
                .status(400)
                .send("Time is not valid to deliver question paper. Question Paper will deliver in" + timeRemaining + " minutes.");
            }
            continue;
          }

          case ClockEnum.USER_DATA_DELIVERY_TIME: {
            if (moment(clock_detail.value).isAfter(currentTime)) {
              const timeRemaining = moment(clock_detail.value).diff(currentTime, "minutes");
              return res
                .status(400)
                .send("Delivery time for user data has not started yet, User data will deliver in " + timeRemaining + "minutes.");
            }
            continue;
          }

          case ClockEnum.MINIMUM_SUBMISSION_TIME: {
            if (moment(clock_detail.value).isAfter(currentTime)) {
              const timeRemaining = moment(clock_detail.value).diff(currentTime, "minutes");
              return res
                .status(400)
                .send("Minimum submission has not yet passed, minimum submission time will reach in " + timeRemaining + "minutes.");
            }
            continue;
          }

          case ClockEnum.BIOMETRIC_START_TIME: {
            if (moment(clock_detail.value).isAfter(currentTime)) {
              const timeRemaining = moment(clock_detail.value).diff(currentTime, "minutes");
              return res
                .status(400)
                .send("Biometric start time has not started yet, Biometric start time will starts in " + timeRemaining + "minutes.");
            }
            continue;
          }

          case ClockEnum.EXAMSTE_DOWNLOAD_TIME: {
            if (moment(clock_detail.value).isAfter(currentTime)) {
              const timeRemaining = moment(clock_detail.value).diff(currentTime, "minutes");
              return res
                .status(400)
                .send("Examste download time has not started yet, Examste download time will starts in " + timeRemaining + "minutes.");
            }
            continue;
          }

          case ClockEnum.EXAM_END_TIME: {
            if (moment(clock_detail.value).isBefore(currentTime)) {
              return res.status(400).send("Exam is Over.");
            }
            continue;
          }

          case ClockEnum.EXAM_START_TIME: {
            if (moment(clock_detail.value).isAfter(currentTime)) {
              const timeRemaining = moment(clock_detail.value).diff(currentTime, "minutes");
              return res
                .status(400)
                .send("Exam Start time has not started yet, Exam will start in " + timeRemaining + "minutes.");
            }
            continue;
          }

          case ClockEnum.GATE_CLOSING_TIME: {
            if (moment(clock_detail.value).isBefore(currentTime)) {
              return res
                .status(400)
                .send("Gate Closed");
            }
            continue;
          }

          case ClockEnum.LIVE_EXAM_START_TIME: {
            if (moment(clock_detail.value).isAfter(currentTime)) {
              const timeRemaining = moment(clock_detail.value).diff(currentTime, "minutes");
              return res
                .status(400)
                .send("Live exam time has not started yet, Live Exam will start in "+ timeRemaining + "minutes.");
            }
            continue;
          }

          case ClockEnum.LOGIN_TIME: {
            if (moment(clock_detail.value).isAfter(currentTime)) {
              const timeRemaining = moment(clock_detail.value).diff(currentTime, "minutes");
              return res.status(400).send("Login time has not started yet, Login start time will start in " + timeRemaining + "minutes.");
            }
            continue;
          }

          case ClockEnum.CANDIDATE_START_TIME: {
            if (moment(clock_detail.value).isAfter(currentTime)) {
              return res
                .status(400)
                .send("Candidate start time has not started yet.");
            }
            continue;
          }
          default: {
            return res.status(400).send("Invalid Clock")
          }
        }
      }

      next();

    } catch (error) {
      next(error);
    }
  };
}
