const util = require('../../util/util.js')

const Model = require('../model/user/user.model.js')

exports.getAll = (req, res) => {
    util.upload_center(req, res, async (result) => {
        const body = result.data.body

        const data = await Model.getAll()
        res.status(data.code).json(data)
    })
}

exports.getById = (req, res) => {
    util.upload_center(req, res, async (result) => {
        const id = req.params.id ?? null

        const data = await Model.getById(id)
        res.status(data.code).json(data)
    })
}

exports.getByEmail = (req, res) => {
    util.upload_center(req, res, async (result) => {
        const email = req.params.email ?? null

        const data = await Model.getByEmail(email)
        res.status(data.code).json(data)
    })
}

exports.signin = (req, res) => {
    util.upload_center(req, res, async (result) => {
        const body = result.data.body

        const email = body.email
        const password = body.password

        const data = await Model.signin(email, password)
        res.status(data.code).json(data)
    })
}

exports.create = (req, res) => {
    util.upload_center(req, res, async (result) => {
        const body = result.data.body

        const mode = Model.MODE.CREATE
        const validate = await Model.validate(body, mode)
        if (!validate.status) {
            return res.status(validate.code).json(validate)
        }

        const create = await Model.create(validate.data)
        res.status(create.code).json(create)
    })
}

exports.updateById = (req, res) => {
    util.upload_center(req, res, async (result) => {
        const body = result.data.body

        const mode = Model.MODE.UPDATE
        const validate = await Model.validate(body, mode)
        if (!validate.status) {
            return res.status(validate.code).json(validate)
        }

        const update = await Model.updateById(validate.data)
        res.status(update.code).json(update)
    })
}

exports.removeById = (req, res) => {
    util.upload_center(req, res, async (result) => {
        const id = req.params.id ?? null

        const removeById = await Model.removeById(id)
        res.status(removeById.code).json(removeById)
    })
}