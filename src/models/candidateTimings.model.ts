import { Schema, Document, model } from 'mongoose';
import LiveMappingModel from './LiveMapping.model';
import { QuestionsModel } from './questions.model';
import { StudentRegisteration } from './StudentRegisterations';

export interface CandidateTiming extends Document {
   studentId: any,
   student_id: any,
   loggedInAt: Date,
   lastSyncOn: Date,
   lastQuestionId: any,
   instructionReadAt: Date
   examStartedAt: Date,
   examId: string,
   shiftId: string,
   mappingId: string
}

const CandidateTimingSchema = new Schema<CandidateTiming>({
    studentId: String,
    student_id: {
        type: Schema.Types.ObjectId,
        ref: StudentRegisteration
    },
    loggedInAt: Date,
    lastSyncOn: Date,
    lastQuestionId: {
        type: Schema.Types.ObjectId,
        ref: QuestionsModel
    },
    instructionReadAt: Date,
    examStartedAt: Date,
    examId: String,
    shiftId: String,
    mappingId: {
        type: Schema.Types.ObjectId,
        ref: LiveMappingModel
   }
}, {
    collection: 'candidateTimings',
    versionKey: false, 
    timestamps: true
});


export default model<CandidateTiming>('candidateTimings', CandidateTimingSchema);
