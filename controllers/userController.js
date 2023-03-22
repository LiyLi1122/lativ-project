const jwt = require('jsonwebtoken')
const { Users } = require('../models')
const bcryptjs = require('bcryptjs')

module.exports = {
  signin: async (req, res, next) => {
    // #swagger.tags = ['User']
    /* #swagger.requestBody = {
              required: true,
              "@content": {
                  "application/json": {
                      schema: {
                          type: "object",
                          properties: {
                              email: {
                                  type: "string"
                              },
                              password: {
                                  type: "string",
                              }
                          },
                          required: ["email", "password"]
                      },
                      example: {
                          email: "test1@test.com",
                          password: "123"
                      }
                  }
              }
          }
      */
    // #swagger.responses[200] = { description: '成功登入' }
    // #swagger.responses[400] = { description: '缺少登入必要資料/輸入錯誤資料' }
    // #swagger.responses[500] = { description: '伺服器錯誤' }

    try {
      console.log('---- /signin ---- ')

      // delete private info
      delete req.user.password
      // sign a HS256 algorithm token
      const token = jwt.sign(req.user, process.env.JWT_KEY, { expiresIn: '30d' })
      res.status(200).json({
        token: token,
        data: req.user
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
  },
  signup: async (req, res, next) => {
    // #swagger.tags = ['User']
    /* #swagger.requestBody = {
          required: true,
          "@content": {
              "application/json": {
                  schema: {
                      type: "object",
                      properties: {
                          name: {
                              type: "string"
                          },
                          email: {
                              type: "string"
                          },
                          password: {
                              type: "string",
                          },
                          checkPassword: {
                              type: "string",
                          }
                      },
                      required: ["name", "email", "password", "checkPassword"]
                  },
              }
          }
      }
  */
    // #swagger.responses[201] = { description: '註冊成功' }
    // #swagger.responses[400] = { description: '缺少註冊必要資料/資料格式錯誤/已經註冊過' }
    // #swagger.responses[500] = { description: '伺服器錯誤' }
    try {
      console.log('---- /signup ---- ')
      const err = new Error()
      const { name, email, password } = req.body
      const [user, created] = await Users.findOrCreate({
        where: { email },
        defaults: { name, email, password: bcryptjs.hashSync(password, 10) }
      })
      if (!created) {
        err.statusCode = 400
        err.message = '帳號已存在，請登入'
        throw err
      }
      res.status(201).json({
        Message: '註冊成功，請先登入'
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}
