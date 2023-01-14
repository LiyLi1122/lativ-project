const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const apiErrorHandler = require('../middleware/api-error-handler')
const jwt = require('jsonwebtoken')

// signin
router.post('/signin', passport.authenticate('local', { session: false }), (req, res, next) => {
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
router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  try {
    res.json('yes')
  } catch (error) {
    next(error)
  }
})

router.use(apiErrorHandler)

module.exports = router
