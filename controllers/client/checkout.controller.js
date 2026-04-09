const Product = require("../../models/product.model.js")
const Cart = require("../../models/cart.model")
const productHelper = require("../../helpers/product.js")
const Order = require("../../models/order.model.js")
// [GET] /
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

    res.render("client/pages/checkout/index", {
        pageTitle: "Đặt hàng",
        cartDetail: cart
    })
}

//[POST] checkout/order
module.exports.order = async(req, res)=>{
    const cartId = req.cookies.cartId
    const userInfor = req.body

    const cart = await Cart.findOne({
        _id: cartId
    })

    let products = [];
    for(const product of cart.products){
        const objectProduct = {
            product_id: product.product_id,
            price: 0,
            discountPercentage: 0,
            quantity: product.quantity,
        }

        const productInfor = await Product.findOne({
            _id: product.product_id
        })

        objectProduct.price = productInfor.price
        objectProduct.discountPercentage = productInfor.discountPercentage

        products.push(objectProduct)
    }

    const objectOrder = {
        cart_id: cartId,
        userInfor: userInfor,
        products: products
    }

    const order = new Order(objectOrder)
    await order.save()

    //Sau khi mua hàng xong thì ta sẽ xóa sp khỏi giỏ hàng
    await Cart.updateOne(
        {
            _id: cartId
        },
        {
            products: []
        }
    )

    res.redirect(`/checkout/success/${order.id}`)
}

//[GET] cart/success/:id
module.exports.success = async(req, res)=>{
    const order = await Order.findOne({
        _id: req.params.orderId
    })
    
    for(const product of order.products){
        const productInfor = await Product.findOne({
            _id: product.product_id
        }).select("title thumbnail")

        product.productInfor = productInfor

        product.priceNew = productHelper.priceNewProduct(product)
        product.totalPrice = product.quantity * product.priceNew
    }

    order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0)

    res.render("client/pages/checkout/success", {
        pageTitle: "Đặt hàng thành công",
        order: order
    })
}