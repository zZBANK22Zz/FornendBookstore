const Model = function(data) {
    this.author_id = data.id
    this.author_name = data.name
    this.author_description = data.description
    this.author_photo = data.photo
    this.author_dob = data.dateOfBirth
}

module.exports = Model

const pool = require('../db/db.js')
const util = require('../../../util/util.js')
const dateTimeUtil = require('../../../util/dateTime.util.js')
const ErrorResponse = require('../base/error.response.js')
const SuccessResponse = require('../base/success.response.js')

const mapper = require('./author.mapper.js')

Model.getAll = async function() {
    try {

        const sql = `SELECT * FROM tbl_author`

        const res = await pool.query(sql)

        if (res.length) {
            return mapper.authorMapper(res, false)
        }

        return ErrorResponse.getNotFound()
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.getById = async function(id) {
    try {

        const sql = `SELECT * FROM tbl_author WHERE author_id = ?`

        const res = await pool.query(sql, id)

        if (res.length) {
            return mapper.authorMapper(res, true)
        }

        return ErrorResponse.getNotFound()
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.create = async function(data) {
    try {

        const sql = `INSERT INTO tbl_author SET ?`

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

        const sql = `UPDATE tbl_author SET 
                        author_name = ?,
                        author_description = ?,
                        author_dob = ?
                    WHERE author_id = ?`

        const res = await pool.query(sql, [data.author_name, data.author_description, data.author_dob, data.author_id])

        if (res.affectedRows == 0) {
            return ErrorResponse.getNotFound(`affectedRows is 0`)
        }

        return SuccessResponse.getBaseSuccess({
            updateId: data.author_id
        })
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.removeById = async function(id) {
    try {

        const sql = `DELETE FROM tbl_author WHERE author_id = ?`

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
        
        if (!body.name) {
            return ErrorResponse.getBadRequest(`Author name not found`)
        }

        if (!body.dateOfBirth) {
            return ErrorResponse.getBadRequest(`Author date of birth not found`)
        }

        const isValidDate = dateTimeUtil.validateDate(body.dateOfBirth)
        if (!isValidDate) {
            return ErrorResponse.getBadRequest(`Date of birth invalid.`)
        }

        const description = body.description ?? null
        let photo = `noimg.png`
        if (body.file.length > 0) {
            photo = body.file[0].filename ?? `noimg.png`
        }

        const data = new Model({
            name: body.name,
            description: description,
            photo: photo,
            dateOfBirth: body.dateOfBirth
        })

        return SuccessResponse.getBaseSuccess(data)

    }

    if (mode == Model.MODE.UPDATE) {

        if (!body.id) {
            return ErrorResponse.getBadRequest(`Author id not found`)
        }

        if (!body.name) {
            return ErrorResponse.getBadRequest(`Author name not found`)
        }

        if (!body.dateOfBirth) {
            return ErrorResponse.getBadRequest(`Author date of birth not found`)
        }

        const isValidDate = dateTimeUtil.validateDate(body.dateOfBirth)
        if (!isValidDate) {
            return ErrorResponse.getBadRequest(`Date of birth invalid.`)
        }

        const description = body.description ?? null

        const data = new Model({
            id: body.id,
            name: body.name,
            description: description,
            dateOfBirth: body.dateOfBirth
        })

        return SuccessResponse.getBaseSuccess(data)
    }

    return ErrorResponse.getBadRequest(`Mode ${mode} is unsupported`)
}