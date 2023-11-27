const baseResponse = require('./base.response')

const SuccessResponse = function(data) {
    this.code = data.code
    this.data = data.data
}

SuccessResponse.getBaseSuccess = function(data) {
    return {
        status: true,
        code: baseResponse.SUCCESS.CODE,
        data: data
    }
}

module.exports = SuccessResponse