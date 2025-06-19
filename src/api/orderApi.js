import { fetch } from "./Fetch"
import axios from "axios"

export const getOrder =async (data) => {
    let content = await fetch.post('/order/get-order',data)
    return content.data.data
}

export const createOrderVnPay= async(data) =>{
    console.log("data",data)
    let content = await fetch.post("/payment/create-vnpay",data)
    return content.data.data 
}

export const createOrderCod = async(data)=>{
    console.log("data",data);
    let content = await fetch.post("/payment/create-cod",data)
    return content.data.data 
}

export const getOrderByShop = async (page, startDate, endDate, status = []) => {
    let url = `/order/get-all?page=${page}`;
    
    // Thêm tham số startDate và endDate nếu có
    if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
    }
    
    // Thêm tham số status nếu có
    if (status.length > 0) {
        url += `&status=${status.join(",")}`; // Chuyển mảng status thành chuỗi
    }

    // Gọi API
    const content = await fetch.get(url);
    return content.data;
};

export const getOneOrder = async (id)=> {
    let content = await fetch.get("/order/get-one/"+id)
    return content.data.data
}
export const updateStatus = async (id, status, type) =>{
    let content = await fetch.put(`/order/update-status?orderId=${id}&status=${status}&type=${type}`)
    return content.data
}
export const getOrderHistory = async (status) => {
    let data = await fetch.get('/order/get-history?orderStatus='+status)
    return data.data.data
}

export const cancelOrder = async (id) =>{
    let data = await fetch.put('/order/cancel-order?orderStatus='+status)
    return data.data.data
}

export const getProductInOrderSuccess =async () =>{
    let data= await fetch.get("/order/get-success-detail")
    return data.data.data
}

export const customerHandleCancel =async (id) => {
    let data = await fetch.put("/order/customer-handle-cancel?orderId="+id)
    return data.data
}

export const updateShipCost = async (id, shipCost) => {
  return await fetch.put(`/order/update-ship-cost?orderId=${id}&shipCost=${shipCost}`);
};
