import { LabDeviceDao } from "../../lib/dao/labDevice.dao";

export class LabDeviceService {
  static async create(
    macAddress: any,
    ipAddress: any,
    appHash: any,
    cName: any
  ) {
    return await LabDeviceDao.create(macAddress, ipAddress, appHash, cName);
  }
  static  get(skip: number, count: number, searchText: any) {
    return  LabDeviceDao.get(skip, count, searchText);
  }
}