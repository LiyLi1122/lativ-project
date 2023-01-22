const passport = require('../config/passport')

module.exports = {
  // 檢查 token 是否
  tokenAuth: async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (error, user) => {
      const err = new Error()
      // 500 server problem
      if (error) {
        next(error)
      }
      // 客製化 error
      if (!user) {
        err.statusCode = 401
        err.message = '尚未登入，請先登入'
        next(err)
      }
      req.user = user
      next()
    })(req, res, next)
  }
}
