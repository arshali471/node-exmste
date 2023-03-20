import bcrypt from 'bcrypt';
import { CONFIG } from '../config/environment';
import jwt from 'jsonwebtoken';
import { ZipAFolder } from 'zip-a-folder';
import path from 'path';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890abcdef', 10);

export class Utility {
    static comparePasswordHash(hash: string, plainText: string) {
        return bcrypt.compareSync(plainText, hash);
    }

    static createPasswordHash(password: string) {
        let salt = bcrypt.genSaltSync(CONFIG.BCRYPT_SALT_ROUNDS);
        return bcrypt.hashSync(password, salt);
    }

    // Generate JWT token
    static generateJwtToken(userUUID: string, username: string) {
        return jwt.sign({
            id: userUUID,
            username: username
        },
            CONFIG.jwt.secret,
            { expiresIn: '1d' }
        );
    }

    static generateJwtTokenForCandidate(userUUID: string) {
        return jwt.sign({
            id: userUUID
        },
            CONFIG.jwt.secret,
            { expiresIn: '1d' }
        );
    }

    static generateJwtTokenForLiveCandidate(student_id: string, shiftId: string, computerId: string, mappingId: string) {
        return jwt.sign({
            student_id: student_id,
            shiftId: shiftId,
            cid: computerId,
            mappingId: mappingId
        },
            CONFIG.jwt.live_secret,
            { expiresIn: '1d' }
        );
    }

    

    static generateApiJwt(apikey: string) {
        return jwt.sign({
            apikey: apikey,
        },
            CONFIG.jwt.secret,
            { expiresIn: '1d' }
        );
    }

    // Create uploads folder zip
    static async zipFolder(folderPath: string) {
        let zipFilePath = path.join(CONFIG.uploadsFolderPath, '/students.zip');
        ZipAFolder.zip(folderPath, zipFilePath);
        return 'students.zip';
    }

    static getNanoId() {
        return nanoid();
    }

    static shuffleArr(array:string[]) {
        let currentIndex = array.length, randomIndex;
      
        while (currentIndex != 0) {
      
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
      }
}
