import { Schema, Document, model, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
// import { OptionTypeEnum, QuestionTypeEnum, RoleEnum } from '../lib/enums';
// import { LanguageEnum } from '../lib/enums/language.enum';
// import { SubjectModel } from './Subject.model';

export interface IQuestions extends Document {
    image: string,
    audio: string, 
    video: string,
    options: {
        value: string
    }[],
    topicId: string, 
    subjectId: string,
    attachments:string[],
    questionType: string,
    optionType: string,
    createdBy: any,
    examId?: string,
    shiftId: string
    language: string
    sectionId: string
}

const questionsSchema = new Schema<IQuestions>({
    image: {
        type: String, 
        default: ""
    },
    audio: String, 
    video: String, 
    attachments:[String],
    options: [{
        value: String,         
    }], 
    topicId: String,
    subjectId: String,
    self_uploaded: Boolean,
    sectionId: String,
    test: Boolean,
    shiftId: String,
    questionType: String,
    optionType: String,
    createdBy: String,
    examId: String,
    language: {
        type: String, 
    },
}, {
    collection: 'questions',
    versionKey: false, 
    timestamps: true
});

export const QuestionsModel = model<IQuestions>('questions', questionsSchema);
