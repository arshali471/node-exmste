import { Schema, Document, model } from 'mongoose';
import LiveMappingModel from './LiveMapping.model';
import { StudentRegisteration } from './StudentRegisterations';
import { QuestionsModel } from "./questions.model";


export interface IResponse extends Document {
    examId: string,
    shiftId: string,
    selectedOption: string
    questionId: Schema.Types.ObjectId;
    markedForReview: boolean
    studentId: string
    student_id: Schema.Types.ObjectId;
    mappingId: Schema.Types.ObjectId;
}

const Responsechema = new Schema<IResponse>({
    examId: String,
    shiftId: String,
    selectedOption: String,
    questionId: {
        type: Schema.Types.ObjectId,
        ref: QuestionsModel
    },
    markedForReview: Boolean,
    studentId: {
        type: String
    },
    student_id: {
        type: Schema.Types.ObjectId,
        ref: StudentRegisteration
    },
    mappingId: {
        type: Schema.Types.ObjectId,
        ref: LiveMappingModel
    }

}, {
    collection: 'responses',
    versionKey: false, 
    timestamps: true
});


export const ResponseModel = model<IResponse>('responses', Responsechema);



// [
//     {
//         # for choice with text
//         optionId:4234234234,
//         value: "true"
//         child: "No Mumbai is not the capital"
//         flag: true
//     },
//     {
//         # for choice
//         optionId:4234234234,
//         value: "true"
//         # child: "No Mumbai is not the capital"
//         flag: false
//     }
// ]


// [
//     {
//         # for text
//         optionId:4234234234,
//         value: "ferfeferferffer"
//         flag: true
//     },
// ]