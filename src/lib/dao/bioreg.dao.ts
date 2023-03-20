import { BioRegUser } from "../../models";

export default class BioRegDao {
    static async getUserByUserName(response_username: string) {
        return await BioRegUser.findOne({ username: response_username });
    }

    static async getAll(){
        return await BioRegUser.find();
    }

    static async updatePasswordOfBioUser(username: any, hash: any) {
        return await BioRegUser.findOneAndUpdate({ username : username }, {
            $set: {
                password: hash
            }
        }, {new: true});
    }
}