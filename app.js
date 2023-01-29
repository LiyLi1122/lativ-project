require('dotenv').config()

const port = process.env.PORT
const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const passport = require('./config/passport.js')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization']
}
const app = express()

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
// 為了測試路由所設定
app.get('/test', (req, res) => {
  console.log('-------------- /testsssss ------------ ')
  res.json('成功')
})
app.use(routes)

app.listen(port, () => console.log(`app is listening ${port}`))

module.exports = app
