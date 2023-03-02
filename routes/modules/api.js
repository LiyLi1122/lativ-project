require('dotenv').config()

const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const signupValidator = require('../../middleware/signup-validator')
const userController = require('../../controllers/userController')
const productController = require('../../controllers/productController')
const { tokenAuth } = require('../../middleware/auth')

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

// products
router.get('/products', tokenAuth, productController.getProducts)
router.get('/products/subcategories/:id', tokenAuth, productController.getTypeProduct)
router.get('/products/search', tokenAuth, productController.searchProducts)
router.get('/products/:id', tokenAuth, productController.getProduct)

module.exports = router
