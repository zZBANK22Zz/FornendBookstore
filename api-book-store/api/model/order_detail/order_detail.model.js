const Model = function(data) {
    this.order_id = data.orderId
    this.book_id = data.bookId
    this.price_per_item = data.pricePerItem
    this.quantity = data.quantity
    this.discount = data.discount
    this.total_price_before_discount = data.totalPriceBeforeDiscount
    this.total_price_after_discount = data.totalPriceAfterDiscount
}

module.exports = Model

const pool = require('../db/db.js')
const util = require('../../../util/util.js')
const dateTimeUtil = require('../../../util/dateTime.util.js')
const ErrorResponse = require('../base/error.response.js')
const SuccessResponse = require('../base/success.response.js')

const SQL_SELECT = `order_id, tbl_order_detail.book_id, book_title, book_language, language_name, book_publication_date, book_author_id, author_name, author_photo, book_img, book_edition, price_per_item, quantity, discount, total_price_before_discount, total_price_after_discount`
const SQL_FROM = `tbl_order_detail, tbl_book, tbl_language, tbl_author`
const SQL_WHERE = `tbl_order_detail.book_id = tbl_book.book_id AND tbl_book.book_language = tbl_language.language_id AND tbl_book.book_author_id = tbl_author.author_id`

const mapper = require('./order_detail.mapper.js')

Model.getAll = async function() {
    try {

        const sql = `SELECT ${SQL_SELECT} FROM ${SQL_FROM} WHERE ${SQL_WHERE}`

        const res = await pool.query(sql)

        if (res.length) {
            return mapper.orderDetailMapper(res, false)
        }

        return ErrorResponse.getNotFound()
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.getByOrderId = async function(orderId) {
    try {

        const sql = `SELECT ${SQL_SELECT} FROM ${SQL_FROM} WHERE ${SQL_WHERE} AND order_id = ?`

        const res = await pool.query(sql, orderId)

        if (res.length) {
            return mapper.orderDetailMapper(res, false)
        }

        return ErrorResponse.getNotFound()
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.create = async function(data) {
    try {

        const sql = `INSERT INTO tbl_order_detail SET ?`

        const res = await pool.query(sql, data)

        return SuccessResponse.getBaseSuccess({
            insertId: data.order_id
        })
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.removeByOrderId = async function(orderId) {
    try {

        const sql = `DELETE FROM tbl_order_detail WHERE order_id = ?`

        const res = await pool.query(sql, orderId)

        if (res.affectedRows == 0) {
            return ErrorResponse.getNotFound(`affectedRows is 0`)
        }

        return SuccessResponse.getBaseSuccess({
            removeId: orderId
        })
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.MODE = {
    CREATE: `CREATE`
}

Model.validate = function(body, mode) {
    if (util.isEmpty(body)) {
        return ErrorResponse.getBadRequest()
    }

    if (mode == Model.MODE.CREATE) {
        
        if (!body.orderId) {
            return ErrorResponse.getBadRequest(`Order id not found.`)
        }

        if (!body.bookId) {
            return ErrorResponse.getBadRequest(`Book id not found.`)
        }

        if (!body.pricePerItem) {
            return ErrorResponse.getBadRequest(`Price per item not found.`)
        }

        if (!body.quantity) {
            return ErrorResponse.getBadRequest(`Quantity not found.`)
        }

        const discount = body.discount ?? 0
        const totalPriceBeforeDiscount = body.pricePerItem * body.quantity
        const totalPriceAfterDiscount = totalPriceBeforeDiscount - discount

        const data = new Model({
            orderId: body.orderId,
            bookId: body.bookId,
            pricePerItem: body.pricePerItem,
            quantity: body.quantity,
            discount: discount,
            totalPriceBeforeDiscount: totalPriceBeforeDiscount,
            totalPriceAfterDiscount: totalPriceAfterDiscount
        })

        return SuccessResponse.getBaseSuccess(data)
    }

    return ErrorResponse.getBadRequest(`Mode ${mode} is unsupported`)
}
