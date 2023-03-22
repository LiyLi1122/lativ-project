const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const jwt = require('jsonwebtoken')

// 前往 fb
router.get('/facebook', passport.authenticate('facebook', { session: false, scope: ['email', 'public_profile'] }), (req, res) => {
  // #swagger.tags = ['Facebook']
})

// fb 取得使用者資料回到 server
router.get('/facebook/callback', async (req, res, next) => {
  passport.authenticate('facebook', { session: false }, (error, user) => {
    if (error) next(error)
    /**
       * 因為 passport 一定會新增一個使用者資料，若沒有回傳 user 物件，
       * 就可能會是 facebook-developer 設定問題
   */
    if (!user) next(error)
    req.user = user
    next()
  })(req, res, next)
}, (req, res, next) => {
  // #swagger.tags = ['Facebook']
  const token = jwt.sign(req.user, 'key', { expiresIn: '30d' })
  delete req.user.password
  res.status(200).json({
    status: 'Success',
    token: token,
    data: req.user
  })
})

module.exports = router
