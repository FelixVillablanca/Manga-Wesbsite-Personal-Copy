
const { handleErrors } = require('../constant');

const errorStatusChecker = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

    switch (statusCode) {
        case handleErrors.VALIDATION_ERROR:
            res.json({
                title : "Validation Failed",
                message : err.message,
                stackTrace: err.stack
            })
            break;
        case handleErrors.UNAUTHORIZED:
            res.json({
                title : "Unauthorized",
                message : err.message,
                stackTrace: err.stack
            })
            break;
        case handleErrors.FORBIDDEN:
            res.json({
                title : "Forbidden",
                message : err.message,
                stackTrace : err.stack
            })
            break;
        case handleErrors.NOT_FOUND:
            res.json({
                title: "not found",
                message : err.message,
                stackTrace : err.stack
            })
            break;
        case handleErrors.SERVER_ERROR:
            res.json({
                title : "server error",
                message : err.message,
                stackTrace : err.stack
            })
            break;
        default:
            console.log(err);
            res.json({ title: "Error", message: err.message, stackTrace: err.stack });
            break;
    }
}

module.exports = errorStatusChecker
