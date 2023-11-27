const express = require('express')
const app = express()
const path = require('path')

app.use(express.json()) // for json
app.use(express.urlencoded({ extended: true })) // for form data
app.use(express.static(path.join(__dirname, '/res')))

const apiRouter = require('./api/api.routes.js')

app.use('/api', apiRouter)

app.get('/',(req, res) => {
    res.end("Welcome to Book Store API")
})

const server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server is running... ");
});