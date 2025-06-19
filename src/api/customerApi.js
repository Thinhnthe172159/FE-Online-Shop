import { fetch } from "./Fetch"
import axios from "axios"

export const getUserDetail = async () => {
    let data = await fetch.get("/customer/find")
    return data.data.data
}

export const uploadAvatar = async(upload) =>{  
    let data = await fetch.post("/customer/upload-avatar",upload)
    return data
}
export const updateDetail = async(detail)=>{
    let data = await fetch.post("/customer/update", detail)
    return data
}
export const updatePassword = async(content) =>{
    let data = await fetch.post("/customer/change-password",content)
    return data
}

export const getAllCustomers = async() => {
    let data = await fetch.get("/customer/get-all")
    return data.data.data
}

export const updateStatus = async (content) => {
    let data = await fetch.put(`/customer/updateStatus/${content.id}`, content)
    return data.data.data
}

export const InsertCustomers = async (content) => {
    let data = await fetch.post(`/customer/insert-customer`,content)
    return data.data
}

export const updateCustomerManage = async (content) => {
    console.log(content);
        let data = await fetch.put(`/customer/update-customer/${content.id}`, content)
        return data.data.data

}

export const forgotPassword = async (content) => {
    let data = await fetch.post(`/customer/forgot-password?email=${content.email}`)
    return data.data.data
}

export const changePasswordByCode = async (content) => {
    let data = await fetch.post(`/customer/change-password-by-code`, content)
    return data.data.data
}

export const checkCode = async (content) => {
    let data = await fetch.post(`/customer/check-code`, null, {
        params: {
            code: content.code,
            email: content.email
        }
    });
    return data.data;
}


