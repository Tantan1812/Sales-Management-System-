module.exports.loginPost = (req, res, next)=>{
    if(!req.body.email){
        req.flash('error', 'Vui lòng nhập email!');
        res.redirect("back")
        return;
    }
    if(!req.body.password){
        req.flash('error', 'Vui lòng nhập mật khẩu!');
        res.redirect("back")
        return;
    }
    next(); //Midleware Để nhảy đến bước kế tiếp là: controller.createPost
}
