import { StudentRegisteration } from "../../models/StudentRegisterations";
import { removeUndefinedObjects } from "../../util";

export default class StudentRegisterationDao {
    static async getBy_id(_id: string) {
        return await StudentRegisteration.findOne({ _id });
    }

    static async create(payload: any) {
        return await StudentRegisteration.create(payload);
    }

    static async getAllAllocatedNodes() {
        return await StudentRegisteration.find({}, 'allotedSeat');
    }

    static async getCandidateById(studentid: any) {
        return await StudentRegisteration.findOne({ studentid });
    }

    static async getCandidateByRegNo(regno: any){
        return await StudentRegisteration.findOne({regno: regno});
    }

    static async getCandidateByApplicationNo(applicationNumber: any) {
        return await StudentRegisteration.findOne({ application_number: applicationNumber });
    }


    static async getAllStudents(skip: number, count: number, searchText: any) {

        let searchFilter: any = {};
        if (searchText) {
            searchFilter["$or"] = [
                { name: { $regex: searchText, $options: "i" } },
                { studentid: { $regex: searchText, $options: "i" } },
                { roll_no: { $regex: searchText, $options: "i" } },
                { application_number: { $regex: searchText, $options: "i" } },
            ];
        }
        let result = await StudentRegisteration.aggregate([
            {
                $match: searchFilter,
            },
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $skip: skip },
                        { $limit: Number(count) },
                    ],
                },
            },
        ]);
        return result[0];
    }

    static async updatePasswordOfCandidate(candidate: any, hash: any){
        return await StudentRegisteration.findOneAndUpdate({_id: candidate}, {
            $set: {
                password: hash
            }
        }, {new: true})
    }

    static async getCandidateDetails(candidate: any) {
        return await StudentRegisteration.findOne({ _id: candidate });
    }
    
    static async getStudentRegistration(candidate: any) {
        return await StudentRegisteration.findOne({ _id: candidate });
    }

    static async getRegisteredCandidates() {
        return await StudentRegisteration.find();
    }

    static async getRegisteredCandidate(studentId: any, regNo: any, examId: any, shiftId: any) {
        return await StudentRegisteration.findOne({studentid: studentId, regno: regNo, examId: examId, shiftId: shiftId});
    }
}