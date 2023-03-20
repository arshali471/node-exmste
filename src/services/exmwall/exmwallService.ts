import axios, { AxiosRequestConfig, Method } from "axios";
import fs from "fs";
import { CONFIG } from "../../config/environment";
import { throwError } from "../../util";

export class ExmwallService {
    static async makeRequest(url: string, method: Method, inputPayload?: any, queryData?: any) {
        let apikey = fs.readFileSync(CONFIG.configApi).toString()

        // Default request config
        let requestConfig: AxiosRequestConfig = {
            baseURL: fs.readFileSync(CONFIG.configUrl).toString(),
            url: url,
            method: method,
            headers: {
                'apikey': apikey,
                'url': "localhost",

            },
        };

        if (method !== 'get' && inputPayload) {
            requestConfig.data = inputPayload;
        }

        if (queryData) {
            requestConfig.params = queryData;
        }

        return await axios.request(requestConfig).then(res => {
            if(res.status == 200){
                return res.data
            }
            else{
                throwError(res.data, 500)
                return false
            }
        }).catch(err => {
            console.log(err)
            throwError(JSON.stringify(err), 500)
            return false
        })

    }

    static async makeBasicRequest(url: string, method: Method, inputPayload?: any, queryData?: any) {

        // Default request config
        let requestConfig: AxiosRequestConfig = {
            baseURL: fs.readFileSync(CONFIG.configUrl).toString(),
            url: url,
            method: method,
            headers: {
                'url': "localhost",
            },
        };

        console.log(requestConfig)
        if (method !== 'get' && inputPayload) {
            requestConfig.data = inputPayload;
        }

        if (queryData) {
            requestConfig.params = queryData;
        }

        return await axios.request(requestConfig)

    }

    static async seatAllotment(registereduser: any, candidateId: any){
        return await ExmwallService.makeRequest(`${CONFIG.exmwall.studentBioRegistered}/${candidateId}`, "POST", registereduser)
    }

    static async searchCandidate(search_text: string){
        return await ExmwallService.makeRequest(`${CONFIG.exmwall.searchCandidate + "?search=" +search_text}`, "GET")
    }
    
    static async getCandidateById(candidateId: string){
        return await ExmwallService.makeRequest(`${CONFIG.exmwall.getCandidate + "/" +candidateId}`, "GET")
    }

    static async getLabNodes(labId: string){
        return await ExmwallService.makeRequest(`${CONFIG.exmwall.getComputersByLabId + "/" +labId}`, "GET")
    }

    static async getQuestionData(url: string){
        let inputPayload = {url}
        return await ExmwallService.makeRequest(`${CONFIG.exmwall.getQuestionData }`, "POST", inputPayload)
    }

    static async getQuestionPaperKeys(){
        return await ExmwallService.makeRequest(`${CONFIG.exmwall.getQuestionPaperKeys }`, "GET")
    }

    static async getExamDetails(){
        return await ExmwallService.makeRequest(`${CONFIG.exmwall.getExamDetails }`, "GET")
    }

    static async getSectionsIds(){
        return await ExmwallService.makeRequest(`${CONFIG.exmwall.getSectionIds }`, "GET")
    }
    
    static async sendResponsesToExmwall(responses: any, lastUpdatedAt: any){
        const inputPayload = {responses, lastUpdatedAt}
        return await ExmwallService.makeRequest(`${CONFIG.exmwall.sendResponses }`, "POST", inputPayload)
    }
    
    static async sendLiveMappings(liveMappings: any){
        const inputPayload = {liveMappings} 
        return await ExmwallService.makeRequest(`${CONFIG.exmwall.sendLiveMappings }`, "POST", inputPayload)
    }
    
    static async sendCandidateDevices(candidateDevices: any){
        const inputPayload = {candidateDevices} 
        return await ExmwallService.makeRequest(`${CONFIG.exmwall.sendCandidateDevices }`, "POST", inputPayload)
    }
    
    static async sendCandidateTimings(candidateTimings: any){
        const inputPayload = {candidateTimings} 
        return await ExmwallService.makeRequest(`${CONFIG.exmwall.sendCandidateTimings }`, "POST", inputPayload)
    }
    
    static async sendExtraTimings(extraTimings: any){
        const inputPayload = {extraTimings} 
        return await ExmwallService.makeRequest(`${CONFIG.exmwall.sendExtraTimings }`, "POST", inputPayload)
    }
    
    static async sendLabDevices(labDevices: any){
        const inputPayload = {labDevices} 
        return await ExmwallService.makeRequest(`${CONFIG.exmwall.sendLabDevices }`, "POST", inputPayload)
    }
    
    static async sendLogs(logs: any){
        const inputPayload = {logs} 
        return await ExmwallService.makeRequest(`${CONFIG.exmwall.sendLogs }`, "POST", inputPayload)
    }
    
    static async sendSuspects(suspects: any){
        const inputPayload = {suspects} 
        return await ExmwallService.makeRequest(`${CONFIG.exmwall.sendSuspects }`, "POST", inputPayload)
    }
   
}