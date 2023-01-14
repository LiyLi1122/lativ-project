require('dotenv').config()
const port = process.env.PORT || 8080

const express = require('express')
const app = express()
const routes = require('./routes')
const passport = require('./config/passport.js')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use('/api', routes)

app.listen(port, () => console.log(`app is listening ${port}`))

module.exports = app
