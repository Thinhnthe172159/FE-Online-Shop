import { fetch } from "./Fetch"

export const postShopRegister =async (content) => {
    let data = await fetch.post("/shop-register/add",content)
    return data
}
export const getAllRegister =async () => {
    let data = await fetch.get("/shop-register/find-add")
    return data.data.data
}

export const sendMail = async (content) =>{
    let data = await fetch.post("/shop-register/send-mail",content)
    return data.data
}

export const updateStatus = async (id)=>{
    let data =await fetch.put("/shop-register/update/"+id)
    return data.data
}

export const deleteRegist = async (id)=>{
    let data =await fetch.delete("/shop-register/delete/"+id)
    return data.data
}

export const sendMailApi = async (data) =>{
    let content = await fetch.post("/shop-register/send-mail",data)
    return content.data
}
export const countRegister = async() =>{
    let content = await fetch.get("/shop-register/count-inactive")
    return content.data.data
}