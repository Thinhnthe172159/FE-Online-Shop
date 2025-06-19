
import { fetch } from "./Fetch"

export const getHomeProduct = async () =>{
    let data =await fetch.get("/home/get")
    return data.data.data
}