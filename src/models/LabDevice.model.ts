import { Schema, Document, model } from 'mongoose';

export interface ILabDevice extends Document {
  macAddress: string,
  ipAddress: string,
  appHash: string,
  computerId: string
  metaData?: any
}

const LabDeviceSchema = new Schema<ILabDevice>({
    macAddress: String,
    ipAddress: String,
    appHash: String,
    computerId: String,
    metaData: Schema.Types.Mixed

}, {
    collection: 'labDevice',
    versionKey: false,
    timestamps: true
});

export const LabDevice = model<ILabDevice>('labDevice', LabDeviceSchema);
