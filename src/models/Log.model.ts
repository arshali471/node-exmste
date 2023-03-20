import { Schema, Document, model } from 'mongoose';
import { ObjectId } from 'mongoose';
import { LogEnum } from '../lib/enums/log.enum';


export interface ILog extends Document{
    type: LogEnum
    user: Schema.Types.ObjectId,
    email: string,
    isLogin: boolean,
    isActive: boolean,
    status: string,
    password: string,
    accessLevel : number,
    meta: string,
    payload: any,
    reqId: string
    params: string
    origin: string
    devInfo: string
    originalUrl: string
    examMappingId?: string
    student: string
}

const logSchema = new Schema <ILog>({
    type: {
        type: String,
        enum: LogEnum
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    accessLevel: {
        type: Number,//range 1 to 10
        default: 5, 
        min: 1, 
        max: 10

    },
    reqId: String,
    email: String,
    isLogin: {
        type: Boolean,
        default: false
    },
    status: {
        type: String
        
    },
    password: String,
    meta:String,
    payload: Schema.Types.Mixed,
    params: Schema.Types.Mixed,
    origin: String,
    devInfo: String,
    originalUrl: String,
    examMappingId: String,
    student: String,
}, {
    collection: 'log',
    versionKey: false,
    timestamps: true
})



export default model<ILog>('log', logSchema)