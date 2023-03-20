export interface ISTE_User {
    uuid: string,
    id: number,
    username: string,
    password: string,
    center_id: string,
    exam_id: number,
    shift_id: number,
    is_online: boolean,
    is_block: boolean,
    status: string,
    incorrect_attempts: number,
    publicKey: string,
    lastLogin: Date,
    loginStartTime: Date,
    loginEndTime: Date,
    allowedBioRegUsers: number
}