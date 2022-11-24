const { version: appVersion } = require('../../../../package.json');

const version = `v.${appVersion}`;

const errorHandler = (err, req, res, next) => {
    const { message } = err;
    const { status } = err;
    let data;
    let errorResponse;

    switch (true) {
        case err.isJoi && !err.details:
        data = err.data;

        errorResponse = res.status(status || 400).json({
            version,
            status: false,
            message,
            data,
        });
        break;
    case (typeof err === 'string'):
        errorResponse = res.status(status || 400).json({
            version,
            status: false,
            message: err,
            data: err.data,
        });
        break;
    case (typeof err === 'object'):
        errorResponse = res.status(status || 400).json({
            version,
            status: false,
            message,
            data: err.data,
        });
        break;
        default:
        errorResponse = next(res);
    }

    return errorResponse;
};

module.exports = errorHandler;