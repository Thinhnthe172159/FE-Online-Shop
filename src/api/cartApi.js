import { fetch } from "./Fetch";

export const getTotalItem = async () => {
  let data = await fetch.get("/cart/total-item");
  return data.data.data;
};

export const getTotalItemFromFavourite = async () => {
  let data = await fetch.get("/favourite/total-item");
  return data.data.data;
};

export const getGroupCart = async () =>{
    let data = await fetch.get("/cart/view-group")
    return data.data.data
}

export const deleteCartItem = async(id) =>{
        let data = await fetch.delete("/cart/delete/"+id)
        return data.data
}

export const updateQuantity = async(data) =>{
    let content = await fetch.put("/cart/update/"+data.id+"?action="+data.quantity)
    return content.data
}
