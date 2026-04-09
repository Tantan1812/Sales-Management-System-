
module.exports = (objectPagination, query, countProducts )=>{
    if(query.page){
        objectPagination.curentPage = parseInt(query.page)
    }
    //Tính số lượng page
    const totalPage = Math.ceil(countProducts / objectPagination.limitItem)

    //Công thức: Vị trí bắt đầu lấy = (Trang hiện tại - 1) * Số lượng phần tử mỗi trang
    objectPagination.skip = (objectPagination.curentPage - 1) * objectPagination.limitItem 
    objectPagination.totalPage = totalPage

    return objectPagination;
}