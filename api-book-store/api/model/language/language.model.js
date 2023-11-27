const Model = function(data) {
    this.language_id = data.id
    this.language_name = data.name
}

module.exports = Model

const pool = require('../db/db.js')
const util = require('../../../util/util.js')
const ErrorResponse = require('../base/error.response.js')
const SuccessResponse = require('../base/success.response.js')

const mapper = require('./language.mapper.js')

Model.getAll = async function() {
    try {

        const sql = `SELECT * FROM tbl_language`

        const res = await pool.query(sql)

        if (res.length) {
            return mapper.languageMapper(res, false)
        }

        return ErrorResponse.getNotFound()
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.getById = async function(id) {
    try {

        const sql = `SELECT * FROM tbl_language WHERE language_id = ?`

        const res = await pool.query(sql, id)

        if (res.length) {
            return mapper.languageMapper(res, true)
        }

        return ErrorResponse.getNotFound()
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.create = async function(data) {
    try {

        const sql = `INSERT INTO tbl_language SET ?`

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

        const sql = `UPDATE tbl_language SET language_name = ? WHERE language_id = ?`

        const res = await pool.query(sql, [data.language_name, data.language_id])

        if (res.affectedRows == 0) {
            return ErrorResponse.getNotFound(`affectedRows is 0`)
        }

        return SuccessResponse.getBaseSuccess({
            updateId: data.language_id
        })
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.removeById = async function(id) {
    try {

        const sql = `DELETE FROM tbl_language WHERE language_id = ?`

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
            return ErrorResponse.getBadRequest(`Language name not found`)
        }

        const data = new Model({
            name: body.name
        })

        return SuccessResponse.getBaseSuccess(data)
    }

    if (mode == Model.MODE.UPDATE) {

        if (!body.id) {
            return ErrorResponse.getBadRequest(`Language id not found`)
        }
        
        if (!body.name) {
            return ErrorResponse.getBadRequest(`Language name not found`)
        }

        const data = new Model({
            id: body.id,
            name: body.name
        })

        return SuccessResponse.getBaseSuccess(data)
    }

    return ErrorResponse.getBadRequest(`Mode ${mode} is unsupported`)
}

