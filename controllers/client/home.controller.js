const ProductCategory = require("../../models/product-category.model")
const systemConfig = require("../../config/system")
const createTreeHelper = require("../../helpers/createTree")
const Product = require("../../models/product.model")
const productHelper = require("../../helpers/product")

module.exports.index =  async(req, res)=>{ //Cái này là cú pháp đặt tên hàm trong Nodejs, cụ thẻ ở đây ta đặt tên hàm là "index"
    let find = {
        deleted: false,
        featured: "1",
        status: "active"
    };

    const productsFeatured = await Product.find(find).limit(6)

    // Lấy ra các sản phẩm nổi bật
    const newProductsFeatured = productHelper.priceNewProducts(productsFeatured)

    //Lấy ra các sản phẩm mới nhất
    const productsNew = await Product.find({
        deleted: false,
        status: "active"
    }).sort({position: "desc"}).limit(6)

    const newProductsNew = productHelper.priceNewProducts(productsNew)

    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang chủ",
        productsFeatured: newProductsFeatured,
        productsNew: newProductsNew
    })
};
