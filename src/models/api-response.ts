class ApiResponse<T> {
    private status: string;
    private message: string;
    private data: T;
    private errors: Array<any>;

    public static readonly SUCCESS_STATUS: string = "SUCCESS";
    public static readonly ERROR_STATUS: string = "ERROR";

    private constructor(status: string, message: string, 
        data: T, errors: Array<any>) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.errors = errors;
    }

    getStatus() {
        return this.status;
    }

    getMessage() {
        return this.message;
    }

    getData() {
        return this.data;
    }

    getErrors() {
        return this.errors;
    }

    static success<T>(data: T, message: string) {
        return new ApiResponse<T>(
            ApiResponse.SUCCESS_STATUS, message, data, []);
    }

    static error(message: string, errors: Array<any>) {
        return new ApiResponse(
            ApiResponse.ERROR_STATUS, message, null, errors);
    }
}

export default ApiResponse;