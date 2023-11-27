const express = require('express')
const router = express.Router()

const controller = require('../controller/user.controller.js')

router.get('/', controller.getAll)

router.get('/id/:id', controller.getById)

router.get('/email/:email', controller.getByEmail)

router.get('/signin', controller.signin)

router.post('/create', controller.create)

router.put('/update', controller.updateById)

router.delete('/remove/:id', controller.removeById)

module.exports = router