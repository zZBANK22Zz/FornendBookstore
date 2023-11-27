const dateTimeUtil = require('../../../util/dateTime.util.js')
const SuccessResponse = require('../base/success.response.js')
const ErrorResponse = require('../base/error.response.js')

const authorMapper = function(data, isSignal = false) {
    try {

        const mapper = data.map(item => {
            const mapping = {}

            mapping['id'] = item.author_id
            mapping['name'] = item.author_name
            mapping['description'] = item.author_description
            mapping['photo'] = `${process.env.IMAGE_PATH}${item.author_photo}`
            mapping['dateOfBirth'] = dateTimeUtil.formatDate(item.author_dob)

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
    authorMapper
}