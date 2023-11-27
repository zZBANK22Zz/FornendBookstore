const express = require('express')
const router = express.Router()

const languageRouter = require('./routes/language.routes.js')
const authorRouter = require('./routes/author.routes.js')
const userRouter = require('./routes/user.routes.js')
const bookRouter = require('./routes/book.routes.js')
const bookReviewRouter = require('./routes/book_review.routes.js')
const orderRouter = require('./routes/order.routes.js')
const orderDetailRouter = require('./routes/order_detail.routes.js')
const paymentRouter = require('./routes/payment.routes.js')

router.use('/language', languageRouter)
router.use('/author', authorRouter)
router.use('/user', userRouter)
router.use('/book', bookRouter)
router.use('/book_review', bookReviewRouter)
router.use('/order', orderRouter)
router.use('/order_detail', orderDetailRouter)
router.use('/payment', paymentRouter)

module.exports = router