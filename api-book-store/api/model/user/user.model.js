const Model = function(data) {
    this.user_id = data.id
    this.user_first_name = data.firstName
    this.user_last_name = data.lastName
    this.user_email = data.email
    this.user_password = data.password
    this.user_dob = data.dateOfBirth
    this.user_address = data.address
    this.user_phone_number = data.phoneNumber
    this.user_role = data.role
}

module.exports = Model

const bcrypt = require('bcryptjs')
const pool = require('../db/db.js')
const util = require('../../../util/util.js')
const dateTimeUtil = require('../../../util/dateTime.util.js')
const ErrorResponse = require('../base/error.response.js')
const SuccessResponse = require('../base/success.response.js')

const mapper = require('./user.mapper.js')

Model.getAll = async function() {
    try {

        const sql = `SELECT * FROM tbl_user`

        const res = await pool.query(sql)

        if (res.length) {
            return mapper.userMapper(res, false)
        }

        return ErrorResponse.getNotFound()
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.getById = async function(id) {
    try {

        const sql = `SELECT * FROM tbl_user WHERE user_id = ?`

        const res = await pool.query(sql, id)

        if (res.length) {
            return mapper.userMapper(res, true)
        }

        return ErrorResponse.getNotFound()
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.getByEmail = async function(email) {
    try {

        const sql = `SELECT * FROM tbl_user WHERE user_email = ?`

        const res = await pool.query(sql, email)

        if (res.length) {
            return mapper.userMapper(res, true)
        }

        return ErrorResponse.getNotFound()
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.signin = async function(email, password) {
    try {

        const findByEmail = await Model.getByEmail(email)
        if (!findByEmail.status) {
            return ErrorResponse.getNotFound(`Username or Password incorrect.`)
        }

        const dbPassword = findByEmail.data.password
        const isPasswordCorrect = bcrypt.compareSync(password, dbPassword)
        if (!isPasswordCorrect) {
            return ErrorResponse.getNotFound(`Username or Password incorrect`)
        }

        delete findByEmail.data.password
        return findByEmail
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.create = async function(data) {
    try {

        const sql = `INSERT INTO tbl_user SET ?`

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

        const sql = `UPDATE tbl_user SET 
                        user_first_name = ?,
                        user_last_name = ?,
                        user_dob = ?,
                        user_address = ?,
                        user_phone_number = ?,
                        user_role = ? 
                    WHERE user_id = ?`

        const res = await pool.query(sql, [
            data.user_first_name, 
            data.user_last_name, 
            data.user_dob, 
            data.user_address, 
            data.user_phone_number, 
            data.user_role, 
            data.user_id
        ])

        if (res.affectedRows == 0) {
            return ErrorResponse.getNotFound(`affectedRows is 0`)
        }

        return SuccessResponse.getBaseSuccess({
            updateId: data.user_id
        })
        
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.removeById = async function(id) {
    try {

        const sql = `DELETE FROM tbl_user WHERE user_id = ?`

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

Model.validate = async function(body, mode) {
    if (util.isEmpty(body)) {
        return ErrorResponse.getBadRequest()
    }

    if (mode == Model.MODE.CREATE) {
        
        if (!body.firstName) {
            return ErrorResponse.getBadRequest(`First name not found`)
        }

        if (!body.lastName) {
            return ErrorResponse.getBadRequest(`Last name not found`)
        }

        if (!body.email) {
            return ErrorResponse.getBadRequest(`Email not found`)
        }

        if (!body.password) {
            return ErrorResponse.getBadRequest(`Password not found`)
        }

        if (!body.dateOfBirth) {
            return ErrorResponse.getBadRequest(`Date of birth not found`)
        }

        const isValidDate = dateTimeUtil.validateDate(body.dateOfBirth)
        if (!isValidDate) {
            return ErrorResponse.getBadRequest(`Date of birth invalid.`)
        }

        if (!body.address) {
            return ErrorResponse.getBadRequest(`Address not found`)
        }

        if (!body.phoneNumber) {
            return ErrorResponse.getBadRequest(`Phone number not found`)
        }

        if (!body.role) {
            return ErrorResponse.getBadRequest(`Role not found`)
        }

        // Check email is existing
        const findByEmail = await Model.getByEmail(body.email)
        if (findByEmail.status) {
            return ErrorResponse.getBadRequest(`This email is existing`)
        }

        const hashPassword = bcrypt.hashSync(body.password, 10)

        const data = new Model({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: hashPassword,
            dateOfBirth: body.dateOfBirth,
            address: body.address,
            phoneNumber: body.phoneNumber,
            role: body.role
        })

        return SuccessResponse.getBaseSuccess(data)
    }

    if (mode == Model.MODE.UPDATE) {

        if (!body.id) {
            return ErrorResponse.getBadRequest(`User id not found`)
        }

        if (!body.firstName) {
            return ErrorResponse.getBadRequest(`First name not found`)
        }

        if (!body.lastName) {
            return ErrorResponse.getBadRequest(`Last name not found`)
        }

        if (!body.dateOfBirth) {
            return ErrorResponse.getBadRequest(`Date of birth not found`)
        }

        const isValidDate = dateTimeUtil.validateDate(body.dateOfBirth)
        if (!isValidDate) {
            return ErrorResponse.getBadRequest(`Date of birth invalid.`)
        }

        if (!body.address) {
            return ErrorResponse.getBadRequest(`Address not found`)
        }

        if (!body.phoneNumber) {
            return ErrorResponse.getBadRequest(`Phone number not found`)
        }

        if (!body.role) {
            return ErrorResponse.getBadRequest(`Role not found`)
        }

        const data = new Model({
            id: body.id,
            firstName: body.firstName,
            lastName: body.lastName,
            dateOfBirth: body.dateOfBirth,
            address: body.address,
            phoneNumber: body.phoneNumber,
            role: body.role
        })

        return SuccessResponse.getBaseSuccess(data)

    }
    
    return ErrorResponse.getBadRequest(`Mode ${mode} is unsupported`)
}