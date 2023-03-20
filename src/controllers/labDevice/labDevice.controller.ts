import express from "express";
import SettingsDao from "../../lib/dao/settings.dao";
import { SettingsEnum } from "../../lib/enums/settings.enum";
import { CronService } from "../../services/cron/cronService";
import { LabDeviceService } from "../../services/labDevice/labDevice.service";

export class LabDeviceController {
  static async create(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      let payload = req.body;
      let macAddress = payload.mac;
      let ipAddress = payload.ip_address;
      let appHash = payload.app_hash;
      let cName = payload.cname;
      if (!macAddress || !ipAddress || !appHash || !cName) {
        return res.status(404).send("Requirements of lab device info.");
      }
      const labDevice = await LabDeviceService.create(
        macAddress,
        ipAddress,
        appHash,
        cName
      );
      if (!labDevice) {
        return res.status(400).send("Unable to create lab device.");
      }

      const clientUrl = await SettingsDao.get(SettingsEnum.CLIENT_URL)
      res.send({labDevice: labDevice, url: clientUrl?.value});
    } catch (error) {
      next(error);
    }

  }
  static async get(
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

      const devices = await LabDeviceService.get(
        skip,
        count,
        searchText
      );
      if (!devices || devices.length == 0) {
        return res.status(404).send("Unable to find Suspected Candidates.");
      }
      let totalCount = devices.metadata.length
        ? devices.metadata[0].total
        : 0;
      let devicesDetail = devices.data;
      const totalPages = Math.ceil(totalCount / count);

      return res.send({ devicesDetail, totalPages });
    } catch (e) {
      next(e);
    }
  }

  static async checkServer(req: express.Request,
    res: express.Response,
    next: express.NextFunction){
    try{
      res.send("ok")
    }
    catch(error){
      next(error)
    }
  }
}

// ```{"platform": "Linux", "platform_release": "5.15.0-58-generic",
//  "platform_version": "#64~20.04.1-Ubuntu SMP Fri Jan 6 16:42:31 UTC 2023",
//   "architecture": "x86_64", "hostname": "arsh", "ip_address": "192.168.96.135", 
//   "mac": "1f:5a:ba:c5:65:0a", "processor": "Intel(R) Core(TM) i3-4000M CPU @ 2.40GHz", 
//   "ram": "11 GB", "number_of_core": "4", "app_hash": "46f95c04a5756879c28ca01ffa51f46fd3a610aedc12af5799107d1cc7fb4d71",
//  "screen_resolution": [1366, 768], "open_ports": [80, 3306]}```