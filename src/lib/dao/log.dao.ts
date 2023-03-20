import LogModel from "../../models/Log.model";

export class LogsDao{
    static async getAll(){
        return await LogModel.find()
    }

    static async getLog(mongo_id: any){
        return await LogModel.findOne({_id: mongo_id})
    }

    static async saveRecoveredLog(log: any){
        return await LogModel.create({
            _id: log._id,
            type: log.type,
            user: log.user,
            email: log.email,
            isLogin: log.tyisLoginpe,
            isActive: log.isActive,
            status: log.status,
            password: log.password,
            accessLevel : log.accessLevel,
            meta: log.meta,
            payload: log.payload,
            reqId: log.reqId,
            params: log.params,
            origin: log.origin,
            devInfo: log.devInfo,
            originalUrl: log.originalUrl,
            examMappingId: log.examMappingId,
            student: log.student,
            createdAt: log.createdAt,
            updatedAt: log.updatedAt
        })
    }
}