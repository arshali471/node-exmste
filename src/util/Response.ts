export class CustomResponse {
    data: object;
    message: string;
    status: number;
    constructor(data: object, message: string, status?: number) {
        this.data = data;
        this.message = message || 'Operation completed successfully';
        this.status = status || 200;
    }
}