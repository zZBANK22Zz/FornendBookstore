const dateTimeUtil = require('../../../util/dateTime.util.js')
const SuccessResponse = require('../base/success.response.js')
const ErrorResponse = require('../base/error.response.js')

const orderDetailMapper = function(data, isSignal = false) {
    try {

        const mapper = data.map(item => {
            const mapping = {}

            mapping['orderId'] = item.order_id
            mapping['book'] = {
                id: item.book_id,
                title: item.book_title,
                language: {
                    id: item.book_language,
                    name: item.language_name
                },
                publicationDate: dateTimeUtil.formatDate(item.book_publication_date),
                author: {
                    id: item.book_author_id,
                    name: item.author_name,
                    photo: item.author_photo
                },
                img: item.book_img,
                edition: item.book_edition
            }
            mapping['pricePerItem'] = item.price_per_item
            mapping['quantity'] = item.quantity
            mapping['discount'] = item.discount
            mapping['totalPriceBeforeDiscount'] = item.total_price_before_discount
            mapping['totalPriceAfterDiscount'] = item.total_price_after_discount

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
    orderDetailMapper
}