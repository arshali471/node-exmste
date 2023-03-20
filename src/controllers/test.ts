import { DB } from "../config/DB";
// import { Computer } from "../models/Computer.model"
import crypto from 'crypto';

async function main() {
    let key = (crypto.randomBytes(32)).toString('hex').slice(0, 32);
    console.log(key, 'key');

}

main()