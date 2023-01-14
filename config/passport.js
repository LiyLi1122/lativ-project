const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const bcryptjs = require('bcryptjs')
const { User } = require('../models')

const jwtOptions = {
  // commend to extract token from request
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'key'
}

passport.use(new LocalStrategy(
  {
    usernameField: 'email'
  },
  async function (email, password, done) {
    try {
      const err = new Error()
      if (!email || !password) {
        err.statusCode = 401
        err.message = '要填寫'
        throw err
      }

      const data = await User.findOne({ where: { email } })
      if (!data) {
        err.statusCode = 400
        err.message = '帳戶不存在'
        throw err
      }
      const isMatch = await bcryptjs.compare(password, data.password)
      if (!isMatch) {
        err.statusCode = 401
        err.message = '密碼錯誤'
        throw err
      }
      done(null, data.toJSON())
    } catch (error) {
      done(error)
    }
  }))

passport.use(new JWTStrategy(jwtOptions, async (jwtpayload, done) => {
  try {
    const err = new Error()
    const data = await User.findByPk(jwtpayload.id)
    if (!data) {
      err.statusCode = 401
      err.message = '尚未登入，請先登入'
      throw err
    }
    done(null, data)
  } catch (error) {
    done(error)
  }
}))

module.exports = passport
