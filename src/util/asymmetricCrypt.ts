import crypto from 'crypto';
import dotenv from 'dotenv';
import { CONFIG } from '../config/environment';
dotenv.config();

export class AsymmetricCrypt {

    static generateEncryptionKeys() {

        const crypto = require("crypto")
        const fs = require('fs');

        const PUBLIC_KEY_PATH = CONFIG.PUBLIC_KEY_PATH;
        const PRIVATE_KEY_PATH = CONFIG.PRIVATE_KEY_PATH;

        // Generate keys 
        // const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa',
        //     {
        //         modulusLength: 4096,
        //         namedCurve: 'secp256k1',
        //         publicKeyEncoding: {
        //             type: 'spki',
        //             format: 'pem'
        //         },
        //         privateKeyEncoding: {
        //             type: 'pkcs8',
        //             format: 'pem',
        //             cipher: 'aes-256-cbc',
        //             passphrase: process.env.PASSPHRASE || 'sdkfhi8732nkjsd7'
        //         }
        //     });

        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            namedCurve: 'sect239k1',
            modulusLength: 570,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        });

        // Write key in files
        fs.writeFileSync(PUBLIC_KEY_PATH, publicKey);
        fs.writeFileSync(PRIVATE_KEY_PATH, privateKey);

    }

    static publicEncrypt(publicKey: string, dataToEncrypt: any) {

        const encryptedData = crypto.publicEncrypt({
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_PADDING
        },
            Buffer.from(dataToEncrypt)
        ).toString('base64')
        return encryptedData;
    }

    static privateDecrypt(privateKey: string, toDecrypt: any) {

        const decryptedData = crypto.privateDecrypt(
            {
                key: privateKey.toString(),
                padding: crypto.constants.RSA_PKCS1_PADDING
            },
            Buffer.from(toDecrypt, 'base64')
        )
        return decryptedData;

    }

    static publicEncryptWithoutPadding(pk: string, data: any){
        const encryptedData = crypto.publicEncrypt(
            pk,
            Buffer.from(data, 'base64')
            ).toString('base64')
            return encryptedData;
    }

    static privateDecryptWithoutPadding(private_key: string, toDecrypt: any){
        const decryptedData = crypto.privateDecrypt(
            private_key,
            Buffer.from(toDecrypt, 'base64')
            ).toString('base64')
            return decryptedData;
    }
}
