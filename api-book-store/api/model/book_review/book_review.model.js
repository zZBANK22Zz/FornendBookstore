const Model = function(data) {
    this.review_id = data.id
    this.review_book_id = data.bookId
    this.review_user_id = data.userId
    this.review_content = data.content
    this.review_at = data.reviewAt
}

module.exports = Model

const pool = require('../db/db.js')
const util = require('../../../util/util.js')
const dateTimeUtil = require('../../../util/dateTime.util.js')
const ErrorResponse = require('../base/error.response.js')
const SuccessResponse = require('../base/success.response.js')

const SQL_SELECT = `review_id, review_book_id, review_content, review_user_id, user_first_name, user_last_name, user_email, review_at`
const SQL_FROM = `tbl_book_review, tbl_user`
const SQL_WHERE = `tbl_book_review.review_user_id = tbl_user.user_id`

const mapper = require('./book_review.mapper.js')

Model.getAll = async function() {
    try {

        const sql = `SELECT ${SQL_SELECT} FROM ${SQL_FROM} WHERE ${SQL_WHERE}`

        const res = await pool.query(sql)

        if (res.length) {
            return mapper.bookReviewMapper(res, false)
        }

        return ErrorResponse.getNotFound()
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.getByReviewId = async function(id) {
    try {

        const sql = `SELECT ${SQL_SELECT} FROM ${SQL_FROM} WHERE ${SQL_WHERE} AND review_id = ?`

        const res = await pool.query(sql, id)

        if (res.length) {
            return mapper.bookReviewMapper(res, true)
        }

        return ErrorResponse.getNotFound()
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.getByBookId = async function(id) {
    try {

        const sql = `SELECT ${SQL_SELECT} FROM ${SQL_FROM} WHERE ${SQL_WHERE} AND review_book_id = ?`

        const res = await pool.query(sql, id)

        if (res.length) {
            return mapper.bookReviewMapper(res, false)
        }

        return ErrorResponse.getNotFound()
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.create = async function(data) {
    try {

        const sql = `INSERT INTO tbl_book_review SET ?`

        const res = await pool.query(sql, data)

        return SuccessResponse.getBaseSuccess({
            insertId: res.insertId
        })
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.updateById = async function(data) {
    try {

        const sql = `UPDATE tbl_book_review SET 
                        review_content = ?,
                        review_at = ?
                    WHERE review_id = ?`

        const res = await pool.query(sql, [
            data.review_content,
            data.review_at,
            data.review_id
        ])

        if (res.affectedRows == 0) {
            return ErrorResponse.getNotFound(`affectedRows is 0`)
        }

        return SuccessResponse.getBaseSuccess({
            updateId: data.review_id
        })
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.removeById = async function(id) {
    try {

        const sql = `DELETE FROM tbl_book_review WHERE review_id = ?`

        const res = await pool.query(sql, id)

        if (res.affectedRows == 0) {
            return ErrorResponse.getNotFound(`affectedRows is 0`)
        }

        return SuccessResponse.getBaseSuccess({
            removeId: id
        })
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.MODE = {
    CREATE: `CREATE`,
    UPDATE: `UPDATE`
}

Model.validate = function(body, mode) {
    if (util.isEmpty(body)) {
        return ErrorResponse.getBadRequest()
    }

    if (mode == Model.MODE.CREATE) {

        if (!body.bookId) {
            return ErrorResponse.getBadRequest(`Book id not found.`)
        }

        if (!body.userId) {
            return ErrorResponse.getBadRequest(`User id not found.`)
        }

        if (!body.content) {
            return ErrorResponse.getBadRequest(`Review content not found.`)
        }

        const data = new Model({
            bookId: body.bookId,
            userId: body.userId,
            content: body.content,
            reviewAt: dateTimeUtil.currentDate()
        })

        return SuccessResponse.getBaseSuccess(data)
    }

    if (mode == Model.MODE.UPDATE) {

        if (!body.id) {
            return ErrorResponse.getBadRequest(`Review id not found.`)
        }

        if (!body.content) {
            return ErrorResponse.getBadRequest(`Review content not found.`)
        }

        const data = new Model({
            id: body.id,
            content: body.content,
            reviewAt: dateTimeUtil.currentDate()
        })

        return SuccessResponse.getBaseSuccess(data)
    }

    return ErrorResponse.getBadRequest(`Mode ${mode} is unsupported`)
}