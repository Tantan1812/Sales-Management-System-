
//---------------------------------------------------------------------
// Button status (Đây là xử lý bên frontend)
const buttonStatus = document.querySelectorAll("[button-status]") //Thuộc tính tự định nghĩa thì thêm []

if(buttonStatus.length > 0){
    let url =new URL( window.location.href) //href: lấy toàn bộ URL, Hmà URL() là một hàm hỗ chợ các chức năng để xử lý cái chuỗi url mình lấy được
    buttonStatus.forEach((button)=>{
        button.addEventListener("click", ()=>{
            const status = button.getAttribute("button-status")
            if(status){//Nếu kích vào hoat động or ngừng hoạt động
                url.searchParams.set("status",status)//Thêm tham số "status" với giá trị được cung cấp bởi biến "status"
            }else{//Nếu kích vào Tất cả
                url.searchParams.delete("status")//Xóa thuộc tính status
            }
            window.location.href = url.href //Set lại cái url cũ = url mới
        })
    })
}

//---------------------------------------------------------------------
//Form Search (Tìm kiếm sản phẩm theo tên)
const formSearch = document.querySelector("#form-search")
if(formSearch){
    let url =new URL(window.location.href)
    formSearch.addEventListener("submit",(event)=>{
        event.preventDefault()//Ngăn chặn trang load lại liên tục
        const keyword = event.target.elements.keyword.value//Lấy ra giá trị đã nhập vào ô tìm kiếm
        if(keyword){
            url.searchParams.set("keyword",keyword)
        }else{//Nếu kích vào Tất cả
            url.searchParams.delete("keyword")
        }
        window.location.href = url.href
    })
}

//---------------------------------------------------------------------
//Pagnigition (Xử lý phân trang sản phẩm)
const buttonPagination = document.querySelectorAll("[button-pagination]")
if(buttonPagination){
    let url = new URL(window.location.href)
    buttonPagination.forEach((button)=>{
        button.addEventListener("click", ()=>{
            const page = button.getAttribute("button-pagination")
            url.searchParams.set("page", page)
            window.location.href= url.href
        })
    })
}

//---------------------------------------------------------------------
//Checkbox Multi (Xử lý logic của các ô tích sản phẩm)
const checkboxMulti = document.querySelector("[checkbox-multi]")
if(checkboxMulti){
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']")//Lấy ra nút bấm all
    const inputId = checkboxMulti.querySelectorAll("input[name='id']")//Lấy ra các nút bấm của mỗi sản phẩm

    inputCheckAll.addEventListener("click", ()=>{
        inputId.forEach(button => {
            button.checked = inputCheckAll.checked; // Chọn tất cả hoặc bỏ chọn tất cả
        })
    })
    //C1
    inputId.forEach(button => {
        button.addEventListener("click", () => {
            const allChecked = Array.from(inputId).every(button => button.checked); //- Kiểm tra nếu tất cả các nút sản phẩm đều được tích thì 
                                                                                    //  thực hiện tích nút check all và ngược lại
            inputCheckAll.checked = allChecked; // Cập nhật trạng thái của nút "check all"
        });
    });

    //C2:
    // inputId.forEach(button => {
    //     button.addEventListener("click", () => {
    //         const countChecked = checkboxMulti.querySelectorAll(
    //             "input[name='id']:checked"
    //         ).length //Đếm số sản phẩm đang được tích

    //         if(countChecked==inputId.length){//Nếu tất cả sản phẩm được tích thì mình tích vào thằng check all
    //             inputCheckAll.checked=true
    //         }else{
    //             inputCheckAll.checked = false
    //         }
    //     });
    // });
}

//---------------------------------------------------------------------
// Form Change Multi (Thay đổi trạng thái của nhiều sản phẩm)
const formChangeMulti = document.querySelector("[form-change-multi]")

if(formChangeMulti){
    formChangeMulti.addEventListener("submit", (event)=>{
        event.preventDefault();
        //const ids = event.target.elements.value
        const checkboxMulti = document.querySelector("[checkbox-multi]")
        const inputChecked = checkboxMulti.querySelectorAll(
            "input[name='id']:checked"
        ) //Lấy ra các sản phẩm đã được tích

        //Lấy ra kiểu muốn áp dụng (Hoạt động/ Dừng hoạt động/ Xóa sản phẩm)
        const typechange = event.target.elements.type.value
        if(typechange=="delete-all"){
            const inConFirm = confirm("Xóa các sản phẩm đã chọn")
            
            if(!inConFirm){
                return;
            }
        }
        if(inputChecked.length > 0){
            let ids = []

            inputChecked.forEach(button =>{
                const id = button.value
            
                if(typechange=="change-position"){
                    const position = button.closest("tr")//Ra 1 bậc để đến thằng cha là "tr"
                                           .querySelector("input[name='position']") //Từ thẻ cha "tr" truy vấn đến thẻ con "input"
                                           .value;
                    if (position) {
                        ids.push(id + '-' + position);
                    }
                }else{
                    ids.push(id)
                }
            })
            const inputForm = document.querySelector("input[name='ids']")
            inputForm.value = ids.join(",") //Truyền chuỗi các id của sản phẩm vào ô input để gửi lên server

            formChangeMulti.submit()

        }else{
            alert("Chọn ít nhất 1 sản phẩm")
        }
    })
}

