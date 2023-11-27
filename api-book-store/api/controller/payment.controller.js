const util = require('../../util/util.js')

const Model = require('../model/payment/payment.model.js')

exports.getAll = (req, res) => {
    util.upload_center(req, res, async (result) => {
        const body = result.data.body

        const data = await Model.getAll()
        res.status(data.code).json(data)
    })
}

exports.getByOrderId = (req, res) => {
    util.upload_center(req, res, async (result) => {
        const orderId = req.params.orderId ?? null

        const data = await Model.getByOrderId(orderId)
        res.status(data.code).json(data)
    })
}

exports.create = (req, res) => {
    util.upload_center(req, res, async (result) => {
        const body = result.data.body

        const mode = Model.MODE.CREATE
        const validate = Model.validate(body, mode)
        if (!validate.status) {
            return res.status(validate.code).json(validate)
        }

        const create = await Model.create(validate.data)
        res.status(create.code).json(create)
    })
}

exports.removeByOrderId = (req, res) => {
    util.upload_center(req, res, async (result) => {
        const orderId = req.params.orderId ?? null

        const removeById = await Model.removeByOrderId(orderId)
        res.status(removeById.code).json(removeById)
    })
}