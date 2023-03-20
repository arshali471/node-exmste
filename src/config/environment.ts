import * as dotenv from "dotenv";
dotenv.config();
import path from 'path';

export const CONFIG = {
    PORT: process.env.PORT || 3006,
    BASE_URL: 'http://localhost:3006',
    UPLOADS_BASE_PATHL: 'http://localhost:3006/uploads',
    STUDENT_BASE_PATHL: 'http://localhost:3006/uploads/students',
    NODE_ENV: process.env.NODE_ENV,
    DB_CONNECTION_STRING: process.env.DB_STRING,
    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS) : 10,
    SYMETRIC_KEY: process.env.SYMETRIC_KEY,
    PUBLIC_KEY_PATH: path.join(__dirname, '../../public_key.pem'),
    PRIVATE_KEY_PATH: path.join(__dirname, '../../private_key.pem'),
    jwt: {
        secret: process.env.JWT_SECRET || 'SDKFJ9#R3IO90U3@#9DSFIN',
        live_secret: process.env.JWT_LIVE_SECRET || 'SDKFJ9#64454564e@#9DSFIN',
        options: {
            // audience: 'https://example.io',
            expiresIn: '12h', // 1d
            // issuer: 'example.io'
        },
        cookie: {
            httpOnly: true,
            sameSite: true,
            signed: true,
            secure: true
        }
    },
    cookie: {
        secret: "@#$@#4knshdf82#9382yrknjef9@#$"
    },
    exmwall:{
        login: "/exmste/login",
        getCurrentProfile: "/exmcld/getCurrentProfile",
        getCandidates: "/exmste/getCandidates",
        studentBioRegistered: "/exmste/studentBioRegistered",
        searchCandidate: "/exmste/candidate/search",
        getCandidate: "/exmste/candidate",
        getComputers: "/exmste/computers/get",
        getComputersByLabId: "/exmste/computers/getByLab",
        getQuestions: "/exmste/questions",
        getQuestionData: "/exmste/getQuestionData",
        getQuestionPaperKeys: "/exmste/qp/keys",
        getExamDetails: "/exmste/examDetails",
        sendResponses: "/exmste/saveResponse",
        getSectionIds: "/exmste/sectionIds",
        sendLiveMappings: "/exmste/saveLiveMappings",
        sendCandidateDevices: "/exmste/saveCandidateDevices",
        sendCandidateTimings: "/exmste/saveCandidateTimings",
        sendExtraTimings: "/exmste/saveExtraTimings",
        sendLabDevices: "/exmste/saveLabDevices",
        sendLogs: "/exmste/saveLogs",
        sendSuspects: "/exmste/saveSuspects",
        recoverData: "/exmste/recoverData"
    },
    uploadsFolderPath: path.resolve(__dirname, '../../uploads'),
    questionDataFolderPath: path.resolve(__dirname, '../../.questionData'),
    studentsFolderPath: path.resolve(__dirname, '../../uploads/students'),
    mailFrom: "",
    adminEmail: "",
    mailCredential: {
        service: "gmail",
        auth: {
            user: "",
            pass: ""
        },
        tls: {
            "rejectUnauthorized": false
        }

    },
    configApi: path.join(__dirname, '../../.exmwall.key'),
    configUrl: path.join(__dirname, '../../.exmwall.url'),
    socketUrl: path.join(__dirname, '../../.exmwall.soc.url'),
    configApiVersion: "/api/v1"
}