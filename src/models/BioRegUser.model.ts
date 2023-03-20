import { Schema, Document, model } from 'mongoose';
import { GenderEnum, RoleEnum, UserCategoryEnum, UserProfileStatusEnum } from '../lib/enums';

export interface IBioRegUser extends Document {
    username: string,
    password: string,
    isOnline: boolean,
    examId: string,
    shiftId: string,
    // createdAt?: Date,
    // updatedAt?: Date

}

const bioRegUserSchema = new Schema<IBioRegUser>({
    username: String,
    password: String,
    examId: String,
    shiftId: String,
    isOnline: {
        type: Boolean,
        default: false,
    },
    // createdAt: Date,
    // updatedAt: Date

}, {
    collection: 'bioRegUser',
    versionKey: false,
    timestamps: true
});

export const BioRegUser = model<IBioRegUser>('bioRegUser', bioRegUserSchema);
