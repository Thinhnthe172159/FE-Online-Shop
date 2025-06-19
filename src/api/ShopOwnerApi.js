import { fetch } from "./Fetch"

export const getAllShopOwner = async () => {
    let data = await fetch.get("/shopOwner/get-all")
    return data.data.data
}

export const updateStatus = async (content) => {
    let data = await fetch.put(`/shopOwner/updateStatus/${content.id}`, content)
    return data.data.data
}

export const InsertShopOwner = async (content) => {
    let data = await fetch.post(`/shopOwner/insert-shopOwner`,content)
    return data.data
}

export const loginSeller = async (content) => {
        let data = await fetch.post("/auth/shop/login",content)
        return data.data.data
}
export const getShopOwnerData = async () => {
    const response = await fetch.get("/shopOwner/get", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data.data;
};

export const forgotPassword = async (content) => {
    const data = await fetch.post(`/shopOwner/forgot-password?email=${content.email}`)
    return data.data.data
}

export const changePasswordByCode = async (content) => {
    console.log(content);
    let data = await fetch.post(`/shopOwner/change-password-by-code`, content)
    
    return data.data.data
    
}

export const checkCode = async (content) => {
    console.log(content);
    
    let data = await fetch.post(`/shopOwner/check-code?code=${content.code}&email=${content.email}`)
    return data.data.data
}