import { Schema, Document, model } from 'mongoose';
import { GenderEnum, RoleEnum, UserCategoryEnum, UserProfileStatusEnum } from '../lib/enums';
// import { IComputer } from './Computer.model';

export interface ISettings extends Document {
  value: any,
  label: string
}

const SettingsSchema = new Schema<ISettings>({
    value: Schema.Types.Mixed,
    label: String
}, {
    collection: 'settings',
    versionKey: false,
    timestamps: true
});

export const Settings = model<ISettings>('settings', SettingsSchema);
