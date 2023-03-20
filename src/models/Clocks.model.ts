import { Schema, Document, model } from 'mongoose';

export interface IClock extends Document {
    label: string,
    value: any
}

const ClockSchema = new Schema<IClock>({
   label: String,
   value: Schema.Types.Mixed

}, {
    collection: 'clocks',
    versionKey: false, 
    timestamps: true
});


export const ClocksModel = model<IClock>('clocks', ClockSchema);

