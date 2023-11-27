const dateTimeUtil = require('../../../util/dateTime.util.js')
const SuccessResponse = require('../base/success.response.js')
const ErrorResponse = require('../base/error.response.js')

const BookReviewModel = require('../book_review/book_review.model.js')

const bookMapper = async function(data, isSignal = false) {
    try {

        const mapper = await Promise.all(data.map(async (item) => {
            const mapping = {}

            mapping['id'] = item.book_id
            mapping['title'] = item.book_title
            mapping['language'] = {
                id: item.book_language,
                name: item.language_name
            }
            mapping['publicationDate'] = dateTimeUtil.formatDate(item.book_publication_date)
            mapping['author'] = {
                id: item.book_author_id,
                name: item.author_name,
                photo: item.author_photo
            }
            mapping['price'] = item.book_price
            mapping['img'] = item.book_img
            mapping['edition'] = item.book_edition
            mapping['stock'] = item.book_stock
            mapping['review'] = await getBookReview(item.book_id)

            return mapping
        }))

        if (isSignal) {
            return SuccessResponse.getBaseSuccess(mapper[0])
        }

        return SuccessResponse.getBaseSuccess(mapper)

    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(`Internal mapper error: ${error}`)
    }
}

async function getBookReview(bookId) {
    const findByBookId = await BookReviewModel.getByBookId(bookId)
    if (!findByBookId.status) {
        return null
    }

    const mapBookReview = findByBookId.data.map(item => {
        return {
            id: item.id,
            content: item.content,
            user: item.user,
            reviewAt: item.reviewAt
        }
    })

    return mapBookReview
}

module.exports = {
    bookMapper
}