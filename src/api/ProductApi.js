import { fetch } from "./Fetch"

export const getAll = async () =>{
    const data = await fetch.get("/product/get-all")
    return data.data.data
}
export const updateStatus = async(content) => {
    
    const data = await fetch.put(`/product/update-status?id=${content.id}&status=${content.status}`,content.content)
    return data.data
}