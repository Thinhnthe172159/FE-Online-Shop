import { fetch } from "./Fetch"

export const getShop =async () =>{
    const data =await fetch.get("/shop/get")
    return data.data.data
}

export const getShopDetail = async () => {
    const data = await fetch.get("/shop/detail")
    return data.data.data
}

export const updateShopDetail = async(content) =>{
    const data = await fetch.post("/shop/update-detail", content)
    return data.data
}
export const updateShopAddress = async (content) => {
    const data = await fetch.post("/shop/update-address", content)
    return data.data
}

export const updateShippingCost = async (content) =>{
    const data = await fetch.post("/shop/update-shipping-cost",content)
    return data.data
}

export const updateShopPhone = async (content) => {
    const data = await fetch.post("/shop/update-phone", content)
    return data.data
}

export const saveShop =async (content) =>{ 
    const data = await fetch.post("/shop/save-v2", content)
    return data.data
}
export const getAllShop = async () => {
    const data = await fetch.get("/shop/get-all")
    return data.data.data
}

export const getProductByShop = async (id) => {
    const data = await fetch.get("/product/get-all-product/"+id)
    return data.data.data
}

export const getShopAdmin = async (id) =>{
    const data =await fetch.get("/shop/get/"+id)
    return data.data.data
}
export const ChangeStatusShop =  async(id) =>{
    const data = await fetch.put("/shop/status/"+id)
    return data.data
}
export const getCountActive = async () =>{
    const data =await fetch.get("/shop/count-active")
    console.log(data);
    
    return data.data.data
}