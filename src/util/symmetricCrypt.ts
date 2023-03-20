import crypto from 'crypto';

export class SymmetricCrypt {
    static generateCipherData(data: string, key?: any) {

        if (!key) {
            key = (crypto.randomBytes(32)).toString('hex').slice(0, 32);
        }

        const iv = (crypto.randomBytes(16)).toString('hex').slice(0, 16);

        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

        let encryptedData = cipher.update(data, 'utf8', 'hex');

        encryptedData += cipher.final("hex");

        return {
            encryptedData: iv + ':' + encryptedData,
            key: key
        }

    }

    static decipherData(encryptedData: string, key: any) {

        const splitData = encryptedData.split(':');
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, splitData[0]);

        let decryptedData = decipher.update(splitData[1], "hex", "utf-8");

        decryptedData += decipher.final("utf8");

        return decryptedData;
    }

    static createKey(){
        return (crypto.randomBytes(32)).toString('hex').slice(0, 32);
    }
}