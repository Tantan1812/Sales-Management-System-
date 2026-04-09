const Product = require("../../models/product.model.js")
const Cart = require("../../models/cart.model")
const productHelper = require("../../helpers/product.js")

// [GET] /cart
module.exports.index = async(req, res)=>{
    const cartId = req.cookies.cartId

    const cart = await Cart.findOne({
        _id: cartId
    })

    //tổng tiền mỗi đơn hàng

    if(cart.products.length > 0){
        for(const item of cart.products){
            const productId = item.product_id

            const productInfor = await Product.findOne({
                _id: productId
            })

            productInfor.priceNew = productHelper.priceNewProduct(productInfor)

            item.productInfor = productInfor

            item.totalPrice = item.quantity * productInfor.priceNew
        }
    }

    //Tổng tiền của all đơnhàng
    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0)

    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng",
        cartDetail: cart
    })
}



module.exports.addPost = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    
    const cart = await Cart.findOne({ _id: cartId });

    const existProductInCart = cart.products.find(item => item.product_id == productId)

    if(existProductInCart){
        const newQuantity = quantity + existProductInCart.quantity;

        await Cart.updateOne(
            {
                _id: cartId,
                "products.product_id": productId
            },
            {
                "products.$.quantity": newQuantity
            }
        );
    }else{
        const objectCart = {
            product_id: productId,
            quantity: quantity
        };
        
        await Cart.updateOne(
            {
                _id: cartId,
            },
            {
                $push: { products: objectCart }
            }
        );
        
    }
    //Clear giỏ hàng
    //await Cart.deleteMany({ _id: { $ne: cartId } });
    req.flash("success", "Thêm sản phẩm thành công");
    res.redirect("back");
};


//[DELETE] /cart/delete/:productId
module.exports.deleteProduct = async(req, res)=>{
    const productId = req.params.productId

    const cartId = req.cookies.cartId
    let cart = await Cart.findOne({ _id: cartId });

    if (cart) {
        cart.products = cart.products.filter(item => item.product_id.toString() !== productId);
        await cart.save();
        req.flash("success", "Xóa sản phẩm thành công");
    }
    res.redirect("back");
}

//[GET] /cart/update/:productId/:quatity
module.exports.updateProduct = async(req, res)=>{
    const productId = req.params.productId
    const quantity = req.params.quantity

    const cartId = req.cookies.cartId
    await Cart.updateOne(
        { _id: cartId, 
            'products.product_id': productId 
        },
        { 
            'products.$.quantity': quantity  
        }
    );
    req.flash("success", "Cập nhập số lượng thành công");

    res.redirect("back");
}