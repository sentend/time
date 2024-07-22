export default class ApiError extends Error {
    statusCode: number;
    userInfo?: string;

    constructor(message: string, statusCode = 500, userInfo?: any) {
        super(message);
        this.statusCode = statusCode;
        this.userInfo = userInfo;
    }
}
