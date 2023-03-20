import { Schema, Document, model } from 'mongoose';
import { BioRegUser } from './BioRegUser.model';
import { IAllotedSeat } from './StudentRegisterations';

export interface CandidateDevice extends Document {
    deviceId: string,
    cid: string,
    mac: string,
    alloted_by: any,
    studentId: string
    allowed: boolean,
    allotedSeat: IAllotedSeat
}

const CandidateDeviceSchema = new Schema<CandidateDevice>({
    deviceId: String,
    cid: String,
    mac: String,
    alloted_by: {
        type: Schema.Types.ObjectId,
        ref: BioRegUser
    },
    studentId: String,
    allowed: {
        type: Boolean,
        default: true
    },
    allotedSeat: {
        labId: String,
        computer_id: String,
        computer_mac: String,
        computer_ip: String,
        centerId: String
    }
}, {
    collection: 'candidateDevices',
    versionKey: false, 
    timestamps: true
});


export default model<CandidateDevice>('candidateDevices', CandidateDeviceSchema);