//---------------------------------------------------------------------
//Form khôi phục hoặc xóa vĩnh viễn sản phẩm trong thùng rác
const formTrashItem = document.querySelector("#form-trash-item")

if(formTrashItem){
    const buttonRestore = document.querySelectorAll("[button-restore]")
    const buttonDeletePermanently = document.querySelectorAll("[button-delete-permanently]")
    const pathTrash = formTrashItem.getAttribute("data-path")

    buttonRestore.forEach(button =>{
        button.addEventListener("click", ()=>{
            const id = button.getAttribute("data-id")
            const newPath = pathTrash + `/restore/${id}?_method=PATCH`

            formTrashItem.action = newPath
            formTrashItem.submit()
        })
    })
    buttonDeletePermanently.forEach(button =>{
        button.addEventListener("click", ()=>{
            const inConfirm = confirm("Sản phẩm sẽ bị xóa vĩnh viễn")
            if(inConfirm){
                const id = button.getAttribute("data-id")
                const newPath = pathTrash + `/delete/${id}?_method=PATCH`

                formTrashItem.action = newPath
                formTrashItem.submit()
            }
        })
    })
}

//---------------------------------------------------------------------
//Show alert (Thông báo cập nhập thành công hay chưa)
 const showAlert = document.querySelector("[show-alert]")

 if(showAlert){
    const dataTime = showAlert.getAttribute("data-time")
    const closeAlert = showAlert.querySelector("[close-alert]")
    setTimeout(()=>{
        showAlert.classList.add("alert-hidden")
    }, parseInt(dataTime))
    
    closeAlert.addEventListener("click", ()=>{
        showAlert.classList.add("alert-hidden")
    })
 }

//---------------------------------------------------------------------
//Upload Image and preview (Tải ảnh lên và có thể xem trước được nội dung ảnh)
const uploadImage = document.querySelector("[upload-image]")

if(uploadImage){
    const uploadImageInput = document.querySelector("[upload-image-input]")
    const uploadImagePreview = document.querySelector("[upload-image-preview]")
    const closeButton = document.querySelector("[close-button]")

    uploadImageInput.addEventListener("change", (event)=>{
        //console.log(event)
        const file = event.target.files[0]
        if (file){
            uploadImagePreview.src = URL.createObjectURL(file)//Được sử dụng để tạo một URL tạm thời, đại diện cho một đối tượng file hoặc blob. URL này có thể được sử dụng để tham chiếu trực tiếp đến tệp mà người dùng đã chọn mà không cần tải tệp đó lên máy chủ.
            uploadImagePreview.classList.remove("hidden");
            closeButton.classList.remove("hidden")
        }

        //close image
        if(closeButton){
            closeButton.addEventListener("click", ()=>{
                uploadImageInput.value = "";
                uploadImagePreview.src = "";
                uploadImagePreview.classList.add("hidden");
                closeButton.classList.add("hidden")
            })
        }
    })
}

//----------------------------------------------------------------------
//Xắp xếp sản phẩm
//a. sắp xếp theo vị trí

const sort = document.querySelector("[sort]")

if(sort){
    const sortSelect = document.querySelector("[sort-select]")
    const sortClear = document.querySelector("[sort-clear]")
    let url = new URL(window.location.href)
    
    sortSelect.addEventListener("change", (e)=>{
        const [sortKey, sortValue] = e.target.value.split("-");

        url.searchParams.set("sortKey", sortKey)
        url.searchParams.set("sortValue", sortValue)

        window.location.href = url.href
    })

    sortClear.addEventListener("click", ()=>{
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");
        window.location.href = url.href
    })

    //Thêm selected=true cho option
    const sortKey = url.searchParams.get("sortKey")
    const sortValue = url.searchParams.get("sortValue")

    if(sortKey && sortValue){
        const stringSort = `${sortKey}-${sortValue}`
        const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`)
        optionSelected.selected = true
    }
}

//----------------------------------------------------------------------
//Xóa 1 nhóm quyền
const formDeletePermission = document.querySelector("#form-delete-permission")
if(formDeletePermission){
    const path = formDeletePermission.getAttribute("data-path")
    const buttonDeletePermissions = document.querySelector("[button-delete-permission]");

    buttonDeletePermissions.addEventListener("click", ()=>{
        const inConfirm = confirm("Xóa nhóm quyền")
            if(inConfirm){
                const id = buttonDeletePermissions.getAttribute("data-id")

                const newPath = path + `/${id}?_method=DELETE`

                formDeletePermission.action = newPath
                formDeletePermission.submit()//Bản chất là nó gửi cái action lên server
            }
    })
}

//----------------------------------------------------------------------
//Xóa 1 danh mục sản phẩm
const formDeleteCategory = document.querySelector("#form-delete-category");
console.log(formDeleteCategory);

if (formDeleteCategory) {
    const path = formDeleteCategory.getAttribute("data-path");
    console.log(path);

    const buttonDeleteCategories = document.querySelectorAll("[button-delete-category]");
    console.log(buttonDeleteCategories);

    buttonDeleteCategories.forEach(buttonDeleteCategory => {
        buttonDeleteCategory.addEventListener("click", () => {
            const inConfirm = confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
            if (inConfirm) {
                const id = buttonDeleteCategory.getAttribute("data-id");

                const newPath = `${path}/${id}?_method=DELETE`;
                formDeleteCategory.action = newPath;
                formDeleteCategory.submit(); // Gửi form lên server
            }
        });
    });
}

