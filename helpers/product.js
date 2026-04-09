module.exports.priceNewProducts = (products)=>{
    const newProducts = products.map((item)=>{
        item.priceNew = (item.price - item.price * item.discountPercentage * 0.01).toFixed(0)//Thêm 1 thuộc tính priceNew cho mảng products
        return item;
    })
    return newProducts
}

module.exports.priceNewProduct = (product)=>{
    const priceNew = (product.price - product.price * product.discountPercentage * 0.01)
    .toFixed(0)

    return priceNew
}