import { Server } from "./server";
import http from 'http';
import { normalizePort, onError } from "./serverHandler";
import { CONFIG } from "./config/environment";
import schedule from 'node-schedule'
import { CronService } from "./services/cron/cronService";
import { Server as SocketServer, Socket } from "socket.io";
import { SocketService } from "./services/socket/socket.service";
import { EventsEnum } from "./lib/enums/socket";
import { StartupService } from "./services/startup/startup.service";

const SERVER = new Server();

const PORT = normalizePort(CONFIG.PORT);

SERVER.app.set('port', PORT);

let server = http.createServer(SERVER.app);

server.listen(PORT);

// server handlers
server.on("error", error => onError(error, PORT));

server.on("listening", async() => {
    const addr: any = server.address();
    const bind: string = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    schedule.scheduleJob("*/1 * * * * *", CronService.startCron);
    schedule.scheduleJob("*/1 * * * * *", CronService.createTimeCron);
    console.log(`Listening on ${bind}`);
});

const io = new SocketServer(server, { cors: { origin: '*'} })

io.use(SocketService.authenticateSocket)
  .on(EventsEnum.CONNECTION, async (socket) => {
    await SocketService.connectSocket(socket.id)
    console.log(socket.id, " connected")

    socket.on(EventsEnum.DISCONNECT, async function () {
        // await ExamSTEService.disconnectSocket(socket.id);
        await SocketService.disconnectSocket(socket.id)
        console.log(socket.id, " disconnected")

     });
});

StartupService.startup();
// Create uploads folder if not exists

