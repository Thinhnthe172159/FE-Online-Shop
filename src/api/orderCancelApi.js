import { fetch } from "./Fetch"

export const saveCancel = async (data) =>{
    let content = await fetch.post("/order-cancel/save", data)
    return content.data
}

export const getRequest = async (id) =>{
    let content = await fetch.get("/order-cancel/get-request/"+id)
    return content.data.data
}

export const approveOrderCancel = async (data) =>{
    let content = await fetch.post(`/order-cancel/approve-cancel?code=${data.oid}&id=${data.id}`)
    return content.data

}
export const cancelOrder = async (data) =>{
    let content = await fetch.post("/order-cancel/cancel/"+data.sid, data.content)
    return content.data
}