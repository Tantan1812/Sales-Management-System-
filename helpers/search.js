module.exports = (query) => {
    let objectSearch = {
        keyword: "",
        regex: ""
    };

    if (query.keyword) {
        objectSearch.keyword = query.keyword;
        
        const regex = new RegExp(objectSearch.keyword, "i"); // Tìm kiếm tương đối theo tên sản phẩm
        objectSearch.regex = regex;
    }
    return objectSearch;
};
