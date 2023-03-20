// import { Schema, Document, model } from 'mongoose';
// import { GenderEnum, RoleEnum, UserCategoryEnum, UserProfileStatusEnum } from '../lib/enums';
// import { IComputer } from './Computer.model';

// export interface ILab extends Document {
//     allowed: boolean,
//     labName: string,
//     numberOfNodes: number,
//     computerIds: Schema.Types.ObjectId[] | IComputer[]
//     availableNodes: number,
//     createdAt?: Date,
//     updatedAt?: Date

// }

// const LabSchema = new Schema<ILab>({
//     allowed: Boolean,
//     labName: String,
//     numberOfNodes: Number,
//     computerIds: [{
//         type: Schema.Types.ObjectId,
//         ref: 'computer'
//     }],
//     availableNodes: {
//         type: Number,
//         min: 0
//     },
//     createdAt: Date,
//     updatedAt: Date

// }, {
//     collection: 'lab',
//     versionKey: false
// });

// export const Lab = model<ILab>('lab', LabSchema);
