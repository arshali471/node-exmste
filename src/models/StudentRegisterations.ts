import { Schema, Document, model } from 'mongoose';
import { GenderEnum, RoleEnum, UserCategoryEnum, UserProfileStatusEnum } from '../lib/enums';

export interface IStudentRegisteration extends Document {
    name: string,
    studentid: string,
    shiftId: string,
    examId: string
    roll_no: string,
    fathername: string,
    dob: string,
    photo: string,
    sign: string,
    email: string,
    phone_number: string,
    regno: string,
    sex: string,
    category: string,
    application_number: string,
    mode_of_exam: string,
    phd: string,
    allotedSeat: IAllotedSeat,
    previousAllotedSeat: IAllotedSeat[],
    createdAt?: Date,
    updatedAt?: Date
    bioRegistration: {iris?: string, photo: string, fingerPrint?: string}
    extraTime: number,
    password: string
}

export interface IAllotedSeat extends Document {
    labId: string,
    computer_id: string,
    computer_mac: string,
    computer_ip: string,
    centerId: string
}

const studentRegisterationSchema = new Schema<IStudentRegisteration>({
    name: String,
    studentid: String,
    shiftId: String,
    examId: String,
    roll_no: String,
    fathername: String,
    dob: String,
    photo: String,
    sign: String,
    email: String,
    phone_number: String,
    regno: String,
    sex: String,
    category: String,
    application_number: String,
    mode_of_exam: String,
    phd: String,
    allotedSeat: {
        labId: String,
        computer_id: String,
        computer_mac: String,
        computer_ip: String,
        centerId: String
    },
    previousAllotedSeat: [{
        labId: String,
        computer_id: String,
        computer_mac: String,
        computer_ip: String,
        centerId: String
    }],
    bioRegistration:{
        iris: String,
        photo: String,
        fingerPrint: String
    },
    extraTime: {
        type: Number,
        default: 0
    },
    password: String,
    createdAt: Date,
    updatedAt: Date

}, {
    collection: 'studentRegisterations',
    versionKey: false,
    timestamps: true
});

studentRegisterationSchema.index({
    name: 'text',
    regno: 'text',
    roll_no: 'text',
},
    {
        weights:
        {
            name: 5,
            roll_no: 3,
            regno: 2,
        }
    });

export const StudentRegisteration = model<IStudentRegisteration>('studentRegisterations', studentRegisterationSchema);
