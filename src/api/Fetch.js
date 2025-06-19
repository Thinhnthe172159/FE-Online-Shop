import axios from "axios"



export const fetch = axios.create({
    baseURL: "http://localhost:8080/",
    
})

fetch.interceptors.request.use(
    (config) => {
      // Lấy token từ localStorage
      const token = localStorage.getItem('token'); 
      console.log(token)
      // Nếu có token thì thêm vào header Authorization
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.log("Error: "+error);
      return Promise.reject(error);
    }
  );