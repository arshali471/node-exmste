import { Schema, Document, model } from 'mongoose';
import LiveMappingModel from './LiveMapping.model';

export interface IExtraTime extends Document {
    givenTo: any,
    givenBy: string,
    alloted: boolean,
    time: number
}

const ExtraTimeSchema = new Schema<IExtraTime>({
   givenTo: {
    type: Schema.Types.ObjectId,
    ref: LiveMappingModel
   },
   givenBy: String,
   alloted: {
    type: Boolean,
    default: false
   },
   time: Number
}, {
    collection: 'extratime',
    versionKey: false, 
    timestamps: true
});


export const ExtraTimeModal = model<IExtraTime>('extratime', ExtraTimeSchema);

