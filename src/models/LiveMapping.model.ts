import { Schema, Document, model } from 'mongoose';
import { CryptoHelper } from '../helper/cryptoHelper';
import { QuestionsModel } from './questions.model';
import { StudentRegisteration } from './StudentRegisterations';



export interface IQuestionPaper extends Document {
    sectionId: string,
    sectionName: string,
    questions: any[], //question ids only
}


export interface ILiveMapping extends Document {
    student: string,
    student_id: any,
    examId: string,
    shiftId: string,
    timeAlloted: number,
    questionPaper: IQuestionPaper[],
    timeRemaining: number,
    lastLoginTime: Date,
    loginAttempts: number,
    isOnline: boolean, //From Socket
    socketId: string,
    blocked: boolean,
    key: string // Encryption Key
    publicKey: string // Encryption Key RSA
    isSubmitted: boolean
}


const LiveMappingSchema = new Schema<ILiveMapping>({
    student: String,
    student_id: {
        type: Schema.Types.ObjectId,
        ref: StudentRegisteration
    },
    examId: String,
    shiftId: String,
    timeAlloted: Number,
    questionPaper: [{
        sectionId: String,
        sectionName: String,
        questions: [{
            type: Schema.Types.ObjectId,
            ref: QuestionsModel
        }]
    }],
    timeRemaining: Number,
    lastLoginTime: Date,
    loginAttempts: {
        type: Number,
        default: 0
    },
    isOnline: Boolean,
    socketId: String,
    blocked: {
        type: Boolean,
        default: false
    },
    key: {type: String},
    publicKey: {type: String},
    isSubmitted: { type: Boolean, default: false }
}, {
    collection: 'livemapping',
    timestamps: true,
    versionKey: false
});


export default model<ILiveMapping>('livemapping', LiveMappingSchema);
