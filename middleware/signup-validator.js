
const validator = require('validator')

function signupValidator (req, res, next) {
  try {
    const err = new Error()
    const message = []
    const { name, email, password, checkPassword } = req.body

    // 確認欄位是否為空或未填寫
    if (!name.trim() || !email.trim() || !password.trim() || !checkPassword.trim()) message.push('欄位皆需填寫、內容不可為空白鍵')
    // 確認 email 格式: 'test@test.com'
    if (!validator.isEmail(email)) message.push('email 格式錯誤')
    // 檢查密碼與確認密碼是否相符
    if (password !== checkPassword) message.push('密碼與確認密碼不符')
    // 有錯誤
    if (message.length) {
      err.statusCode = 400
      err.message = message
      throw err
    }
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = signupValidator
