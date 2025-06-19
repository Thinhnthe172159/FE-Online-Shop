import { fetch } from "./Fetch"

export const updateResponse =async (data) =>{
    let content = await fetch.post("/customer-reports/send-response",data)
    return content.data
}

export const getSeenReport = async () =>{
    let content = await fetch.get("/customer-reports/get-seen")
    return content.data.data
}

export const saveSeenReport = async (data) =>{
    let content = await fetch.post("/customer-reports/save-seen",data)
    return content.data.data
}

export const saveResponeShop = async (data)=>{
    let content = await fetch.post("/shopOwner/save-response",data)
    return content.data
}

export const getSeenReportShop = async () =>{
    let data = await fetch.get('/shop-reports/get-notify')
    return data.data.data
}
export const saveSeenReportShop = async (content) =>{
    let data = await fetch.post('/shop-reports/save-seen', content)
    return data.data.data
}
export const getShopResponse = async () =>{
    let data = await fetch.get("/shop-reports/get-response")
    return data.data.data
}
export const postIssues = async (data) =>{
    let content = await fetch.post("/shop-reports/post-issues",data)
    return content.data
}