const Account = require("../../models/account.model.js")
const Role = require("../../models/role.model.js")
const systemConfig = require("../../config/system.js")
const { application } = require("express")

//Tạo middleware để kiếm tra nếu có token thì mưới cho đăng nhập vô xem các trang
module.exports.requireAuth = async(req, res, next)=>{
    //Lấy token trong cookies
    if(!req.cookies.token){
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
    }else{
        const user = await Account.findOne({token: req.cookies.token}).select("-password")
        if(!user){
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
        }else{
            const role = await Role.findOne({
                _id: user.role_id
            }).select("title permissions")
            //Trả thông tin user và role về cho frontend
            res.locals.user = user;
            res.locals.role = role;
            next()
        }
    }
}