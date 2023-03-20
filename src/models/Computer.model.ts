// import { Schema, Document, model } from 'mongoose';
// import { GenderEnum, RoleEnum, UserCategoryEnum, UserProfileStatusEnum } from '../lib/enums';
// import { ILab } from './Lab.model';
// import { IStudentRegisteration } from './StudentRegisterations';

// export interface IComputer extends Document {
//     allowed?: boolean,
//     cid?: string,
//     mac?: string,
//     isAlloted?: boolean,
//     student?: Schema.Types.ObjectId | IStudentRegisteration,
//     lab?: Schema.Types.ObjectId | ILab,
//     createdAt?: Date,
//     updatedAt?: Date

// }

// const ComputerSchema = new Schema<IComputer>({
//     allowed: Boolean,
//     cid: String,
//     mac: String,
//     isAlloted: {
//         type: Boolean,
//         default: false
//     },
//     student: {
//         type: Schema.Types.ObjectId,
//         ref: 'studentRegisterations'
//     },
//     lab: {
//         type: Schema.Types.ObjectId,
//         ref: 'lab'
//     },
//     createdAt: Date,
//     updatedAt: Date

// }, {
//     collection: 'computer',
//     versionKey: false
// });

// export const Computer = model<IComputer>('computer', ComputerSchema);
