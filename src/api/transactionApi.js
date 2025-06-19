import { fetch } from "./Fetch"

export const getAdminTransactionByShop =async (id) => {
    let data =await fetch.get("/admin-transaction/get-all-shop/"+id)
    return data.data.data
}

export const getAdminTransaction =async () => {
    let data =await fetch.get("/admin-transaction/get-all")
    return data.data.data
}
export const payForShop= async (data) =>{
    let content = await fetch.post("/admin-transaction/pay-for-shop",data)
    return content.data
}
export const getShopTransaction = async () => {
    let data = await fetch.get("/shop-transaction/get-all")
    return data.data.data
}
export const savePayForAdmin = async (data) => {
    let content = await fetch.post("/shop-transaction/save-pay", data)
    return content.data
}
export const getDaily = async () => {
    let data = await fetch.get("/admin-transaction/get-daily")
    return data.data.data
}

export const getIncomeDay= async () => {
    let data= await fetch.get("/admin-transaction/day-income")
    return data.data.data
}