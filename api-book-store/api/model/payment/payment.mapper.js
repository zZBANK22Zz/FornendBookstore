const dateTimeUtil = require('../../../util/dateTime.util.js')
const SuccessResponse = require('../base/success.response.js')
const ErrorResponse = require('../base/error.response.js')

const paymentMapper = function(data, isSignal = false) {
    try {

        const mapper = data.map(item => {
            const mapping = {}

            mapping['paymentId'] = item.payment_id
            mapping['paymentOrder'] = item.payment_order
            mapping['paymentMethod'] = item.payment_method
            mapping['paymentAmount'] = item.payment_amout

            return mapping
        })

        if (isSignal) {
            return SuccessResponse.getBaseSuccess(mapper[0])
        }

        return SuccessResponse.getBaseSuccess(mapper)
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(`Internal mapper error: ${error}`)
    }
}

module.exports = {
    paymentMapper
}