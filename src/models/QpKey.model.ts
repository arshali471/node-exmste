import { Schema, Document, model } from 'mongoose';

export interface IKey extends Document {
    url: string,
    key: string
}

const QpKeySchema = new Schema<IKey>({
   url: String,
   key: Schema.Types.Mixed

}, {
    collection: 'qpKeys',
    versionKey: false, 
    timestamps: true
});


export const QpKeyModel = model<IKey>('qpKeys', QpKeySchema);

