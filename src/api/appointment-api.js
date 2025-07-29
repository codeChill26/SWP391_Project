import axios from "axios";

export const BASE_URL =
  "https://api-genderhealthcare.purintech.id.vn/api/appointments";

export const appointmentApi = {
  getAppointments: async () => {
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
      console.error("Error fetching appointments:", error);
      throw error;
    }
  },
  getDoctorById: async (id) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(
      `https://api-genderhealthcare.purintech.id.vn/api/users/${id}`,
      config
    );
    const user = response.data;
    if (user.role === "doctor") {
      return {
        id: user.user_id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
      };
    } else {
      throw new Error("User is not a doctor");
    }
  } catch (error) {
    console.error("Error fetching doctor info:", error);
    throw error;
  }
},
  getAppointmentById: async (id) => {
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
      console.error("Error fetching appointment by id:", error);
      throw error;
    }
  },
  getAppointmentByUserId: async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${BASE_URL}/user/${userId}`, config);
      return response.data;
    } catch (error) {
      console.error("Error fetching appointment by user id:", error);
      throw error;
    }
  },
  scheduleAppointment: async (appointmentData) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${BASE_URL}/schedule`,
        appointmentData,
        config
      );
      return response.data;
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  },
  updateAppointmentStatus: async (appointmentData) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `${BASE_URL}/status`,
        appointmentData,
        config
      );
      return response.data;
    } catch (error) {
      console.error("Error updating appointment status:", error);
      throw error;
    }
  },
  // appointment-api.js
  completeAppointment: (id, data) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.put(
      `${BASE_URL}/${id}/complete`,
      data,
      config
    );
  },
};
