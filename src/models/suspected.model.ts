import { Schema, Document, model } from 'mongoose';

export interface ISuspect extends Document {
  studentId: string,
  mappingId: string,
  reason: string,
  metaData?: any
}

const SuspectSchema = new Schema<ISuspect>({
    studentId: String,
    mappingId: String,
    reason: String,
    metaData: Schema.Types.Mixed

}, {
    collection: 'suspects',
    versionKey: false,
    timestamps: true
});

export const SuspectModel = model<ISuspect>('suspects', SuspectSchema);
