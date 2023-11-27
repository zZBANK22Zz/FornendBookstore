const Model = function(data) {
    this.book_id = data.id
    this.book_title = data.title
    this.book_language = data.languageId
    this.book_publication_date = data.publicationDate
    this.book_author_id = data.authorId
    this.book_price = data.price
    this.book_img = data.img
    this.book_edition = data.edition
    this.book_stock = data.stock
}

module.exports = Model

const pool = require('../db/db.js')
const util = require('../../../util/util.js')
const dateTimeUtil = require('../../../util/dateTime.util.js')
const ErrorResponse = require('../base/error.response.js')
const SuccessResponse = require('../base/success.response.js')

const SQL_SELECT = `book_id, book_title, book_language, language_name, book_publication_date, book_author_id, author_name, author_photo, book_price, book_img, book_edition, book_stock`
const SQL_FROM = `tbl_book, tbl_language, tbl_author`
const SQL_WHERE = `tbl_book.book_language = tbl_language.language_id AND tbl_book.book_author_id = tbl_author.author_id`

const mapper = require('./book.mapper.js')

Model.getAll = async function() {
    try {

        const sql = `SELECT ${SQL_SELECT} FROM ${SQL_FROM} WHERE ${SQL_WHERE}`

        const res = await pool.query(sql)

        if (res.length) {
            return await mapper.bookMapper(res, false)
        }

        return ErrorResponse.getNotFound()
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.getByBookId = async function(id) {
    try {

        const sql = `SELECT ${SQL_SELECT} FROM ${SQL_FROM} WHERE ${SQL_WHERE} AND book_id = ?`

        const res = await pool.query(sql, id)

        if (res.length) {
            return await mapper.bookMapper(res, true)
        }

        return ErrorResponse.getNotFound()
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.create = async function(data) {
    try {

        const sql = `INSERT INTO tbl_book SET ?`

        const res = await pool.query(sql, data)

        return SuccessResponse.getBaseSuccess({
            insertId: res.insertId
        })
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.updateByBookId = async function(data) {
    try {

        const sql = `UPDATE tbl_book SET
                        book_title = ?,
                        book_language = ?,
                        book_publication_date = ?,
                        book_author_id = ?,
                        book_price = ?,
                        book_edition = ?
                    WHERE book_id = ?`

        const res = await pool.query(sql, [
            data.book_title, 
            data.book_language, 
            data.book_publication_date, 
            data.book_author_id,
            data.book_price,
            data.book_edition,
            data.book_id
        ])

        if (res.affectedRows == 0) {
            return ErrorResponse.getNotFound(`affectedRows is 0`)
        }

        return SuccessResponse.getBaseSuccess({
            updateId: data.book_id
        })
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.increaseStock = async function(bookId, quantity) {
    try {

        const sql = `UPDATE tbl_book SET book_stock = book_stock + ? WHERE book_id = ?`

        const res = await pool.query(sql, [quantity, bookId])

        if (res.affectedRows == 0) {
            return ErrorResponse.getNotFound(`affectedRows is 0`)
        }

        return SuccessResponse.getBaseSuccess({
            updateId: bookId
        })
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.decreaseStock = async function(bookId, quantity) {
    try {

        const sql = `UPDATE tbl_book SET book_stock = book_stock - ? WHERE book_id = ?`

        const res = await pool.query(sql, [quantity, bookId])

        if (res.affectedRows == 0) {
            return ErrorResponse.getNotFound(`affectedRows is 0`)
        }

        return SuccessResponse.getBaseSuccess({
            updateId: bookId
        })
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.adjustStock = async function(bookId, quantity) {
    try {

        const sql = `UPDATE tbl_book SET book_stock = ? WHERE book_id = ?`

        const res = await pool.query(sql, [quantity, bookId])

        if (res.affectedRows == 0) {
            return ErrorResponse.getNotFound(`affectedRows is 0`)
        }

        return SuccessResponse.getBaseSuccess({
            updateId: bookId
        })
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.removeById = async function(id) {
    try {

        const sql = `DELETE FROM tbl_book WHERE book_id = ?`

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
        
        if (!body.title) {
            return ErrorResponse.getBadRequest(`Title not found.`)
        }

        if (!body.languageId) {
            return ErrorResponse.getBadRequest(`Language id not found.`)
        }
        
        if (!body.publicationDate) {
            return ErrorResponse.getBadRequest(`Publication date not found.`)
        }

        const isValidDate = dateTimeUtil.validateDate(body.publicationDate)
        if (!isValidDate) {
            return ErrorResponse.getBadRequest(`Publication date invalid.`)
        }

        if (!body.authorId) {
            return ErrorResponse.getBadRequest(`Author id not found.`)
        }

        if (!body.price) {
            return ErrorResponse.getBadRequest(`Price not found.`)
        }

        if (!body.edition) {
            return ErrorResponse.getBadRequest(`Edition not found.`)
        }

        let img = `noimg.png`
        if (body.file.length > 0) {
            img = body.file[0].filename ?? `noimg.png`
        }
        const stock = body.stock ?? 0

        const data = new Model({
            title: body.title,
            languageId: body.languageId,
            publicationDate: body.publicationDate,
            authorId: body.authorId,
            price: body.price,
            img: img,
            edition: body.edition,
            stock: stock,
        })

        return SuccessResponse.getBaseSuccess(data)
    }

    if (mode == Model.MODE.UPDATE) {

        if (!body.id) {
            return ErrorResponse.getBadRequest(`Book id not found.`)
        }

        if (!body.title) {
            return ErrorResponse.getBadRequest(`Title not found.`)
        }

        if (!body.languageId) {
            return ErrorResponse.getBadRequest(`Language id not found.`)
        }
        
        if (!body.publicationDate) {
            return ErrorResponse.getBadRequest(`Publication date not found.`)
        }

        const isValidDate = dateTimeUtil.validateDate(body.publicationDate)
        if (!isValidDate) {
            return ErrorResponse.getBadRequest(`Publication date invalid.`)
        }

        if (!body.authorId) {
            return ErrorResponse.getBadRequest(`Author id not found.`)
        }

        if (!body.price) {
            return ErrorResponse.getBadRequest(`Price not found.`)
        }

        if (!body.edition) {
            return ErrorResponse.getBadRequest(`Edition not found.`)
        }

        const data = new Model({
            id: body.id,
            title: body.title,
            languageId: body.languageId,
            publicationDate: body.publicationDate,
            authorId: body.authorId,
            price: body.price,
            edition: body.edition,
        })

        return SuccessResponse.getBaseSuccess(data)
    }

    return ErrorResponse.getBadRequest(`Mode ${mode} is unsupported`)
}