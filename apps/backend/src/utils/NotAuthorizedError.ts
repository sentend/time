import ApiError from "./ApiError";

export default class NotAuthorizedError extends ApiError {
    constructor(message?: string) {
        super(message || "NotAuthorized");
        this.statusCode = 401;
    }
}
