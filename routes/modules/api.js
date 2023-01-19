const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const signupValidator = require('../../middleware/signup-validator')
const { User } = require('../../models')
const jwt = require('jsonwebtoken')

// signup
router.post('/signup', signupValidator, async (req, res, next) => {
  // #swagger.tags = ['User']
  try {
    const err = new Error()
    const { name, email, password } = req.body
    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: { name, email, password }
    })
    if (!created) {
      err.statusCode = 400
      err.message = '帳號已存在，請登入'
      throw err
    }
    res.json({
      Status: 'Success',
      Message: '註冊成功，請先登入'
    })
  } catch (error) {
    next(error)
  }
})

// signin
router.post('/signin', passport.authenticate('local', { session: false }), async (req, res, next) => {
  // #swagger.tags = ['User']
  /*  #swagger.parameters['obj'] = {
      in: 'body',
      description: '登入',
      schema: {
          $email: 'test1@test.com',
          $password: '123',
      }
} */

  try {
    // delete private info
    delete req.user.password
    // sign a HS256 algorithm token
    const token = jwt.sign(req.user, 'key', { expiresIn: '30d' })
    res.status(200).json({
      status: 'Success',
      token: token,
      data: req.user
    })
  } catch (error) {
    next(error)
  }
})

// homepage
router.get('/index', async (req, res, next) => {
  // #swagger.tags = ['Index']

  passport.authenticate('jwt', { session: false }, (error, user) => {
    // custom err
    const err = new Error()
    // 500 status code
    if (error) {
      next(error)
    }
    if (!user) {
      console.log('user', user)
      err.statusCode = 401
      err.message = '尚未登入，請先登入'
      next(err)
    }
    req.user = user
    next()
  })(req, res, next)
}, (req, res, next) => {
  try {
    res.json('使用成功')
  } catch (error) {
    next(error)
  }
})

module.exports = router
