const Model = function(data) {
    this.order_id = data.orderId
    this.order_total_discount = data.totalDiscount
    this.order_total_price_before_discount = data.totalPriceBeforeDiscount
    this.order_total_price_after_discount = data.totalPriceAfterDiscount
    this.order_by_user = data.orderByUserId
    this.order_dest_address = data.destAddress
    this.order_at = data.orderAt
}

module.exports = Model

const pool = require('../db/db.js')
const util = require('../../../util/util.js')
const dateTimeUtil = require('../../../util/dateTime.util.js')
const ErrorResponse = require('../base/error.response.js')
const SuccessResponse = require('../base/success.response.js')

const SQL_SELECT = `order_id, order_total_discount, order_total_price_before_discount, order_total_price_after_discount, order_by_user, user_email, user_first_name, user_last_name, order_at`
const SQL_FROM = `tbl_order, tbl_user`
const SQL_WHERE = `tbl_order.order_by_user = tbl_user.user_id`

const mapper = require('./order.mapper.js')

const OrderDetailModel = require('../order_detail/order_detail.model.js')
const PaymentModel = require('../payment/payment.model.js')
const BookModel = require('../book/book.model.js')

Model.getAll = async function() {
    try {

        const sql = `SELECT ${SQL_SELECT} FROM ${SQL_FROM} WHERE ${SQL_WHERE}`

        const res = await pool.query(sql)

        if (res.length) {
            return mapper.orderMapper(res, false)
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
            return mapper.orderMapper(res, false)
        }

        return ErrorResponse.getNotFound()
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.createOrderFullInformation = async function(data) {
    try {
        let createOrderReport = null
        const createOrderDetailReport = []
        let createPaymentReport = null

        // Create Order
        const createOrder = await Model.create(data.order)
        createOrderReport = createOrder

        // Create Order detail
        for (item of data.orderDetailData) {
            const createOrderDetail = await OrderDetailModel.create(item)
            createOrderDetailReport.push(createOrderDetail)

            // decreaseStock
            const decreaseStock = await BookModel.decreaseStock(item.book_id, item.quantity)
        }
        
        // Create Payment
        const createPayment = await PaymentModel.create(data.paymentData)
        createPaymentReport = createPayment

        return SuccessResponse,SuccessResponse.getBaseSuccess({
            createOrderReport: createOrderReport,
            createOrderDetailReport: createOrderDetailReport,
            createPaymentReport: createPaymentReport
        })

    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.create = async function(data) {
    try {

        const sql = `INSERT INTO tbl_order SET ?`

        const res = await pool.query(sql, data)

        return SuccessResponse.getBaseSuccess({
            insertId: data.order_id
        }) 
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.removeOrder = async function(orderId) {
    try {

        let removeOrderReport = null
        let removeOrderDetailReport = null
        let removePaymentReport = null

        const removeOrder = await Model.removeByOrderId(orderId)
        const removeOrderDetail = await OrderDetailModel.removeByOrderId(orderId)
        const removePayment = await PaymentModel.removeByOrderId(orderId)

        removeOrderReport = removeOrder
        removeOrderDetailReport = removeOrderDetail
        removePaymentReport = removePayment

        return SuccessResponse.getBaseSuccess({
            removeOrderReport: removeOrderReport,
            removeOrderDetailReport: removeOrderDetailReport,
            removePaymentReport: removePaymentReport
        })
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(error.message)
    }
}

Model.removeByOrderId = async function(orderId) {
    try {

        const sql = `DELETE FROM tbl_order WHERE order_id = ?`

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

Model.generateOrderId = function() {
    const unixTime = dateTimeUtil.unixTimestamp()
    return `INV-${unixTime}`
}

Model.MODE = {
    CREATE: `CREATE`
}

Model.validate = function(body, mode) {
    if (util.isEmpty(body)) {
        return ErrorResponse.getBadRequest()
    }

    if (mode == Model.MODE.CREATE) {
        
        if (!body.books) {
            return ErrorResponse.getBadRequest(`Books not found.`)
        }

        if (body.books.length == 0) {
            return ErrorResponse.getBadRequest(`Books is empty.`)
        }

        if (!body.paymentMethod) {
            return ErrorResponse.getBadRequest(`Payment method not found.`)
        }

        if (!body.userId) {
            return ErrorResponse.getBadRequest(`User id not found.`)
        }

        if (!body.destAddress) {
            return ErrorResponse.getBadRequest(`Dest address not found.`)
        }

        const orderId = Model.generateOrderId()
        let _totalDiscount = 0
        let _totoalPriceBeforeDiscount = 0
        let _totalPriceAfterDiscount = 0

        const orderDetailData = []

        for (item of body.books) {
            const discount = item.discount
            const totalPriceBeforeDiscount = item.pricePerItem * item.quantity
            const totalPriceAfterDiscount = totalPriceBeforeDiscount - discount
            
            _totalDiscount += discount
            _totoalPriceBeforeDiscount += totalPriceBeforeDiscount
            _totalPriceAfterDiscount += totalPriceAfterDiscount

            const detailData = new OrderDetailModel({
                orderId: orderId,
                bookId: item.bookId,
                pricePerItem: item.pricePerItem,
                quantity: item.quantity,
                discount: discount,
                totalPriceBeforeDiscount: totalPriceBeforeDiscount,
                totalPriceAfterDiscount: totalPriceAfterDiscount
            })

            orderDetailData.push(detailData)
        }

        const orderData = new Model({
            orderId: orderId,
            totalDiscount: _totalDiscount,
            totalPriceBeforeDiscount: _totoalPriceBeforeDiscount,
            totalPriceAfterDiscount: _totalPriceAfterDiscount,
            orderByUserId: body.userId,
            destAddress: body.destAddress,
            orderAt: dateTimeUtil.currentDate()
        })

        const paymentId = PaymentModel.generatePaymentId()
        const paymentData = new PaymentModel({
            paymentId: paymentId,
            orderId: orderId,
            method: body.paymentMethod,
            amount: _totalPriceAfterDiscount
        })

        return SuccessResponse.getBaseSuccess({
            order: orderData,
            orderDetailData: orderDetailData,
            paymentData: paymentData
        })

    }

    return ErrorResponse.getBadRequest(`Mode ${mode} is unsupported`)
}