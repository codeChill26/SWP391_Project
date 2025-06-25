import axios from "axios";

export const BASE_URL = 'https://api-genderhealthcare.purintech.id.vn/api/appointments';

export const appointmentApi = {
  getAppointments: async (token) => {
    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const response = await axios.get(`${BASE_URL}`, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },
  getAppointmentById: async (id) => {
    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const response = await axios.get(`${BASE_URL}/${id}`, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointment by id:', error);
      throw error;
    }
  },
  getAppointmentByUserId: async (userId) => {
    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const response = await axios.get(`${BASE_URL}/user/${userId}`, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointment by user id:', error);
      throw error;
    }
  },
  scheduleAppointment: async (appointmentData) => {
    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const response = await axios.post(`${BASE_URL}/schedule`
        , appointmentData
        , config);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },
}