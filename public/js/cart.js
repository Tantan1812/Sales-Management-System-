//Cập nhập số sản phẩm tronggior hàng mỗi khi thay đổi

const inputQuantity = document.querySelectorAll("input[name='quantity']")
if(inputQuantity.length > 0){
    inputQuantity.forEach(input =>{
        input.addEventListener("change", (e) =>{
            const productId = input.getAttribute("product-id")
            const quantity = parseInt(input.value);

            if(quantity > 1){
                window.location.href = `/cart/update/${productId}/${quantity}`
            }
        })
    })
}