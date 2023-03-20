import { QuestionsModel } from "../../models/questions.model";

export class QuestionDao {
  static async getQuestionById(id: any) {
    return await QuestionsModel.findOne({ _id: id });
  }

  static async getLeanQuestionById(id: any) {
    return await QuestionsModel.findOne({ _id: id }).lean();
  }

  static async getAllExamShiftSectionQuestions(
    examId: string,
    shiftId: string,
    sectionId: string
  ) {
    return await QuestionsModel.find({ examId, shiftId }, "_id");
  }

  static async getQuestions(skip: number, count: number, searchText: any) {
    let searchFilter: any = {};
    if (searchText) {
      searchFilter["$or"] = [
        { examId: { $regex: searchText, $options: "i" } },
        { shiftId: { $regex: searchText, $options: "i" } },
        { _id: { $regex: searchText, $options: "i" } },
      ];
    }
    let result = await QuestionsModel.aggregate([
      {
        $match: searchFilter,
      },
      {
        $project: { _id: 1, examId: 1, shiftId: 1 },
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
}