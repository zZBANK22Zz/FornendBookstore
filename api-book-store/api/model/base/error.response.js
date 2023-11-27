const baseResponse = require('./base.response')

const ErrorResponse = function (data) {
    this.code = data.code
    this.message = data.message
}

ErrorResponse.getBadRequest = function(message) {
    return {
        status: false,
        code: baseResponse.BAD_REQUEST.CODE,
        message: message || baseResponse.BAD_REQUEST.MESSAGE
    }
}

ErrorResponse.getUnauthorized = function(message) {
    return {
        status: false,
        code: baseResponse.UNAUTHORIZED.CODE,
        message: message || baseResponse.UNAUTHORIZED.MESSAGE
    }
}

ErrorResponse.getNotFound = function(message) {
    return {
        status: false,
        code: baseResponse.NOT_FOUND.CODE,
        message: message || baseResponse.NOT_FOUND.MESSAGE
    }
}

ErrorResponse.getServerError = function(message) {
    return {
        status: false,
        code: baseResponse.SERVER_ERROR.CODE,
        message: message || baseResponse.SERVER_ERROR.MESSAGE
    }
}

ErrorResponse.getCustomError = function(code, message) {
    return {
        status: false,
        code: code,
        message: message
    }
}

module.exports = ErrorResponse