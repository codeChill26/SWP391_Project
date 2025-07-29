import axios from "axios";

const API_BASE_URL = 
"https://api-genderhealthcare.purintech.id.vn/api";

// Tạo instance axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để thêm token vào header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const provideMedicalTestApi = {
  // Lấy tất cả danh sách xét nghiệm
  getAllMedicalTests: async () => {
    try {
      const response = await apiClient.get("/provided-medical-tests");
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách xét nghiệm:", error);
      throw error;
    }
  },

  // Lấy thông tin xét nghiệm theo ID
  getMedicalTestById: async (id) => {
    try {
      const response = await apiClient.get(`/provided-medical-tests/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy xét nghiệm với ID ${id}:`, error);
      throw error;
    }
  },

  // Tạo xét nghiệm mới
  createMedicalTest: async (medicalTestData) => {
    try {
      const token = localStorage.getItem("token");
      const requestData = {
        // version: 0,
        // id: 0,
        testName: medicalTestData.testName,
        description: medicalTestData.description,
        price: medicalTestData.price,
      };

      const response = await apiClient.post("/provided-medical-tests", requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo xét nghiệm mới:", error);
      throw error;
    }
  },

  // Cập nhật xét nghiệm
  updateMedicalTest: async (id, medicalTestData) => {
    try {
      const requestData = {
        version: medicalTestData.version || 0,
        id: parseInt(id),
        testName: medicalTestData.testName,
        description: medicalTestData.description,
        price: medicalTestData.price,
      };

      const response = await apiClient.put(`/provided-medical-tests/${id}`, requestData);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật xét nghiệm với ID ${id}:`, error);
      throw error;
    }
  },

  // Xóa xét nghiệm
  deleteMedicalTest: async (id) => {
    try {
      const response = await apiClient.delete(`/provided-medical-tests/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi xóa xét nghiệm với ID ${id}:`, error);
      throw error;
    }
  },

  // Tìm kiếm xét nghiệm theo tên
  searchMedicalTests: async (searchTerm) => {
    try {
      const response = await apiClient.get("/provided-medical-tests", {
        params: {
          search: searchTerm,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm xét nghiệm:", error);
      throw error;
    }
  },

  // Lấy xét nghiệm theo khoảng giá
  getMedicalTestsByPriceRange: async (minPrice, maxPrice) => {
    try {
      const response = await apiClient.get("/provided-medical-tests", {
        params: {
          minPrice: minPrice,
          maxPrice: maxPrice,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy xét nghiệm theo khoảng giá:", error);
      throw error;
    }
  },
};

export default provideMedicalTestApi;
