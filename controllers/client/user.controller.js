const md5 = require("md5")
const User = require("../../models/user.model.js")
const ForgotPassword = require("../../models/forgot-password.model.js")
const generateHelper = require("../../helpers/generate.js") 
const sendMailHelper = require("../../helpers/sendMail.js") 
const Cart = require("../../models/cart.model.js")

// [GET] /user/register
module.exports.register = async(req, res)=>{
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản",
    })
}

//[POST] /user/register
module.exports.registerPost = async(req, res)=>{
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    })

    if(existEmail){
        req.flash('error', 'Email đẫ tồn tại!');
        res.redirect("back")
        return;
    }

    req.body.password = md5(req.body.password)

    const user = new User(req.body)
    await user.save()

    // console.log(user)
    res.cookie("tokenUser", user.tokenUser)
    req.flash('success', 'Đăng ký tài khoản thành công!');

    res.redirect("/") 
}


//[GET] user/login
module.exports.login = async(req, res)=>{
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập tài khoản",
    })
}

//[POST] user/login
module.exports.loginPost = async(req, res)=>{
    const email = req.body.email
    const password = req.body.password

    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if(!user){
        req.flash('error', 'Email không tồn tại!');
        res.redirect("back")
        return;
    }

    if(md5(password) != user.password){
        req.flash('error', 'Mật khẩu không chính xác!');
        res.redirect("back")
        return;
    }

    if(user.status == "inactive"){
        req.flash('error', 'Tài khoản của bạn đã bị khóa!');
        res.redirect("back")
        return;
    }

    // console.log(req.body)
    res.cookie("tokenUser", user.tokenUser)

    await User.updateOne({
        _id: user.id
    },{
        statusOnline: "online"
    })

    _io.once('connection', (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_ONLINE", user.id)
    })

    //lưu user_id vào model carts
    await Cart.updateOne({
        _id: req.cookies.cartId
    },{
        user_id: user.id
    })
    res.redirect("/")
}


//[GET] user/logout
module.exports.logout = async(req, res)=>{
    await User.updateOne({
        _id: res.locals.user.id
    },{
        statusOnline: "offline"
    })

    _io.once('connection', (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_OFFLINE", res.locals.user.id)
    })

    res.clearCookie("tokenUser")
    res.redirect("/")
}


//[GET] user/password/forgot
module.exports.forgotPassword = async(req, res)=>{
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Quên mật khẩu",
    })
}

//[POST] user/password/forgot
module.exports.forgotPasswordPost = async(req, res)=>{
    const email = req.body.email
    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if(!user){
        req.flash('error', 'Email không tồn tại!');
        res.redirect("back")
        return;
    }

    //Việc 1: Tạo mã OTP và lưu OPT, email vào collection forgot-password
    const otp = generateHelper.generateRandomNumber(6)
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: new Date(Date.now() + 180 * 1000) // 180 giây sau
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword)
    await forgotPassword.save()

    //console.log(objectForgotPassword)
    //Việc 2: Gửi mã OTP qua email cho người dùng bằng thư viện "npm i nodemailer"
    const subject = `Mã OTP xác minh lấy lại mật khẩu`;
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; text-align: center;">
            <div style="max-width: 500px; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333;">Xác minh tài khoản</h2>
                <p style="font-size: 16px; color: #555;">Mã xác minh tài khoản của bạn là:</p>
                <p style="font-size: 24px; font-weight: bold; color: #e63946; margin: 10px 0;">${otp}</p>
                <p style="font-size: 14px; color: #777;">Có hiệu lực trong 3 phút.</p>
                <p style="font-size: 14px; color: red; font-weight: bold;">KHÔNG chia sẻ mã này với người khác.</p>
            </div>
        </div>
    `;

    sendMailHelper.sendMail(email, subject, html);


    res.redirect(`/user/password/otp?email=${email}`)
}

//[GET] trang nhập mã otp /user/password/otp
module.exports.otpPassword = async(req, res)=>{
    const email = req.query.email
    res.render("client/pages/user/otp-password", {
        pageTitle: "Nhập mã OTP",
        email: email
    })
}
//[POST] /user/password/otp
module.exports.otpPasswordPost = async(req, res)=>{
    const email = req.body.email
    const otp = req.body.otp

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })

    // console.log(result)
    if(!result){
        req.flash('error', 'OTP không hợp lệ!');
        res.redirect("back")
        return;
    }

    const user = await User.findOne({
        email: email
    })

    res.cookie("tokenUser", user.tokenUser)
    res.redirect("/user/password/reset")
}

//Reset lại mật khẩu
//[GET] user/password/reset
module.exports.resetPassword = async(req, res)=>{
    res.render("client/pages/user/reset-password", {
        pageTitle: "Đổi mật khẩu",
    })
}

// [POST] /user/password/reset
module.exports.resetPasswordPost = async(req, res)=>{
    const password = req.body.password
    const tokenUser = req.cookies.tokenUser

    await User.updateOne(
        {
            tokenUser:tokenUser
        },
        {
            password: md5(password)
        }
    )
    req.flash('success', 'Đổi mật khẩu thành công.');
    res.redirect("/")
}

/*
email: truongtienanh16@gmail.com
password: 12345
*/

//Thông tin khách hàng
//[GET] user/info
module.exports.infoUser = async(req, res)=>{
    const tokenUser = req.cookies.tokenUser
    const user = await User.findOne({
        tokenUser: tokenUser
    })
    res.render("client/pages/user/info", {
        pageTitle: "Thông tin tài khoản",
        user
    })
}

//[GET] user/edit
module.exports.editInfoUser = async(req, res)=>{
    const userId = res.locals.user.id; 
    const user = await User.findOne({
        _id: userId
    })
    res.render("client/pages/user/edit", {
        pageTitle: "Chỉnh sửa thông tin tài khoản",
        user
    })
}

// [PATCH] /user/edit
module.exports.editInfoUserPatch = async(req, res)=>{
    const userId = res.locals.user.id; 
    const user = await User.findOne({
        _id: userId
    })

    if(user.password != req.body.password){
        req.body.password = md5(req.body.password)
    }

    await User.updateOne(
        {
            _id: userId
        },  req.body
    )
    req.flash('success', 'Cập nhập tài khoản thành công!');
    res.redirect("/user/info")
}

//MK: 12345