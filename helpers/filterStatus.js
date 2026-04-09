module.exports = (query)=>{
    let filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: "" //Thuộc tính để bôi xanh nút bấm
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Ngừng hoạt động",
            status: "inactive",
            class: ""
        }
    ]

    if(query.status){
        const index = filterStatus.findIndex(item => item.status==query.status);
        filterStatus[index].class = "active"
        console.log(filterStatus)
    }else{
        const index = filterStatus.findIndex(item => item.status=="");
        filterStatus[index].class = "active"
    }
    return filterStatus
}