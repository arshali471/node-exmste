import { io } from 'socket.io-client'
import { CONFIG } from '../config/environment';
import fs from "fs"


export const connectSocket = async () => {
    let token = undefined
    if (fs.existsSync(`${CONFIG.configApi}`)){
        token = fs.readFileSync(`${CONFIG.configApi}`).toString()
    }
    else{
      console.log("No wall key found")
      return false
    }
    const socket = io(`${fs.readFileSync(CONFIG.socketUrl).toString()}`, {
        auth: {
            token: token
        },
        rejectUnauthorized: false
      });
      console.log("Socket connected")
      socket.on("connect_error", (err) => {
        console.log(err.message); // prints the message associated with the error
      });
}