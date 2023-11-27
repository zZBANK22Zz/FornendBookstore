const util = require('../../util/util.js')

const Model = require('../model/book_review/book_review.model.js')

exports.getAll = (req, res) => {
    util.upload_center(req, res, async (result) => {
        const body = result.data.body

        const data = await Model.getAll()
        res.status(data.code).json(data)
    })
}

exports.getByReviewId = (req, res) => {
    util.upload_center(req, res, async (result) => {
        const reviewId = req.params.reviewId ?? null

        const data = await Model.getByReviewId(reviewId)
        res.status(data.code).json(data)
    })
}

exports.getByBookId = (req, res) => {
    util.upload_center(req, res, async (result) => {
        const bookId = req.params.bookId ?? null

        const data = await Model.getByBookId(bookId)
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

exports.updateById = (req, res) => {
    util.upload_center(req, res, async (result) => {
        const body = result.data.body

        const mode = Model.MODE.UPDATE
        const validate = Model.validate(body, mode)
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