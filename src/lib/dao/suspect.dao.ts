import { SuspectModel } from "../../models/suspected.model";

export class SuspectDao {
  static async create(mappingId: any, studentId: any, reason: any) {
    return await SuspectModel.create({
      mappingId: mappingId,
      studentId: studentId,
      reason: reason,
    });
  }

  static async get(skip: number, count: number, searchText: any) {

        let searchFilter: any = {};
        if (searchText) {
          searchFilter["$or"] = [
            { mappingId: { $regex: searchText, $options: "i" } },
            { studentId: { $regex: searchText, $options: "i" } },
            { reason: { $regex: searchText, $options: "i" } },
          ];
        }
        let result = await SuspectModel.aggregate([
          {
            $match: searchFilter,
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

  static async getAll(){
    return await SuspectModel.find()
  }

  static async getSuspect(mongo_id: any){
    return await SuspectModel.findOne({_id: mongo_id})
}

static async saveRecoveredSuspect(suspect: any){
    return await SuspectModel.create({
        _id: suspect._id,
        studentId: suspect.studentId,
        mappingId: suspect.mappingId,
        reason: suspect.reason,
        metaData: suspect.metaData,
        createdAt: suspect.createdAt,
        updatedAt: suspect.updatedAt
    })
}

}