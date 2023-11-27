const Model = function(data) {
    this.payment_id = data.paymentId
    this.payment_order = data.orderId
    this.payment_method = data.method
    this.payment_amout = data.amount
}

module.exports = Model

const pool = require('../db/db.js')
const util = require('../../../util/util.js')
const dateTimeUtil = require('../../../util/dateTime.util.js')
const ErrorResponse = require('../base/error.response.js')
const SuccessResponse = require('../base/success.response.js')

const mapper = require('./payment.mapper.js')

Model.getAll = async function() {
    try {

        const sql = `SELECT* FROM tbl_payment`

        const res = await pool.query(sql)

        if (res.length) {
            return mapper.paymentMapper(res, false)
        }

        return ErrorResponse.getNotFound()
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.getByOrderId = async function(orderId) {
    try {

        const sql = `SELECT* FROM tbl_payment WHERE payment_order = ?`

        const res = await pool.query(sql, orderId)

        if (res.length) {
            return mapper.paymentMapper(res, false)
        }

        return ErrorResponse.getNotFound()
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.create = async function(data) {
    try {

        const sql = `INSERT INTO tbl_payment SET ?`

        const res = await pool.query(sql, data)

        return SuccessResponse.getBaseSuccess({
            paymentId: data.payment_id,
            orderId: data.payment_order
        })
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.removeByOrderId = async function(orderId) {
    try {

        const sql = `DELETE FROM tbl_payment WHERE payment_order = ?`

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

Model.PAYMENT_METHOD = {
    CASH: `CASH`,
    CREDIT_CARD: `CREDIT_CARD`,
    BANK_TRANSFER: `BANK_TRANSFER`
}

Model.generatePaymentId = function() {
    const unixTime = dateTimeUtil.unixTimestamp()
    return `pay-${unixTime}`
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

        if (!body.method) {
            return ErrorResponse.getBadRequest(`Payment method not found.`)
        }

        if (!body.amount) {
            return ErrorResponse.getBadRequest(`Payment amount not found.`)
        }

        const paymentId = Model.generatePaymentId()

        const data = new Model({
            paymentId: paymentId,
            orderId: body.orderId,
            method: body.method,
            amount: body.amount
        })

        return SuccessResponse.getBaseSuccess(data)
    }

    return ErrorResponse.getBadRequest(`Mode ${mode} is unsupported`)
}