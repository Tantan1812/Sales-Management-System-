const Product = require("../../models/product.model.js")
const ProductCategory = require("../../models/product-category.model")
const filterStatusHelper = require("../../helpers/filterStatus.js")
const searchHelper = require("../../helpers/search.js")
const paginationHelper = require("../../helpers/pagination.js")
const systemConfig = require("../../config/system.js")
const createTreeHelper = require("../../helpers/createTree")
const Account = require("../../models/account.model.js")
//1. [GET] /admin/products
module.exports.index = async (req, res)=>{
    //1. Xử lý lọc sản phẩm
    let filterStatus = filterStatusHelper(req.query)//Trả về mảng nút bấm đã được xử lý logic

    //console.log(req.query.status)//người dùng truy cập vào paragam http://localhost:3000/admin/products?status=active
    // nó sẽ lấy status: "active" gán cho biến query trong object req
    let find = {
        deleted: false
    };
    if(req.query.status){
        find.status = req.query.status//Add thêm 1 key=value vô object find{} là status: "Trạng thái...vv"
    }
    
    //2. Xử lý tìm kiếm sản phẩm
    let objectSearch = searchHelper(req.query)
    if(objectSearch.regex){
        find.title = objectSearch.regex
    }

    //3. Phân trang (Pagination)
    const countProducts = await Product.countDocuments(find)
    let objectPagination = paginationHelper({
        curentPage: 1,
        limitItem: 4
    }, req.query, countProducts)

    //4. Xử lý sắp xếp sản phẩm theo các tiêu chí
    let sort = {}
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue
    }else{
        sort.position = "desc"
    }

    //Render ra giao diện
    const products = await Product.find(find)
                                  .sort(sort)
                                  .limit(objectPagination.limitItem)
                                  .skip(objectPagination.skip) //limit: giới hạn SL sản phẩm mỗi trang, skip: số sản phẩm bỏ qua 
    for (const product of products){
        //Lấy ra thông tin người tạo  
        const user = await Account.findOne({
            _id: product.createdBy.account_id
        })
        if(user){
            product.accountFullname = user.fullName
            // console.log("O day" ,user)
        }
        // console.log("product", i, product)
        //Lấy ra thông tin người sửa
        const updatedBy = product.updatedBy[product.updatedBy.length - 1];
        // console.log("updatedBy" ,updatedBy)
        if(updatedBy){
            const userUpdated = await Account.findOne({
                _id: updatedBy.account_id
            })
            updatedBy.accountFullname = userUpdated.fullName
        }
    }

    
    res.render("admin/pages/products/index.pug", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination,
    })
}

//---------------------------------------------------------------------
//1. [PATCH] /admin/products/change-status/:status/:id  (Thay đổi trạng thái hoạt động của 1 sản phẩm)
module.exports.changeStatus = async (req, res) =>{
    const status = req.params.status
    const id = req.params.id

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    await Product.updateOne({_id: id}, {
        status: status,
        $push: {updatedBy: updatedBy}
    })//Cập nhập thay đổi vào database
    
    req.flash('success', 'Cập nhập thành công!');//Thông báo khi cập nhập
    
    res.redirect('back')// được sử dụng để chuyển hướng người dùng trở lại trang trước đó mà họ vừa truy cập.
}

//2. [PATCH] /admin/products/change-multi/:status/:id  (Thay đổi trạng thái hoạt động/dừng hoạt động/xóa sản phẩm/ Thay đổi vị trí) -> của nhiều sản phẩm
module.exports.changeMulti = async (req, res) =>{
    let type = req.body.type
    let ids = (req.body.ids).split(",")

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, {
                status: "active",
                $push: {updatedBy: updatedBy}
            })
            req.flash('success', 'Cập nhập thành công!');
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, {
                status: "inactive",
                $push: {updatedBy: updatedBy}
            })
            req.flash('success', 'Cập nhập thành công!');
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                // deletedAt: new Date(),
                deletedBy: {
                    account_id: res.locals.user.id,
                    deletedAt: new Date(), 
                }
            });
            req.flash('success', 'Sản phẩm đã được xóa!');
            break;
        case "change-position":
            for (const element of ids) {
                const [id, position] = element.split("-"); //destructering
                await Product.updateOne(
                    { _id: id },  
                    { 
                        position: parseInt(position),
                        $push: {updatedBy: updatedBy}
                    }
                );
            }
            req.flash('success', 'Thay đổi vị trí thành công!');
            break
        default:
            break;
    }
    res.redirect('back')
}


