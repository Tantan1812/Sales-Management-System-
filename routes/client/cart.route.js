const express = require('express')
const router = express.Router()

const controller = require("../../controllers/client/cart.controller.js")

router.get('/', controller.index)

router.get('/delete/:productId', controller.deleteProduct)

router.get('/update/:productId/:quantity', controller.updateProduct)

router.post('/add/:productId', controller.addPost)

module.exports = router