import * as dotenv from 'dotenv';
dotenv.config();

export const apiURLs = {
    // EXMCLD
    baseUrl: process.env.EXMCLD_BASEURL,
    login: '/examste/login',
    getCurrentProfile: '/examste/getCurrentProfile',
    resetBioRegCount: '/examste/resetBioRegCount',
    addBioRegUsersCount: '/examste/addBioRegUsersCount',
    getStudentRegisterations: '/examste/getStudentRegisterations',
    getCenterById: '/examste/getCenterById',
    getQuestionPaperForExamShift: '/examste/getQuestionPaperForExamShift',

    // Socket
    socket: {
        EXMCLD_BASEURL: 'http://localhost:3100',
        CLD_HOOK: '/cld-hook'

    }
}
//
