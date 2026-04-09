const SettingGeneral = require("../../models/settings-general.model")

//1. [GET] admin/settings/general
module.exports.general = async (req, res)=>{
    const settingGeneral = await SettingGeneral.findOne({})

    res.render("admin/pages/settings/general.pug", {
        pageTitle: "Cài đặt chung",
        settingGeneral: settingGeneral
    })
}

//[POST] admin/settings/general
module.exports.generalPatch = async(req, res)=>{
    const settingGeneral = await SettingGeneral.findOne({})
    if(settingGeneral){
        await SettingGeneral.updateOne({
            _id: settingGeneral.id
        }, req.body)
    }else{
        const record = new SettingGeneral(req.body)
        await record.save()
    }
    req.flash("success", "Cập nhập thành công!")
    res.redirect("back")
}