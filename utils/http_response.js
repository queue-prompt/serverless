


function success(jsonData, headers) {

    let _headers = headers || {}
    let _default = {
        statusCode: 200,
        body: JSON.stringify(
            jsonData || null,
            null,
            2
        ),
    };

    if (_headers.cache) {
        _default.headers = {
            "Cache-Control": `max-age=${headers.cache}`
        }
    }
    return _default
}

function serverError(statusCode, data) {
    return {
        statusCode: statusCode || 500,
        body: JSON.stringify(
            data || null,
            null,
            2
        ),
    };
}

function clientError(statusCode, data) {
    return {
        statusCode: statusCode || 400,
        body: JSON.stringify(
            data || null,
            null,
            2
        ),
    };
}

module.exports = {
    success,
    serverError,
    clientError,
}