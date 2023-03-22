require('dotenv').config()

const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const signupValidator = require('../../middleware/signup-validator')
const userController = require('../../controllers/userController')
const productController = require('../../controllers/productController')
const { tokenAuth } = require('../../middleware/auth')
const shoppingCartController = require('../../controllers/shoppingCartController')

// users
router.post('/users/signup', signupValidator, userController.signup)
router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signin)

// homepage
router.get('/index', tokenAuth, (req, res, next) => {
  // #swagger.tags = ['Index']
  try {
    res.json('使用成功')
  } catch (error) {
    next(error)
  }
})

// payment
// 前往結帳的按鈕
router.get('/shoppingCart', tokenAuth, shoppingCartController.getShoppingCart)
// 最後追加購物車內容 & 確認
router.post('/shoppingCart', tokenAuth, shoppingCartController.shoppingCartCheck)
// 接綠界金流結帳後的 ReturnURL
router.post('/shoppingCart/callback', shoppingCartController.getPaymentCallback)
// 接綠界金流 OrderResultURL 給前端 res.json (for 要自訂付款成功頁面)
// router.post('/shoppingCart/result', shoppingCartController.getPaymentResult)

// products
router.get('/products', productController.getProducts)
router.get('/products/subcategories/:id', productController.getTypeProduct)
router.get('/products/search', productController.searchProducts)
router.get('/products/:id', productController.getProduct)

module.exports = router
