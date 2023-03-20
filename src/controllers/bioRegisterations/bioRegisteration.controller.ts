import { NextFunction, Request, Response } from "express";
import { getRandomPassword, throwError, Utility } from "../../util";
import { CustomResponse } from "../../util/Response";
import { BioRegUser } from "../../models";
import { ExmwallService } from "../../services/exmwall/exmwallService";
import { CONFIG } from "../../config/environment";
import BioRegService from "../../services/bioreg/bioreg.service";
import moment from "moment";
import CandidateDeviceService from "../../services/candidateDevice/candidate-device.service";
import { LabDeviceDao } from "../../lib/dao/labDevice.dao";
import StudentRegisterationDao from "../../lib/dao/studentRegistration.dao";

export class BioRegController {

    static async createBioUsers(req: Request, res: Response, next: NextFunction) {
        try {

            // Call EXMCLD for login
            // let apikey = req.body.apikey;
            // let inputPayload = {apikey}
            let response = await ExmwallService.makeRequest(CONFIG.exmwall.getCurrentProfile, "GET")
            if (!response || !response.allowedBioRegUsers) {
                return res.status(400).send("You are not allowed to create Bio Registeration User");
            }
            let users = [];
            // let userToInsert = {};
            // create users

            const checkIfExist = await BioRegUser.find({
                examId: response.examUUID,
                shiftId: response.shift_id
            }).count();
            if (checkIfExist >= response.allowedBioRegUsers) {
                return res.send("You have already created all the users")
            }


            for (let index = 0; index < response.allowedBioRegUsers - checkIfExist; index++) {

                // generate Random Username
                const username = await BioRegService.createUsername(response.username);

                // users.push({usrname: username})
                let password = getRandomPassword()
                let hash = Utility.createPasswordHash(password);
                let userToInsert = {
                    username: username,
                    password: hash,
                    isOnline: false,
                    examId: response.examUUID,
                    shiftId: response.shift_id
                }
                await BioRegUser.create(userToInsert)

                users.push({
                    username: username,
                    password: password,
                })

            }
            // await BioRegUser.insertMany(usersToInsert)
            res.send(new CustomResponse(users, "Bio Registeration Users Created Successfully", 200))

        } catch (error) {
            next(error)
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            let userName = req.body.userName;

            let existingUserName = await BioRegService.getUserByUserName(userName)
            if (!existingUserName) {
                return res.status(404).send("User not found.")
            }
            let password = req.body.password;

            if (!Utility.comparePasswordHash(existingUserName.password, password)) {
                return res.status(400).send("Incorrect Password");
            }

            let token = Utility.generateJwtToken(existingUserName?._id, existingUserName.username);

            res.send({ user: existingUserName.username, token: token })

        }
        catch (error) {
            next(error)
        }
    }

    static async searchCandidate(req: Request, res: Response, next: NextFunction) {
        try {
            let search_query: any = req.query.search;
            if (!search_query) {
                return res.status(400).send("Enter text to search")
            }
            let users = await ExmwallService.searchCandidate(search_query)
            res.send(users);
        }
        catch (error) {
            next(error)
        }
    }

    static async getCandidateById(req: Request, res: Response, next: NextFunction) {
        try {
            let candidateId: any = req.params.candidateId;

            let candidate = await ExmwallService.getCandidateById(candidateId)
            if (!candidate) {
                return res.status(404).send("Candidate not found")
            }
            res.send(candidate);
        }
        catch (error) {
            next(error)
        }
    }

    static async registerCandidate(req: Request, res: Response, next: NextFunction) {
        try {
            const candidateId = req.params.candidateId;

            const candidate_details = await ExmwallService.getCandidateById(candidateId);

            if (!candidate_details) {
                return res.status(404).send("Candidate not found")
            }

            if (!candidate_details.labId) {
                return res.status(400).send("Candidate is not assigned to any lab Contact Admin - Firewall Team or Cloud Team")
            }

            const checkIfAllocated: any = await BioRegService.getCandidateById(candidateId);

            if (checkIfAllocated) {
                return res.status(400).send("Candidate is already allocated to a node")
            }

            const lab_nodes = await ExmwallService.getLabNodes(candidate_details.labId);

            if (!lab_nodes || lab_nodes.length === 0) {
                return res.status(404).send("No Nodes found for this lab Contact Admin - Firewall Team or Cloud Team");
            }

            const allocated_node = await BioRegService.allocateNode(lab_nodes);

            if(!allocated_node){
                return res.status(404).send("No more nodes available")
            }
            const user_allocation = await BioRegService.allocateSeat(allocated_node, candidate_details, req.body.photo, req.body.iris, req.body.fingerPrint);

            if (user_allocation) {
                const dobOfCandidate = new Date(candidate_details.dob);
                const dobDate = dobOfCandidate.toLocaleDateString('en-GB');
                const requiredDate = dobDate.split("/").join("")
                let password = Utility.createPasswordHash(requiredDate)
                user_allocation.password = password;
                user_allocation.save()
            }

            const lab_device = await LabDeviceDao.getNodeBymac(user_allocation.allotedSeat.computer_mac)

            const new_device = await CandidateDeviceService.create({
                computer_id: user_allocation.allotedSeat.computer_id,
                computer_mac: user_allocation.allotedSeat.computer_mac,
                alloted_by: req.bioUser._id,
                studentId: candidateId,
                labId: candidate_details.labId,
                centerId: candidate_details.centerId
            })

            res.send({user_allocation, new_device, lab_device});

        }
        catch (e) {
            next(e);
        }
    }


