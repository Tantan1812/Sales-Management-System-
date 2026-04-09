const Product = require("../../models/product.model.js")
const productHelper = require("../../helpers/product")
const ProductCategory = require("../../models/product-category.model.js")
const productCategoryHelper = require("../../helpers/products-category.js")

//1. Hiển thị trang client
module.exports.index = async (req, res)=>{
    const products = await Product.find({//Lọc data muốn lấy ra
        status: "active",
        deleted: false
    }).sort({position: "desc"})

    const newProducts = productHelper.priceNewProducts(products)

    // console.log(products)
    res.render("client/pages/products/index.pug", {
        pageTitle: "Danh sách sản phẩm",
        products: newProducts
    })
}

//2. Hiển thị chi tiết sản phẩm
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false, 
            slug: req.params.slugProduct,
            status: "active"
        };
        const product = await Product.findOne(find);

        if(product.product_category_id){
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false
            })
            product.category = category
        }

        product.priceNew = productHelper.priceNewProduct(product)

        res.render("client/pages/products/detail", {
            pageTitle: product.title, 
            product: product, 
        });

    } catch (error) {
        console.error(error);
        res.redirect(`/products`);
    }
};


module.exports.category = async(req, res)=>{
    //console.log(req.params.slugCategory)
    const category = await ProductCategory.findOne({
        deleted: false,
        status: "active",
        slug: req.params.slugCategory
    });
    const lisSubCategory = await productCategoryHelper.getSubCategory(category.id)

    const lisSubCategoryID = lisSubCategory.map(item=>item.id)

    const products = await Product.find({    
        product_category_id: {$in: [category.id, ...lisSubCategoryID]},
            deleted: false
        }).sort({position: "desc"})

    // console.log(products)
    const newProducts = productHelper.priceNewProducts(products)
    res.render("client/pages/products/index.pug", {
        pageTitle: category.title,
        products: newProducts
    })
}