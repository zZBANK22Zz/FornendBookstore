const express = require('express')
const router = express.Router()

const controller = require('../controller/order.controller.js')

router.get('/', controller.getAll)

router.get('/orderId/:orderId', controller.getByOrderId)

router.post('/create', controller.create)

router.delete('/remove/:orderId', controller.removeByOrderId)

module.exports = router