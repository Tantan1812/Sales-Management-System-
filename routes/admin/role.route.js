const express = require('express')
const router = express.Router()

const controller = require("../../controllers/admin/role.controller.js")

//Trang chính
router.get('/', controller.index) 

//1.Tạo nhóm quyền
router.get('/create', controller.create) 
router.post('/create', controller.createPost) 

//Chi tiết
router.get('/detail/:id', controller.detail) 

//Sửa
router.get('/edit/:id', controller.edit) 
router.patch('/edit/:id', controller.editPatch) 

//xóa
router.delete('/delete/:id', controller.deletePermisson) 

//2. Phân quyền
router.get('/permissions', controller.permissions) 
router.patch('/permissions', controller.permissionsPatch) 

module.exports = router

