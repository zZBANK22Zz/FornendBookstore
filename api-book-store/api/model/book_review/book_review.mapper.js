const dateTimeUtil = require('../../../util/dateTime.util.js')
const SuccessResponse = require('../base/success.response.js')
const ErrorResponse = require('../base/error.response.js')

const bookReviewMapper = function(data, isSignal = false) {
    try {

        const mapper = data.map(item => {
            const mapping = {}

            mapping['id'] = item.review_id
            mapping['bookId'] = item.review_book_id
            mapping['content'] = item.review_content
            mapping['user'] = {
                id: item.review_user_id,
                email: item.user_email,
                firstName: item.user_first_name,
                lastName: item.user_last_name
            }
            mapping['reviewAt'] = dateTimeUtil.formatDateTime(item.review_at)

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
    bookReviewMapper
}