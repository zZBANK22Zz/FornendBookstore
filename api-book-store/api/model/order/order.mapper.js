const dateTimeUtil = require('../../../util/dateTime.util.js')
const SuccessResponse = require('../base/success.response.js')
const ErrorResponse = require('../base/error.response.js')

const OrderDetailModel = require('../order_detail/order_detail.model.js')
const PaymentModel = require('../payment/payment.model.js')

const orderMapper = async function(data, isSignal = false) {
    try {

        const mapper = await Promise.all(data.map(async (item) => {
            const mapping = {}

            mapping['orderId'] = item.order_id
            mapping['detail'] = await getOrderDetail(item.order_id)
            mapping['totalDiscount'] = item.order_total_discount
            mapping['totalPriceBeforeDiscount'] = item.order_total_price_before_discount
            mapping['totalPriceAfterDiscount'] = item.order_total_price_after_discount
            mapping['user'] = {
                id: item.order_by_user,
                email: item.user_email,
                firstName: item.user_first_name,
                lastName: item.user_last_name
            }
            mapping['destAddress'] = item.order_dest_address
            mapping['payment'] = await getPayment(item.order_id)
            mapping['orderAt'] = dateTimeUtil.formatDateTime(item.order_at)

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

async function getOrderDetail(orderId) {
    const findOrderDetail = await OrderDetailModel.getByOrderId(orderId)
    if (!findOrderDetail.status) {
        return null
    }

    const mapOrderDetail = findOrderDetail.data.map(item => {
        delete item.orderId
        return item
    })

    return mapOrderDetail
}

async function getPayment(orderId) {
    const findPayment = await PaymentModel.getByOrderId(orderId)
    if (!findPayment.status) {
        return null
    }

    const mapPayment = findPayment.data.map(item => {
        delete item.paymentOrder
        return item
    })

    return mapPayment
}

module.exports = {
    orderMapper
}