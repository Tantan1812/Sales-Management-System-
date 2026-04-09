const express = require('express')
const router = express.Router()

//------------------------------------------------------------------------
// const storageMulter = require("../../helpers/storageMulter")
const multer  = require('multer'); //Thư viện để upload ảnh
const upload = multer() //Truyền vào giá trị trả về của hàm storageMulter() để multer biết cách xử lý file upload (lưu ở đâu, tên file như thế nào).

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js")

//------------------------------------------------------------------------
const controller = require("../../controllers/admin/product.controller.js")

const validate = require("../../validate/admin/product.validate.js")

router.get('/', controller.index) //gửi chuỗi này về file index.route.js và nó sẽ lấy: chuỗi bên đó + chuỗi bên này gửi qua

router.patch('/change-status/:status/:id', controller.changeStatus)//Node ký hiệu ":" để truyền data động, tức ta nhập gì trên url nso sẽ lấy cái status và gán vào status này. id cũng vậy
                                                                   // Sử dụng URL với dynamic parameters, Với cách này, dữ liệu như status và id sẽ được truyền qua URL
                                                                   // ta nhận giá trị như status và id từ: req.params
router.patch('/change-multi', controller.changeMulti) //Gửi dữ liệu status và id qua body của request, không phải qua URL. Điều này thường được dùng khi dữ liệu cần truyền phức tạp hoặc có nhiều giá trị
                                                      //ta nhận giá trị như status và id từ: req.body
router.delete('/delete/:id', controller.deleteItem)    

//Tại mới sản phẩm (tách ra 2 router: get (để render ra giao diện), post (để gửi in4 sản phẩm lên server))
router.get('/create', controller.create) //Lúc bấm +Thêm mới thì nó chạy vào router này [GET]

router.post(
    '/create', 
    upload.single('thumbnail'),  //Middleware để xử lý một file upload từ form HTML có trường thumbnail
    uploadCloud.upload,
    validate.createPost,//Middleware được dùng để kiểm tra và xử lý các điều kiện trước khi request đến controller chính là: controller.createPost
    controller.createPost //controller chính. Nó chỉ được gọi khi tất cả các middleware trước đó đã hoàn thành và không có lỗi.
)// Khi submit (Tạo mới) cái form lên server thì nó chạy vào router này [POST]

//Sửa sản phẩm
router.get('/edit/:id', controller.edit)
router.patch('/edit/:id',
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    controller.editPatch
)

//Chi tiết sản phẩm detail
router.get('/detail/:id', controller.detail)

//Thùng rác
router.get("/trash", controller.trash)

router.patch('/trash/:require/:id', controller.requireTrash);

//export
module.exports = router

