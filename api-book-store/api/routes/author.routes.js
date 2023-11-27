const express = require('express')
const router = express.Router()

const controller = require('../controller/author.controller.js')

router.get('/', controller.getAll)

router.get('/id/:id', controller.getById)

router.post('/create', controller.create)

router.put('/update', controller.updateById)

router.delete('/remove/:id', controller.removeById)

module.exports = router