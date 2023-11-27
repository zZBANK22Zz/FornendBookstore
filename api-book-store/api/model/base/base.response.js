module.exports = {
    SUCCESS: {
        CODE: 200,
        MESSAGE: ""
    },
    BAD_REQUEST: {
        CODE: 400,
        MESSAGE: "Bad Request"
    },
    UNAUTHORIZED: {
        CODE: 401,
        MESSAGE: "Unauthorized" //appkey not found or incorrect
    },
    NOT_FOUND: {
        CODE: 404,
        MESSAGE: "Not Found"
    },
    SERVER_ERROR: {
        CODE: 500,
        MESSAGE: "Internal Server Error"
    }
}