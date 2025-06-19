
import { fetch } from './Fetch'; 
export const getAllCategories = () => fetch.get('/category/getAll');

export const getCategorySelect = async () => {
   try {
    const data = await fetch.get("/category/get-all")
    return data.data.data
   } catch (error) {
    console.log(error);
    
   }
}

export const getProductByCategory = async (categoryId) =>{
   
   const response = await fetch.get(`/category/products?id=${categoryId}`);
   console.log(response.data.data)
   return response.data.data
}
