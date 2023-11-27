const express = require('express')
const router = express.Router()

const controller = require('../controller/book_review.controller.js')

router.get('/', controller.getAll)

router.get('/reviewId/:reviewId', controller.getByReviewId)

router.get('/bookId/:bookId', controller.getByBookId)

router.post('/create', controller.create)

router.put('/update', controller.updateById)

router.delete('/remove/:id', controller.removeById)

module.exports = router