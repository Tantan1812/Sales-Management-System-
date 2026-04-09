const User = require("../../models/user.model.js")

//Tạo middleware để kiếm tra nếu có token thì mưới cho đăng nhập vô xem các trang
module.exports.requireAuth = async(req, res, next)=>{
    //Lấy token trong cookies
    if(!req.cookies.tokenUser){
        res.redirect(`/user/login`)
        return
    }
    const user = await User.findOne({
        tokenUser: req.cookies.tokenUser
    })

    if(!user){
        res.redirect(`/user/login`)
        return
    }
    next()
}