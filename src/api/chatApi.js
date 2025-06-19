import axios from "axios";

const fetchChat = axios.create({
    baseURL: "http://localhost:8081/",   
})

fetchChat.interceptors.request.use(
    (config) => {
      // Lấy token từ localStorage
      const token = localStorage.getItem('token'); 
      console.log(token)
      // Nếu có token thì thêm vào header Authorization
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      console.log(config);
      
      return config;
    },
    (error) => {
      console.log("Error: "+error);
      return Promise.reject(error);
    }
)

export const getAllConverSation =async () => {
    const token = localStorage.getItem('token'); 
    let data = await fetchChat.get("/get-all-conversations", {
        headers: {
            Authorization: `Bearer ${token}` // Thêm token vào request cụ thể
        }
    })
    return data.data
}

export const getMessages =async (id) =>{
  let data = await fetchChat.get("/get-messages/"+id)
  return data.data
}