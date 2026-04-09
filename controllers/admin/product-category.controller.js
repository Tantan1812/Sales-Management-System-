const ProductCategory = require("../../models/product-category.model")
const systemConfig = require("../../config/system")
const createTreeHelper = require("../../helpers/createTree")

//1. [GET] /admin/products-category
module.exports.index = async (req, res)=>{
    let find = {
        deleted: false
    };
    const records = await ProductCategory.find(find)
    const newRecords = createTreeHelper.tree(records)

    res.render("admin/pages/products-category/index.pug", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords
    })
}

//2. Tạo danh mục
//[GET] /admin/products-category/create
module.exports.create = async (req, res)=>{
    let find = {
        deleted: false
    }
    const records = await ProductCategory.find(find)
    const newRecords = createTreeHelper.tree(records)
    //console.log(newRecords)

    res.render("admin/pages/products-category/create.pug", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords
    })
}

//[POST] /admin/products-category/create
module.exports.createPost = async (req, res)=>{
    // const permissions = res.locals.role.permissions
    // if (permissions.includes('products-category_create')){

    // }else{
    //     return
    // }
    if(req.body.position == ""){
        const countProducts = await ProductCategory.countDocuments()
        req.body.position = countProducts + 1
    }else{
        req.body.position = parseInt(req.body.position)
    }

    const records = new ProductCategory(req.body)
    await records.save()
    req.flash('success', 'Tạo thành công!');
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
}

//3. Chỉnh sửa 1 sản phẩm
//[GET] Aadmin/products-category/edit/:id
module.exports.edit = async (req, res)=>{
    const find = {
        _id: req.params.id,
        deleted: false
    }
    const product = await ProductCategory.findOne({
        _id: req.params.id,
        deleted: false
    })

    const records = await ProductCategory.find({
        deleted: false
    })
    const newRecords = createTreeHelper.tree(records)

    res.render("admin/pages/products-category/edit.pug",{
        pageTitle: "Trang sửa sản phẩm",
        product: product,
        records: newRecords
    })
}

module.exports.editPatch = async (req, res)=>{
    req.body.position = parseInt(req.body.position)

    try {
        await ProductCategory.updateOne({_id: req.params.id}, req.body )
        req.flash('success', 'Cập nhập thành công!');
        res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    } catch (error) { 
        console.error('Error updating product:', error);
        req.flash('error', 'Cập nhật không thành công!');
        return res.redirect('back');
    }
}


//4. chi tiết 1 sản phẩm
//[GET] admin/products-category/detail/:id
module.exports.detail = async (req, res)=>{
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

    const product = await ProductCategory.findOne(find);
    
    res.render('admin/pages/products-category/detail', {
        pageTitle: product.title,
        product: product
    });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
}

//5. [DELETE] xóa 1 sản phẩm
module.exports.deleteItem = async (req, res) =>{
    const id = req.params.id

    await ProductCategory.updateOne({_id: id}, {
        deleted: true
    })

    //Xóa cứng (xóa luôn trong database)
    //await Product.deleteOne({_id: id})
    req.flash('success', 'Sản phẩm đã được xóa!');
    res.redirect('back')
}