    static async reRegisterCandidate(req: Request, res: Response, next: NextFunction) {
        try {
            const candidateId = req.params.candidateId;

            const candidate_details = await ExmwallService.getCandidateById(candidateId);

            if (!candidate_details) {
                return res.status(404).send("Candidate not found")
            }

            if (!candidate_details.labId) {
                return res.status(400).send("Candidate is not assigned to any lab Contact Admin - Firewall Team or Cloud Team")
            }

            const currentAllocation = await BioRegService.getCandidateById(candidateId);

            if (!currentAllocation) {
                return res.status(400).send("Candidate is not registered")
            }

            const lab_nodes = await ExmwallService.getLabNodes(candidate_details.labId);

            if (!lab_nodes || lab_nodes.length === 0) {
                return res.status(404).send("No Nodes found for this lab Contact Admin - Firewall Team or Cloud Team");
            }

            const allocated_node = await BioRegService.allocateNode(lab_nodes);

            if(!allocated_node){
                return res.status(404).send("No more nodes available to allocate")
            }

            currentAllocation.previousAllotedSeat.push((currentAllocation.allotedSeat));
            currentAllocation.allotedSeat.labId = allocated_node.labId;
            currentAllocation.allotedSeat.computer_id = allocated_node.cid;
            currentAllocation.allotedSeat.computer_mac = allocated_node.mac;
            currentAllocation.allotedSeat.centerId = allocated_node.centerId;


            await currentAllocation.save();

            const new_device = await CandidateDeviceService.create({
                computer_id: currentAllocation.allotedSeat.computer_id,
                computer_mac: currentAllocation.allotedSeat.computer_mac,
                alloted_by: req.bioUser._id,
                studentId: candidateId,
                labId: candidate_details.labId,
                centerId: candidate_details.centerId
            })


            res.send({currentAllocation, new_device});

        }
        catch (e) {
            next(e);
        }
    }

    static async getBioUsers(req: Request, res: Response, next: NextFunction){
        try{
            const bio_users = await BioRegService.getBioUsers();
            res.send(bio_users)
        }
        catch(e){
            next(e)
        }
    }

    static async resetPasswordOfBioUser(req: Request, res: Response, next: NextFunction){
        try{
            let password = getRandomPassword()
            let hash = Utility.createPasswordHash(password)
            const bio_user = await BioRegService.updatePasswordOfBioUser(req.body.username, hash);
            if (!bio_user) {
                return res.status(404).send("Password not updated for " + req.body.username)
            }
            res.send({bio_user: bio_user, password: password})
        }
        catch(e){
            next(e)
        }
    }

    static async resetPasswordOfCandidate(req: Request, res: Response, next: NextFunction){
        try{
            let password = getRandomPassword()
            let hash = Utility.createPasswordHash(password)
            const candidate = await BioRegService.updatePasswordOfCandidate(req.params.candidate, hash);
            if (!candidate) {
                return res.status(404).send("Password not updated for " + req.body.username)
            }
            res.send({candidate: candidate, password: password})
        }
        catch(e){
            next(e)
        }
    }
    
    static async getCandidateDetails(req: Request, res: Response, next: NextFunction){
        try{
            const candidate = await BioRegService.getCandidateDetails(req.params.candidate);
            if (!candidate) {
                return res.status(404).send("Candidate not found.")
            }
            res.send(candidate)
        }
        catch(e){
            next(e)
        }
    }

    static async getRegisteredCandidates(req: Request, res: Response, next: NextFunction){
        try{
            const registeredCandidates = await BioRegService.getRegisteredCandidates();
            if (!registeredCandidates) {
                return res.status(404).send("Registered Candidates not found.")
            }
            res.send(registeredCandidates)
        }
        catch(e){
            next(e)
        }
    }
    
    static async getNotRegisteredCandidates(req: Request, res: Response, next: NextFunction){
        try{
            const candidates: any = await ExmwallService.makeRequest(CONFIG.exmwall.getCandidates, "GET")
            let notRegisterdCandidates = [];
            for(let candidate of candidates){
                const registeredCandidate = await StudentRegisterationDao.getRegisteredCandidate(candidate.studentId, candidate.regNo, candidate.examId, candidate.shiftId);
                if(!registeredCandidate){
                    notRegisterdCandidates.push(candidate)
                }
            }
            res.send(notRegisterdCandidates)
        }
        catch(e){
            next(e)
        }
    }

}
