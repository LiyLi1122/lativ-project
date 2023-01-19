const express = require('express')
const router = express.Router()
const api = require('./modules/api') // 篩選路由 放 api 相關
const auth = require('./modules/auth') // 篩選路由 放 auth 相關
const apiErrorHandler = require('../middleware/api-error-handler')

router.use('/api', api)
router.use('/auth', auth)
router.use('/', apiErrorHandler)

module.exports = router
