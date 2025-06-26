import axios from "axios";

export const userApi = {
  getUsers: async () => {
    const response = await axios.get("https://api-genderhealthcare.purintech.id.vn/api/users");
    return response.data;
  },
};
