require('dotenv').config()

const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const signupValidator = require('../../middleware/signup-validator')
const auth = require('../../middleware/auth.js')
const userController = require('../../controllers/userController')
const productController = require('../../controllers/productController')

// users
router.post('/users/signup', signupValidator, userController.signup)
router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signin)

// homepage
router.get('/index', auth.tokenAuth, (req, res, next) => {
  // #swagger.tags = ['Index']
  try {
    res.json('使用成功')
  } catch (error) {
    next(error)
  }
})

// products
router.get('/products', productController.getProducts)
router.get('/products/subcategories/:id', productController.getTypeProduct)
router.get('/products/search', productController.searchProducts)
router.get('/products/:id', productController.getProduct)

module.exports = router
