
import crypto from 'crypto';
import CryptoJS from 'crypto-js';

export class CryptoHelper {
    // static async generateCipherData(data: any, key?: any) {
    //     if (!key) {
    //         throw new Error("Key is required!")
    //     }

    //     const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    //     return {key: key, encryptedData: ciphertext };

    // }

    // static decipherEncryptedData(encryptedData: string, key: any) {

    //     let bytes = CryptoJS.AES.decrypt(encryptedData.toString(), key);
    //     let decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    //     return decryptedData ? JSON.parse(decryptedData) : undefined;
    
    // }

    static async createRandomKey() {
        const key = (crypto.randomBytes(32)).toString('hex').slice(0, 32);
        return key;
    }

    static async Encrypt(word:any, key: any) {
        let encJson = CryptoJS.AES.encrypt(JSON.stringify(word), key).toString()
        let encData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encJson))
        return {encryptedData: encData, key: key}
    }

    static async Decrypt(word:any, key: any) {
        let decData = CryptoJS.enc.Base64.parse(word).toString(CryptoJS.enc.Utf8)
        let bytes = CryptoJS.AES.decrypt(decData, key).toString(CryptoJS.enc.Utf8)
        return JSON.parse(bytes)
    }
}