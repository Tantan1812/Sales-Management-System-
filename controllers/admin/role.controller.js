const Roles = require("../../models/role.model")
const systemConfig = require("../../config/system.js")

//1. [GET] admin/roles
module.exports.index = async (req, res)=>{
    const find = {
        deleted: false
    }
    const records = await Roles.find(find)
    res.render("admin/pages/roles/index.pug", {
        pageTitle: "Nhóm quyền",
        records: records
    })
}

//2. 
// [GET] admin/roles/create
module.exports.create = async (req, res)=>{
    const find = {
        deleted: false
    }
    const records = await Roles.find(find)
    res.render("admin/pages/roles/create.pug", {
        pageTitle: "Tạo nhóm quyền",
        records: records
    })
}

//[POST] admin/roles/create
module.exports.createPost = async (req, res)=>{
    const userRole =  new Roles(req.body)
    await userRole.save()
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
}

//3. Chi tiết, xóa, sửa
//[GET] admin/roles/detail
module.exports.detail = async (req, res)=>{
    const find = {
        _id: req.params.id,
        deleted: false
    }
    const records = await Roles.findOne(find)
    res.render("admin/pages/roles/detail.pug", {
        pageTitle: "Chi tiết nhóm quyền",
        records: records
    })
}

//[GET] admin/roles/edit
module.exports.edit = async (req, res)=>{
    const find = {
        _id: req.params.id,
        deleted: false
    }
    const records = await Roles.findOne(find)
    res.render("admin/pages/roles/edit.pug", {
        pageTitle: "Sửa nhóm quyền",
        records: records
    })
}

//[PATCH] admin/roles/editPatch
module.exports.editPatch = async (req, res)=>{
    try {
        await Roles.updateOne({_id: req.params.id}, req.body);
        req.flash('success', 'Cập nhập thành công');
    } catch (error){
        req.flash('error', 'Lỗi cập nhập!');
    }
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
}

//[DELETE] admin/roles/delete/:id
module.exports.deletePermisson = async (req, res)=>{
    const id = req.params.id

    //Xóa mềm (thay đổi thuộc tính delete = true/false để hiển thị lên giao diện)
    await Roles.updateOne({_id: id}, {
        deleted: true
    })

    //Xóa cứng (xóa luôn trong database)
    //await Product.deleteOne({_id: id})
    req.flash('success', 'Sản phẩm đã được xóa!');
    res.redirect('back')
}

//4. Nhóm quyền
//[GET] admin/roles/permissions
module.exports.permissions = async (req, res)=>{
    const find = {
        deleted: false
    }
    const records = await Roles.find(find)

    res.render("admin/pages/roles/permissions.pug", {
        pageTitle: "Phân quyền",
        records: records
    })
}

//[PATCH] admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    const permissions = JSON.parse(req.body.permissions);
    // console.log(permissions)
    for (const item of permissions) {
        // console.log("item", item)
        await Roles.updateOne({ _id: item.id }, {permissions: item.permission});
    }
    req.flash('success', 'Cập nhập thành công!');
    res.redirect("back")
};
