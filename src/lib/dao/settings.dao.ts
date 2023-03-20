import { Settings } from "../../models/Settings.model";

export default class SettingsDao {
    static async create(value: any, label: string){
        await Settings.deleteMany({label});
        const settings = new Settings({value, label});
        return await settings.save();
    }

    static async get(label :string){
        return await Settings.findOne({label: label});
    }
}