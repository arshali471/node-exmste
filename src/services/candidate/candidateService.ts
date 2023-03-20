import StudentRegisterationDao from "../../lib/dao/studentRegistration.dao";

export class CandidateService{
    
    static async getCandidateByApplicationNo(applicationNumber: string){
        return await StudentRegisterationDao.getCandidateByApplicationNo(applicationNumber)
    }

    static async getCandidateBy_id(_id: string){
        return await StudentRegisterationDao.getBy_id(_id)
    }

    static async getCandidates(skip: number, count: number, searchText: any){
        return await StudentRegisterationDao.getAllStudents(skip, count, searchText)
    }

    static async getCandidateByRegNo(regNo: string){
        return await StudentRegisterationDao.getCandidateByRegNo(regNo)
    }

}