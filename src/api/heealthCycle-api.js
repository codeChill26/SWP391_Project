
import axios from "axios";

export const BASE_URL =
  "https://api-genderhealthcare.purintech.id.vn/api/health-cycles";

export const healthCycleApi = {
  getHealthCycles: async (token) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${BASE_URL}`, config);
      return response.data;
    } catch (error) {
      console.error("Error fetching health cycles:", error);
      throw error;
    }
  },
  getHealthCycleById: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${BASE_URL}/${id}`, config);
      return response.data;
    } catch (error) {
      console.error("Error fetching health cycle by id:", error);
      throw error;
    }
  },
  getHealthCycleByUserId: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${BASE_URL}/user/${id}`, config);
      return response.data;
    } catch (error) {
      console.error("Error fetching health cycle by user id:", error);
      throw error;
    }
  },
  createHealthCycle: async (data) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(`${BASE_URL}/monthly-cycle/check-update`, data, config);
      return response.data;
    } catch (error) {
      console.error("Error creating health cycle:", error);
      throw error;
    }
  },
  updateHealthCycle: async (id, data) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(`${BASE_URL}/${id}`, data, config);
      return response.data;
    } catch (error) {
      console.error("Error updating health cycle:", error);
      throw error;
    }
  },
  deleteHealthCycle: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.delete(`${BASE_URL}/${id}`, config);
      return response.data;
    } catch (error) {
      console.error("Error deleting health cycle:", error);
      throw error;
    }
  },
};