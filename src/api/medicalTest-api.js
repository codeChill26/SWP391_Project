import axios from "axios";

export const BASE_URL = 'https://api-genderhealthcare.purintech.id.vn/api/medical-tests';

export const medicalTestApi = {
  getMedicalTests: async (token) => {
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
      console.error('Error fetching medical tests:', error);
      throw error;
    }
  },
  getMedicalTestById: async (id) => {
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
      console.error('Error fetching medical test by id:', error);
      throw error;
    }
  },
  getMedicalTestByAppointmentId: async (appointmentId) => {
    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const response = await axios.get(`${BASE_URL}/appointment/${appointmentId}`, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching medical test by appointment id:', error);
      throw error;
    }
  },
  createMedicalTest: async (medicalTestData) => {
    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const response = await axios.post(`${BASE_URL}`, medicalTestData, config);
      return response.data;
    } catch (error) {
      console.error('Error creating medical test:', error);
      throw error;
    }
  },
  updateMedicalTest: async (id, medicalTestData) => {
    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const response = await axios.put(`${BASE_URL}/${id}`, medicalTestData, config);
      return response.data;
    } catch (error) {
      console.error('Error updating medical test:', error);
      throw error;
    }
  },
  deleteMedicalTest: async (id) => {
    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const response = await axios.delete(`${BASE_URL}/${id}`, config);
      return response.data;
    } catch (error) {
      console.error('Error deleting medical test:', error);
      throw error;
    }
  },
  // Cập nhật trạng thái thanh toán cho tất cả medical tests của một appointment
  updateMedicalTestPayment: async (appointmentId, paymentId) => {
    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const response = await axios.get(`${BASE_URL}/payment?appointmentId=${appointmentId}&paymentId=${paymentId}`, config);
      return response.data;
    } catch (error) {
      console.error('Error updating medical test payment status:', error);
      throw error;
    }
  }
}
