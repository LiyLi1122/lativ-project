require('dotenv').config()

const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const signupValidator = require('../../middleware/signup-validator')
const auth = require('../../middleware/auth.js')
const userController = require('../../controllers/userController')

// signup
router.post('/user/signup', signupValidator, userController.signup)

// signin
router.post('/user/signin', passport.authenticate('local', { session: false }), userController.signin)

// homepage
router.get('/index', auth.tokenAuth, (req, res, next) => {
  // #swagger.tags = ['Index']
  try {
    res.json('使用成功')
  } catch (error) {
    next(error)
  }
})

module.exports = router
