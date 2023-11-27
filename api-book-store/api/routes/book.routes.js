const express = require('express')
const router = express.Router()

const controller = require('../controller/book.controller.js')

router.get('/', controller.getAll)

router.get('/bookId/:bookId', controller.getByBookId)

router.post('/create', controller.create)

router.put('/update', controller.updateByBookId)

router.put('/stock/increase', controller.increaseStock)

router.put('/stock/decrease', controller.decreaseStock)

router.put('/stock/adjust', controller.adjustStock)

router.delete('/remove/:id', controller.removeById)

module.exports = router