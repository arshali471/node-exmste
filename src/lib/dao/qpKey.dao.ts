import { QpKeyModel } from "../../models/QpKey.model";

export class QpKeyDao{
    static async updateKey(key: string, url: string){
        return await QpKeyModel.findOneAndUpdate({key: key}, {
            $set: {
                key: key,
                url: url
            }
        }, {new: true})
    }

    static async getKeyForUrl(imageUrl: string){
        return await QpKeyModel.findOne({url: imageUrl})
    }
    
    static async getExistingKey(key: string){
        return await QpKeyModel.findOne({key: key})
    }
}