//---------------------------------------------------------------------
//3. [DELETE] /admin/products/delete/:id (Xóa 1 sản phẩm)
module.exports.deleteItem = async (req, res)=>{
    const id = req.params.id

    //Xóa mềm (thay đổi thuộc tính delete = true/false để hiển thị lên giao diện)
    await Product.updateOne({_id: id}, {
        deleted: true,
        // deletedAt: new Date()//Thời gian xóa sản phẩm
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(), 
        }
    })

    //Xóa cứng (xóa luôn trong database)
    //await Product.deleteOne({_id: id})
    req.flash('success', 'Sản phẩm đã được xóa!');
    res.redirect('back')
}

//---------------------------------------------------------------------
//4. Thùng rác
// [PATCH] /admin/products/trash (router nay để render thùng rác ra giao diện)
module.exports.trash = async (req, res)=>{
    const deletedProducts = await Product.find({deleted: true})
    // console.log(deletedProducts)
    res.render("admin/pages/products/trash.pug", {
        pageTitle: "Danh sách sản phẩm bị xóa",
        deletedProducts: deletedProducts || []
    })
}
// [PATCH] "/admin/products/trash/:require/:id" (router này để khôi phục hoặc xóa vĩnh viễn trong thùng rác)
module.exports.requireTrash = async (req, res)=>{
    const deletedProducts = await Product.find({deleted: true})

    const require = req.params.require
    const id = req.params.id

    if(require=="restore"){
        await Product.updateOne({_id: id}, {deleted: false})
        req.flash('success', 'Khôi phục thành công!');
    }
    else if(require=="delete"){
        await Product.deleteOne({_id: id})
        req.flash('success', 'Sản phẩm đã được xóa!');
    }
    res.redirect('back')
}

//---------------------------------------------------------------------
//5. Tạo mới 1 sản phẩm
// [GET] "/admin/products/create" (router để render ra giao diện)
module.exports.create = async (req, res)=>{
    let find = {
        deleted: false
    };
    const category = await ProductCategory.find(find)
    const newCategory = createTreeHelper.tree(category)
    // //console.log(newCategory)
    // console.log(category)

    res.render("admin/pages/products/create.pug", {
        pageTitle: "Thêm mới sản phẩm",
        category: newCategory
    })
}

// [POST] "/admin/products/create" (router để gửi in4 sản phẩm lên server)
module.exports.createPost = async (req, res)=>{
     console.log(req.file)

    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)

    if(req.body.position == ""){
        const countProducts = await Product.countDocuments({})
        req.body.position = countProducts + 1
    }else{
        req.body.position = parseInt(req.body.position)
    }

    req.body.createdBy = {
        account_id: res.locals.user.id 
    }
    
    //Tạo mới 1 sản phẩm với data lấy từ "req.body"
    const product = new Product(req.body)
    //Lưu sản phẩm vào database
    await product.save()

    res.redirect(`${systemConfig.prefixAdmin}/products`)
}

//---------------------------------------------------------------------
//6. Chỉnh sửa sản phẩm
//[GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
      const find = {
        deleted: false,
        _id: req.params.id
      };
  
      const product = await Product.findOne(find);
      const records = await ProductCategory.find({
        deleted: false
      })
      const newRecords = createTreeHelper.tree(records)
      
      res.render('admin/pages/products/edit', {
        pageTitle: 'Chỉnh sửa sản phẩm',
        product: product,
        records: newRecords
      });
    } catch (error) {
      res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
  };
  
//[PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res)=>{
    const productId = req.params.id;

    req.body.price = parseInt(req.body.price),
    req.body.discountPercentage = parseInt(req.body.discountPercentage),
    req.body.stock = parseInt(req.body.stock),
    req.body.position = parseInt(req.body.position)

    // Kiểm tra nếu có file ảnh mới được upload
    // console.log("o day nha", req.body)
    // if (req.file) {
    //     req.body.thumbnail = `/uploads/${req.file.fieldname}`; // Đường dẫn ảnh mới
    //     console.log("o day nha", req.body.thumbnail)
    // }
    // Cập nhật sản phẩm
    try {
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }
        await Product.updateOne({_id: productId}, {
            ...req.body,
            $push: {updatedBy: updatedBy}
        });

        req.flash('success', 'Cập nhập thành công');
    } catch (error){
        req.flash('error', 'Lỗi cập nhập!');
    }
    res.redirect(`${systemConfig.prefixAdmin}/products`)
}

//---------------------------------------------------------------------
//6. Chi tiết sản phẩm
module.exports.detail = async (req, res)=>{
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

    const product = await Product.findOne(find);
    
    res.render('admin/pages/products/detail', {
        pageTitle: product.title,
        product: product
    });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}

//---------------------------------------------------------------------
