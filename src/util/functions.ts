export function throwError(message: string, statusCode: number) {
    let newError: any = new Error(message || 'Internal Server Error');
    newError['status'] = statusCode || 500;
    throw newError;
}

export function getEventName(username: string, eventName: string) {
    return `${username}_${eventName}`;
}

export function getRandomPassword() {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let string = '';
    for (let i = 0; i < 8; i++) {
        string += chars[Math.floor(Math.random() * chars.length)];
    }
    return string;

}

export function removeUndefinedObjects(object: any) {
    return JSON.parse(JSON.stringify(object))
}
