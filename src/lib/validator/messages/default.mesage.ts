import { JoiUtils } from "../../../util/joi.utils";

export class DefaultMessage {
    static defaultRequired(variableName: string){
        return {
            'string.empty': JoiUtils.requiredMessage(variableName),
            'any.required':  JoiUtils.requiredMessage(variableName)
        }
    }
}