import { CONFIG } from "../../config/environment";
import fs from 'fs';
import key_gen from "../../scripts/createEncKeyPair";
import { connectSocket } from "../../helper/socket.helper";
import SettingsDao from "../../lib/dao/settings.dao";
import { SettingsEnum } from "../../lib/enums/settings.enum";

export class StartupService {
    static async startup() {
        console.log(CONFIG.uploadsFolderPath, 'CONFIG.uploadsFolderPath');

        if (!fs.existsSync(CONFIG.uploadsFolderPath)) {
            fs.mkdir(CONFIG.uploadsFolderPath, () => {
                console.log('Uploads folder created');

                fs.mkdir(CONFIG.studentsFolderPath, () => {
                    console.log('Students folder created');
                });
            });
        } else {
            console.log('Uploads folders exists');
        }

        if (!fs.existsSync(CONFIG.questionDataFolderPath)) {
            fs.mkdir(CONFIG.questionDataFolderPath, () => {
                console.log('Question Data folder created');
            });
        } else {
            console.log('Question Data folder exists');
        }

        //check public_key .pem file exists or not
        if (!fs.existsSync(CONFIG.PUBLIC_KEY_PATH) || !fs.existsSync(CONFIG.PRIVATE_KEY_PATH)) {
            key_gen()
            console.log("Creating Key Pair")
        }
        else {
            console.log("Keys already exist! Skipping")
        }

        await SettingsDao.create(false, SettingsEnum.QUESTIONDOWNLOADTIME);
        await SettingsDao.create(false, SettingsEnum.QPKEYSDOWNLOADTIME);
        await SettingsDao.create(false, SettingsEnum.EXAMDETAILSDOWNLOADTIME);

        connectSocket()

    }
}