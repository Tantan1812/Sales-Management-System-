const Product = require("../../models/product.model.js")
const searchProductHelper = require("../../helpers/search.js")
const searchHelper = require("../../helpers/product.js")

//1. Hiển thị kết quả tìm kiếm
module.exports.index = async (req, res)=>{
    const keyword = req.query.keyword
    let newProduct = []

    if (keyword){
        const keywordRegex = new RegExp(keyword, "i")
        const products = await Product.find({
            deleted: false,
            status: "active",
            title: keywordRegex
        })

        newProduct = searchHelper.priceNewProducts(products)
        //console.log(products)
    }

    res.render("client/pages/search/index.pug", {
        pageTitle: "Kết quả tìm kiếm",
        keyword: keyword,
        products: newProduct
    })
}