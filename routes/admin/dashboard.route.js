const express = require('express')
const router = express.Router()

const controller = require("../../controllers/admin/dashboard.controller.js")

router.get('/', controller.dashboard) //gửi chuỗi này về file index.route.js và nó sẽ lấy: chuỗi bên đó + chuỗi bên này gửi qua

module.exports = router