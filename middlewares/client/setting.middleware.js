const SettingGeneral = require("../../models/settings-general.model")

//Tạo middleware để kiếm tra nếu có token thì mưới cho đăng nhập vô xem các trang
module.exports.settingGeneral = async(req, res, next)=>{
    const settingGeneral = await SettingGeneral.findOne({})
    res.locals.settingGeneral = settingGeneral
    next()
}