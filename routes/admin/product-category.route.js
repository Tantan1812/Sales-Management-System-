const express = require('express')
const router = express.Router()

const multer  = require('multer'); //Thư viện để upload ảnh
const upload = multer() 

const controller = require("../../controllers/admin/product-category.controller")
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js")
const validate = require("../../validate/admin/product-category.validate.js")

//Tranh chủ
router.get('/', controller.index)

//Tạo danh mục
router.get('/create', controller.create)
router.post('/create',
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost)


//Chỉnh sửa sản phẩm
router.get('/edit/:id', controller.edit) 

router.patch('/edit/:id', 
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    controller.editPatch) 

//Chi tiết sản phẩm
router.get('/detail/:id', controller.detail)

//Xóa sản phẩm
router.delete('/delete/:id', controller.deleteItem) 
    
module.exports = router