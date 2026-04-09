const express = require('express')
const router = express.Router()

const multer  = require('multer'); //Thư viện để upload ảnh
const upload = multer()

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js")

const controller = require("../../controllers/client/user.controller.js")
const validate = require("../../validate/client/user.validate.js") 
const authMiddleware = require("../../middlewares/client/auth.middleware.js")

router.get('/register', controller.register)

router.post('/register',validate.registerPost, controller.registerPost)


router.get('/login', controller.login)
router.post('/login',validate.loginPost, controller.loginPost)

router.get('/logout', controller.logout)

router.get('/password/forgot', controller.forgotPassword)
router.post('/password/forgot',validate.forgotPasswordPost, controller.forgotPasswordPost)

router.get('/password/otp', controller.otpPassword)
router.post('/password/otp', controller.otpPasswordPost)

router.get('/password/reset', controller.resetPassword)
router.post('/password/reset',validate.resetPasswordPost, controller.resetPasswordPost)

router.get('/info',authMiddleware.requireAuth, controller.infoUser)

router.get('/edit', 
    controller.editInfoUser)
router.patch('/edit',
    upload.single('avatar'), 
    uploadCloud.upload,
    authMiddleware.requireAuth, 
    controller.editInfoUserPatch)


module.exports = router