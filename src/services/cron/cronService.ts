import { ResponseDao } from "../../lib/dao/response.dao";
import { ExmwallService } from "../exmwall/exmwallService";
import fs from "fs";
import { CONFIG } from "../../config/environment";
import SettingsDao from "../../lib/dao/settings.dao";
import { SettingsEnum } from "../../lib/enums/settings.enum";
import LiveMappingDao from "../../lib/dao/liveMapping.dao";
import moment from "moment";
import { ClockDao } from "../../lib/dao/clock.dao";
import { WallSyncService } from "../wallSync/wallSyncService";
import { ClockEnum } from "../../lib/enums/clock.enum";
import CandidateDeviceDao from "../../lib/dao/candidate-device.dao";
import CandidateTimingDao from "../../lib/dao/candidateTimings.dao";
import ExtraTime from "../../lib/dao/extratime.dao";
import { LabDeviceDao } from "../../lib/dao/labDevice.dao";
import { LogsDao } from "../../lib/dao/log.dao";
import { SuspectDao } from "../../lib/dao/suspect.dao";

export class CronService{
    static async startCron(){
        if(!fs.existsSync(CONFIG.configApi)){
            console.log("No exmwall key exsits")
            return false
        }
        const apikey = fs.readFileSync(CONFIG.configApi).toString();
        if(apikey){
            let exmwallTime = new Date('2001-01-21T12:45:58.582Z');
            let currentTime = new Date();
            let exmwallLastUpdatedAt = await SettingsDao.get(SettingsEnum.EXMWALL_LAST_UPDATED_AT)
            if(exmwallLastUpdatedAt){
                exmwallTime = exmwallLastUpdatedAt.value;
            }
            const responsesAfterExmcldLastUpdated = await ResponseDao.getResponsesAfterExmwallLastUpdated(exmwallTime)
            const liveMappings = await LiveMappingDao.getAll()
            const candidateDevices = await CandidateDeviceDao.getAll();
            const candidateTimings = await CandidateTimingDao.getAll();
            const extraTimings = await ExtraTime.getAll();
            const labDevices = await LabDeviceDao.getAllLabNodes();
            const logs = await LogsDao.getAll();
            const suspects = await SuspectDao.getAll();

            responsesAfterExmcldLastUpdated && responsesAfterExmcldLastUpdated.length > 0 && await ExmwallService.sendResponsesToExmwall(responsesAfterExmcldLastUpdated, exmwallLastUpdatedAt);
            liveMappings && liveMappings.length> 0 && await ExmwallService.sendLiveMappings(liveMappings);
            candidateDevices && candidateDevices.length > 0 && await ExmwallService.sendCandidateDevices(candidateDevices);
            candidateTimings && candidateTimings.length > 0 && await ExmwallService.sendCandidateTimings(candidateTimings);
            extraTimings && extraTimings.length> 0 && await ExmwallService.sendExtraTimings(extraTimings);
            labDevices && labDevices.length > 0 && await ExmwallService.sendLabDevices(labDevices);
            logs && logs.length > 0 && await ExmwallService.sendLogs(logs);
            suspects && suspects.length > 0 && await ExmwallService.sendSuspects(suspects);

            const lastUpdatedAt = await SettingsDao.create(currentTime.toISOString(), SettingsEnum.EXMWALL_LAST_UPDATED_AT)

            return true
             
        }
    }

    static async createTimeCron(){
        console.log("Trying to fetch data")

        const questionDownloadTime = await SettingsDao.get(SettingsEnum.QUESTIONDOWNLOADTIME);
        if(!questionDownloadTime || questionDownloadTime?.value != true){
            const qpDeliveryTime = await ClockDao.get(ClockEnum.EXAMSTE_DOWNLOAD_TIME);
            if(qpDeliveryTime){
                if(moment(qpDeliveryTime.value).isBefore(moment())){
                    await WallSyncService.downloadQuestions();
                    await SettingsDao.create(true, SettingsEnum.QUESTIONDOWNLOADTIME);
                    console.log("exmste data downloaded with qp")
                }
            }
            else{
                console.log("no setting found for question download time.")
            }
        }

        const qpKeyDownloadTime = await SettingsDao.get(SettingsEnum.QPKEYSDOWNLOADTIME);
        if(!qpKeyDownloadTime || qpKeyDownloadTime?.value != true){
            const qpKeyDeliveryTime = await ClockDao.get(ClockEnum.QP_DELIVERY_TIME);
            if(qpKeyDeliveryTime){
                if(moment(qpKeyDeliveryTime.value).isBefore(moment())){
                    await WallSyncService.downloadQuestionPaperKeys();
                    await SettingsDao.create(true, SettingsEnum.QPKEYSDOWNLOADTIME);
                    console.log("qpkeys downloaded")
                }
            }
            else{
                console.log("no setting found for qp key download time.")
            }
        }

        const downloadExamDetailsTime = await SettingsDao.get(SettingsEnum.EXAMDETAILSDOWNLOADTIME);
        if(!downloadExamDetailsTime || downloadExamDetailsTime?.value != true){
            const examStartTime = await ClockDao.get(ClockEnum.EXAMSTE_DOWNLOAD_TIME);
            if(examStartTime){
                if(moment(examStartTime.value).isBefore(moment())){
                    await WallSyncService.downloadExamDetails();
                    await SettingsDao.create(true, SettingsEnum.EXAMDETAILSDOWNLOADTIME);
                    console.log("exmste data downloaded")
                }
            }
            else{
                console.log("no setting found for exam details download time.")
            }
        }

    }
}