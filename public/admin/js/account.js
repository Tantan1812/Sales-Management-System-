//Xóa 1 tài khoản
const formDeleteAccount = document.querySelector("#form-delete-account")
if(formDeleteAccount){
    const buttonDeleteAccount = document.querySelector("[button-delete-account]")
    const path = formDeleteAccount.getAttribute("data-path")
    buttonDeleteAccount.addEventListener("click", ()=>{
        const dataId = buttonDeleteAccount.getAttribute("data-id")

        const newPath = path + `/${dataId}?_method=DELETE`

        formDeleteAccount.action = newPath
        formDeleteAccount.submit()
    })
}