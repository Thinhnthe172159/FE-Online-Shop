import { fetch } from "./Fetch"

export const addAddress =async (content) => {
    let data  = await fetch.post("/address/add",content)
    return data.data
}

export const getAllAddress = async () =>{
        let data = await fetch.get("/address/get-list")
        return data.data.data
}

export const deleteAddress = async (id) => {
    let data = await fetch.delete(`/address/delete/${id}`)
    return data.data
}
export const updateAddress = async (content) => {
    let data = await fetch.put("/address/update", content)
    return data.data
}