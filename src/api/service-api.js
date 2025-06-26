import axios from "axios";

export const serviceApi = {
  getServices: async () => {
    const response = await axios.get("https://api-genderhealthcare.purintech.id.vn/api/services");

    return response.data;
  }
}

