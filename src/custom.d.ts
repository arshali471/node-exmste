import { IAdmin, IBioRegUser } from "./models";
import { ILiveMapping } from "./models/LiveMapping.model";
import { IStudentRegisteration } from "./models/StudentRegisterations";
declare global {
    namespace Express {
        export interface Request {
            user: IStudentRegisteration,
            admin: IAdmin,
            live_user: ILiveMapping,
            bioUser: IBioRegUser
        }
    }
}