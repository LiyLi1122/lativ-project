require('dotenv').config()

const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const bcryptjs = require('bcryptjs')
const { Users } = require('../models')

const jwtOptions = {
  // commend to extract token from request
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_KEY
}
// register local strategy in passport
passport.use(new LocalStrategy(
  {
    usernameField: 'email'
  },
  async function (email, password, done) {
    try {
      console.log(`--- passport.js email: ${email}, password:${password} ---`)
      const err = new Error()
      if (!email || !password) {
        err.statusCode = 401
        err.message = '要填寫'
        throw err
      }

      const user = await Users.findOne({ where: { email } })
      if (!user) {
        err.statusCode = 400
        err.message = '帳戶不存在'
        throw err
      }
      const isMatch = await bcryptjs.compare(password, user.password)
      if (!isMatch) {
        err.statusCode = 400
        err.message = '密碼錯誤'
        throw err
      }
      done(null, user.toJSON())
    } catch (error) {
      console.log(error)
      done(error)
    }
  }))

// register JWT strategy in passport
passport.use(new JWTStrategy(jwtOptions, async (jwtpayload, done) => {
  try {
    console.log(`--- passport.js jwtpayload: ${jwtpayload} ---`)
    const user = await Users.findByPk(jwtpayload.id)

    if (!user) done(null, false)
    done(null, user.toJSON())
  } catch (error) {
    console.log(error)
    done(error)
  }
}))

// register FACEBOOK strategy in passport
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_KEY,
  callbackURL: process.env.CALLBACK_URL,
  profileFields: ['displayName', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log(`--- passport.js profile: ${profile} ---`)
    const { name, email } = profile._json
    const password = Math.random().toString(36).slice(-8)
    const [user] = await Users.findOrCreate({
      where: { email },
      defaults: { name, email, password: bcryptjs.hashSync(password, 10) }
    })
    if (user) done(null, user.toJSON())
  } catch (error) {
    console.log(error)
    done(error)
  }
}))

module.exports = passport
