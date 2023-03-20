import dotenv from 'dotenv';
import { CONFIG } from '../config/environment';
dotenv.config();

const crypto = require("crypto")
const fs = require('fs');

const PUBLIC_KEY_PATH = CONFIG.PUBLIC_KEY_PATH;
const PRIVATE_KEY_PATH = CONFIG.PRIVATE_KEY_PATH;

export default function key_gen () {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        namedCurve: 'sect239k1',
        modulusLength: 2048,
        publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
    });
    
    // Write key in files
    fs.writeFileSync(PUBLIC_KEY_PATH, publicKey);
    fs.writeFileSync(PRIVATE_KEY_PATH, privateKey);
    
    console.log('------ Keys Generated ------');
    console.log('PUBLIC KEY: ', PUBLIC_KEY_PATH);
    console.log('PRIVATE KEY: ', PRIVATE_KEY_PATH);
}
