import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { CONFIG } from "../../config/environment";
import fs from "fs";
import LiveMappingDao from "../../lib/dao/liveMapping.dao";
// import { ApikeyService } from "../apikey/apikeyService";

export class SocketService {
    static async authenticateSocket(socket: Socket, next: any) {
        if (socket.handshake.auth && socket.handshake.auth.token) {
            const token: any = socket.handshake.auth.token;

            const decoded = jwt.verify(token, CONFIG.jwt.live_secret) as any;

            const live_mapping = await LiveMappingDao.getLiveMappingByStudentId(decoded['student_id']);

            if(!live_mapping){
                next(new Error("Unable to connect socket User unavailable"));
                return false
            }

            live_mapping.isOnline = true;
            live_mapping.socketId = socket.id;

            await live_mapping.save();
            next();
        }
        else {
            next(new Error('Authentication error'));
        }
    }

    static async disconnectSocket(socketId: any){
        return await LiveMappingDao.disconnectSocket(socketId)
    }

    static async connectSocket(socketId: any){
        return await LiveMappingDao.connectSocket(socketId)
    }
}