import express from 'express';
import ExtraTime from '../../lib/dao/extratime.dao';
import LiveMappingDao from '../../lib/dao/liveMapping.dao';
import SettingsDao from '../../lib/dao/settings.dao';
import { SuspectDao } from '../../lib/dao/suspect.dao';
import LogModel from '../../models/Log.model';
import { CandidateService } from '../../services/candidate/candidateService';
import CandidateDeviceService from '../../services/candidateDevice/candidate-device.service';
import { ClockService } from '../../services/clock/clockService';

export default class NixSteController {
  static async getCandidates(
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

      const savedCandidates = await CandidateService.getCandidates(
        skip,
        count,
        searchText
      );
      if (!savedCandidates || savedCandidates.length == 0) {
        return res.status(404).send("Unable to find saved Candidates.");
      }
      let totalCount = savedCandidates.metadata.length
        ? savedCandidates.metadata[0].total
        : 0;
      let allCandidates = savedCandidates.data;
      const totalPages = Math.ceil(totalCount / count);

      return res.send({ allCandidates, totalPages });
    } catch (error) {
      next(error);
    }
  }

  static async getAllClocks(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const clocks = await ClockService.getAll();
      res.send(clocks);
    } catch (e) {
      next(e);
    }
  }

  static async getDevices(
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

      const devices = await CandidateDeviceService.getAllDevices(skip, count);
      if (!devices || devices.length == 0) {
        return res.status(404).send("Unable to find saved Candidates.");
      }
      let totalCount = devices.metadata.length ? devices.metadata[0].total : 0;
      let all_devices = devices.data;
      const totalPages = Math.ceil(totalCount / count);

      return res.send({ all_devices, totalPages });
    } catch (error) {
      next(error);
    }
  }

  static async getSuspects(
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

      const suspectedCandidates = await SuspectDao.get(skip, count, searchText);
      if (!suspectedCandidates || suspectedCandidates.length == 0) {
        return res.status(404).send("Unable to find Suspected Candidates.");
      }
      let totalCount = suspectedCandidates.metadata.length
        ? suspectedCandidates.metadata[0].total
        : 0;
      let suspects = suspectedCandidates.data;
      const totalPages = Math.ceil(totalCount / count);

      return res.send({ suspects, totalPages });
    } catch (e) {
      next(e);
    }
  }
  
  static async addClientUrl(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try{
      const {url} = req.body;
      const clientUrl = await SettingsDao.create(url, "client_url")
      res.send(clientUrl)

    }
    catch(e){
      next(e)
    }
  }

  static async getClientUrl(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try{
      const clientUrl = await SettingsDao.get("client_url")
      res.send(clientUrl)
    }
    catch(e){
      next(e)
    }
  }
  
  static async getAllLiveMappings(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try{
      const liveMappings = await LiveMappingDao.getAll();
      if(!liveMappings || liveMappings.length == 0){
        return res.status(404).send("No live mappings found.")
      }
      res.send(liveMappings)
    }
    catch(e){
      next(e)
    }
  }

  static async extraTimeGet(req: express.Request, res: express.Response, next: express.NextFunction){
    try{
      let time:any[];
      if(req.query.id){
        time = await ExtraTime.getAllById(req.query.id);
      }
      time = await ExtraTime.getAll();
      res.send(time);
    }
    catch(e){
      next(e)
    }
  }

  static async extraTimeAdd(req: express.Request, res: express.Response, next: express.NextFunction){
    try{
      let {time} = req.body;
      let givenTo = req.params.mappingId;

      const extraTime = await ExtraTime.alotExtraTime(givenTo, time, "admin-ste");
      
      res.send(extraTime);
    }
    catch(e){
      next(e)
    }
  }

  static async getLogs(req: express.Request, res: express.Response, next: express.NextFunction){
    try{
      let {startDate, endDate} = req.query;
      if(!startDate || !endDate) return res.status(400).send("Start Date and end date are mandatory");
      const logs = await LogModel.find({createdAt: {$gte: startDate, $lte: endDate}})
      res.send({logs});
    }
    catch(e){
      next(e)
    }
  }
}