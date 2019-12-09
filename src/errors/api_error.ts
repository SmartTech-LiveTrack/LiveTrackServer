abstract class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.status = status;
    }

    abstract getErrors(): Array<any>;
}

export default ApiError;