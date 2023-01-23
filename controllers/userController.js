const jwt = require('jsonwebtoken')
const { User } = require('../models')
const bcryptjs = require('bcryptjs')

module.exports = {
  signin: async (req, res, next) => {
    // #swagger.tags = ['User']
    /* #swagger.parameters['obj'] =
      {
        in: 'body',
        description: '登入',
        schema: {
            $email: 'test1@test.com',
            $password: '123',
        }
      }
    */

    try {
      console.log('--------------我是 /signin ------------ ')
      // delete private info
      delete req.user.password
      // sign a HS256 algorithm token
      const token = jwt.sign(req.user, process.env.JWT_KEY, { expiresIn: '30d' })
      res.status(200).json({
        status: 'Success',
        token: token,
        data: req.user
      })
    } catch (error) {
      next(error)
    }
  },
  signup: async (req, res, next) => {
    // #swagger.tags = ['User']
    /* #swagger.parameters['obj'] =
      {
        in: 'body',
        description: '註冊',
        schema: {
            $name: 'Blake Well',
            $email: 'test1@test.com',
            $password: '123',
            $checkPassword: '123'
        }
      }
    */

    try {
      console.log('--------------我是 /signup ------------ ')
      const err = new Error()
      const { name, email, password } = req.body
      const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: { name, email, password: bcryptjs.hashSync(password, 10) }
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
  }
}
