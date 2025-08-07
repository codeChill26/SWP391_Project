import axios from "axios";

export const serviceApi = {
  getServices: async () => {
    const token = localStorage.getItem("token")
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const response = await axios.get("https://api-genderhealthcare.purintech.id.vn/api/services", config);

    return response.data;
  },
  getServiceById: async (id) => {
    const token = localStorage.getItem("token")
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const response = await axios.get(`https://api-genderhealthcare.purintech.id.vn/api/services/${id}`, config);
    return response.data;
  },
  createService: async (data) => {
    const token = localStorage.getItem("token")
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const response = await axios.post("https://api-genderhealthcare.purintech.id.vn/api/services", data, config);
    return response.data;
  },
  updateService: async (id, data) => {
    console.log("submit service data", data);
    const token = localStorage.getItem("token")
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const response = await axios.put(
      `https://api-genderhealthcare.purintech.id.vn/api/services/${id}`,
      data,
      config
    );
    console.log("update service response", response);
    return response.data;
  },
  deleteService: async (id) => {
    const token = localStorage.getItem("token")
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const response = await axios.delete(`https://api-genderhealthcare.purintech.id.vn/api/services/${id}`, config);
    return response.data;
  }
}
