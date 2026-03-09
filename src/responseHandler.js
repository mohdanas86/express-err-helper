function responseHandler(req, res, next) {
    res.success = function (data, message = "success") {
        res.status(200).json({
            success: true,
            message,
            data,
        });
    };

    res.error = function (message = "Error", status = 500) {
        res.status(status).json({
            success: false,
            message,
        });
    };

    next();
}

export default responseHandler;
