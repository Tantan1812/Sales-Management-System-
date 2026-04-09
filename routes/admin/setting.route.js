const express = require('express')
const router = express.Router()

const controller = require("../../controllers/admin/setting.controller.js")
const multer  = require('multer'); //Thư viện để upload ảnh
const upload = multer() //Truyền vào giá trị trả về của hàm storageMulter() để multer biết cách xử lý file upload (lưu ở đâu, tên file như thế nào).

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js")

//Trang chính
router.get('/general', controller.general) 
router.patch('/general',
    upload.single('logo'),  //Middleware để xử lý một file upload từ form HTML có trường thumbnail
    uploadCloud.upload,
    controller.generalPatch) 

module.exports = router

