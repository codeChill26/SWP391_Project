import axios from "axios";

export const userApi = {
  getUsers: async () => {
    
    const token = localStorage.getItem("token")
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const response = await axios.get("https://api-genderhealthcare.purintech.id.vn/api/users", config);
    return response.data;
  },
  deleteUser: async (id) => {
    const token = localStorage.getItem("token")
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const response = await axios.delete(`https://api-genderhealthcare.purintech.id.vn/api/users/${id}`, config);
    return response.data;
  },
  updateUser: async (id, data) => {
    const token = localStorage.getItem("token")
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const response = await axios.put(`https://api-genderhealthcare.purintech.id.vn/api/users/${id}`, data, config);
    return response.data;
  },
  getUserById: async (id) => {  
    const token = localStorage.getItem("token")
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const response = await axios.get(`https://api-genderhealthcare.purintech.id.vn/api/users/${id}`, config);
    return response.data;
  },
  createUser: async (data) => {
    const token = localStorage.getItem("token")
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const response = await axios.post(`https://api-genderhealthcare.purintech.id.vn/api/users`, data, config);
    return response.data;
  },
};
