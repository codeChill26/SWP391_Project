import axios from "axios";

export const testApi = {
  getmedicaltestsByappointmentId: async (id) => {
    const token = localStorage.getItem("token");
    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {};
    const response = await axios.get(
      `https://api-genderhealthcare.purintech.id.vn/api/medical-tests/appointment/${id}`,
      config
    );
    return response.data;
  },
};
