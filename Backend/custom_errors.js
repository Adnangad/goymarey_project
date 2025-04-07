class CustomError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = "CustomError";
        this.statusCode = statusCode;
    }
}
export default CustomError