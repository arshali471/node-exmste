import { LabDevice } from "../../models/LabDevice.model";

export class LabDeviceDao {
  static async create(
    macAddress: string,
    ipAddress: string,
    appHash: string,
    cName: any
  ) {
    return await LabDevice.create({
      macAddress: macAddress,
      ipAddress: ipAddress,
      appHash: appHash,
      computerId: cName,
    });
  }

  static async get(skip: number, count: number, searchText: any) {
    let searchFilter: any = {};
    if (searchText) {
      searchFilter["$or"] = [
        { macAddress: { $regex: searchText, $options: "i" } },
        { ipAddress: { $regex: searchText, $options: "i" } },
        { computerId: { $regex: searchText, $options: "i" } },
      ];
    }
    let result = await LabDevice.aggregate([
      {
        $match: searchFilter,
      },
      {
        $unset: ["appHash"],
      },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: Number(count) }],
        },
      },
    ]);
    return result[0];
  }

  static async getAllLabNodes() {
    return await LabDevice.find();
  }

  static async getNodeBymac(mac: string) {
    return await LabDevice.findOne({macAddress: mac});
  }

  static async getLabDevice(mongo_id: any){
    return await LabDevice.findOne({_id: mongo_id})
}

static async saveRecoveredLabDevice(labDevice: any) {
    return await LabDevice.create( {
        _id: labDevice._id,
        macAddress: labDevice.macAddress,
        ipAddress: labDevice.ipAddress,
        appHash: labDevice.appHash,
        computerId: labDevice.computerId, 
        metaData: labDevice.metaData,
        createdAt: labDevice.createdAt,
        updatedAt: labDevice.updatedAt
    })
}
}