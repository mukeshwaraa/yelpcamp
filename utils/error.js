class AppError extends Error{
    constructor(message = 'Error occured',status = 500){
        super();
        this.message = message;
        this.status = status;
    }
}


module.exports = AppError;