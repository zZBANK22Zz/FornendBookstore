const SuccessResponse = require('../base/success.response.js')
const ErrorResponse = require('../base/error.response.js')

const languageMapper = function(data, isSignal = false) {
    try {

        const mapper = data.map(item => {
            const mapping = {}

            mapping['id'] = item.language_id
            mapping['name'] = item.language_name

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
    languageMapper
}