import BioRegDao from "../../lib/dao/bioreg.dao";
import { LabDeviceDao } from "../../lib/dao/labDevice.dao";
import StudentRegisterationDao from "../../lib/dao/studentRegistration.dao";
import { Utility } from "../../util";

export default class BioRegService {
    static async createUsername(response_username: string) {
        for (let i = 0; ; i++) {
            let username = `BIO_${i + 1}@${response_username}.enixm`
            const checkIfExist = await BioRegDao.getUserByUserName(username);
            if (!checkIfExist) {
                return username;
            }
        }
    }

    static async getUserByUserName(username: string) {
        return await BioRegDao.getUserByUserName(username)
    }

    static async getBioUsers(){
        return await BioRegDao.getAll();
    }

    static async allocateNode(nodes: any[]) {
        // console.log(nodes)
        const all_alloc = await StudentRegisterationDao.getAllAllocatedNodes();
        const lab_nodes = await LabDeviceDao.getAllLabNodes()

        const lanscape_nodes_mac = nodes.map((node: any) => {
            return node.mac
        });

        const allotedSeat_mac = all_alloc.map((node: any) => {
            return node.allotedSeat.computer_mac
        });

       
        const lab_nodes_mac = lab_nodes.map((node: any) => {
            return node.macAddress
        });


        const remaining_nodes_mac = lab_nodes_mac.filter((node: any) => {
            return !allotedSeat_mac.includes(node)
        })

        if(!remaining_nodes_mac || remaining_nodes_mac.length <=0) return false


        const available_lanscape_nodes_mac = remaining_nodes_mac.filter((node: any) => {
            return lanscape_nodes_mac.includes(node);
        })

        if(!available_lanscape_nodes_mac || available_lanscape_nodes_mac.length <=0 ) return false
        
        const shuffled_nodes = Utility.shuffleArr(available_lanscape_nodes_mac);

        return nodes.find((node: any) => shuffled_nodes[0] === node.mac);
    }

    static async allocateSeat(node: any, student_details: any, photo: string, iris?: string, fingerPrint?: string) {
        const newAllocation = {
            name: student_details.name,
            studentid: student_details.studentId,
            shiftId: student_details.shiftId,
            roll_no: student_details.rollNo,
            fathername: student_details.fatherName,
            dob: student_details.dob,
            photo: student_details.photo,
            sign: student_details.sign,
            email: student_details.email,
            phone_number: student_details.phone,
            regno: student_details.regNo,
            sex: student_details.sex,
            category: student_details.category,
            application_number: student_details.applicationNumber,
            mode_of_exam: student_details.modeOfExam,
            phd: student_details.phd,
            examId: student_details.examId,
            allotedSeat: {
                labId: node.labId,
                computer_id: node.cid,
                computer_mac: node.mac,
                centerId: node.centerId,
            },
            bioRegistration: { iris: iris, photo: photo, fingerPrint: fingerPrint },
            extraTime: student_details.extraTime
        }

        return await StudentRegisterationDao.create(newAllocation);
    }

    static async getCandidateById(studentid: any){
        return await StudentRegisterationDao.getCandidateById(studentid);
    }
    
    static async updatePasswordOfBioUser(username: any, hash: any){
        return await BioRegDao.updatePasswordOfBioUser(username, hash);
    }

    static async updatePasswordOfCandidate(candidate: any, hash: any){
        return await StudentRegisterationDao.updatePasswordOfCandidate(candidate, hash);
    }
    
    static async getCandidateDetails(candidate: any){
        return await StudentRegisterationDao.getCandidateDetails(candidate);
    }
    
    static async getRegisteredCandidates(){
        return await StudentRegisterationDao.getRegisteredCandidates();
    }
}