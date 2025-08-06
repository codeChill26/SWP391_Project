import axios from "axios";

const BASE_URL = "https://api-genderhealthcare.purintech.id.vn/api";

export const vnpayApi = {
  /**
   * Tạo thanh toán VNPay
   * @param {string} vnpayId - ID giao dịch VNPay
   * @param {number} amount - Số tiền thanh toán
   * @param {string} orderInfo - Thông tin đơn hàng
   * @param {string} callbackUrl - URL callback sau khi thanh toán
   * @returns {Promise<Object>} Kết quả từ API
   */
  createPayment: async (vnpayId, amount, orderInfo, callbackUrl) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const requestBody = {
        vnpayId: vnpayId,
        amount: amount,
        orderInfo: orderInfo,
        callbackUrl: callbackUrl,
      };

      console.log("VNPay API Request:", {
        url: `${BASE_URL}/vnpay/create-payment`,
        body: requestBody,
      });

      const response = await axios.post(
        `${BASE_URL}/vnpay/create-payment`,
        requestBody,
        config
      );

      console.log("VNPay API Response:", response.data);

             return {
         success: response.data.success,
         data: response.data,
         paymentUrl: response.data.paymentUrl,
         message: response.data.message,
       };
    } catch (error) {
      console.error("VNPay API Error:", error);
      
      // Xử lý các loại lỗi khác nhau
      if (error.response) {
        // Lỗi từ server với response
        const errorMessage = error.response.data?.message || 
                           error.response.data?.error || 
                           "Có lỗi xảy ra khi tạo thanh toán";
        
        return {
          success: false,
          error: errorMessage,
          status: error.response.status,
          data: error.response.data,
        };
      } else if (error.request) {
        // Lỗi network
        return {
          success: false,
          error: "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.",
        };
      } else {
        // Lỗi khác
        return {
          success: false,
          error: error.message || "Có lỗi xảy ra",
        };
      }
    }
  },

  /**
   * Xác thực callback từ VNPay
   * @param {Object} callbackData - Dữ liệu callback từ VNPay
   * @returns {Promise<Object>} Kết quả xác thực
   */
  verifyCallback: async (callbackData) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `${BASE_URL}/vnpay/verify-callback`,
        callbackData,
        config
      );

      return {
        success: true,
        data: response.data,
        message: "Xác thực callback thành công",
      };
    } catch (error) {
      console.error("VNPay Callback Verification Error:", error);
      
      return {
        success: false,
        error: error.response?.data?.message || "Lỗi xác thực callback",
        status: error.response?.status,
      };
    }
  },

  /**
   * Lấy thông tin giao dịch VNPay
   * @param {string} transactionId - ID giao dịch
   * @returns {Promise<Object>} Thông tin giao dịch
   */
  getTransactionInfo: async (transactionId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${BASE_URL}/vnpay/transaction/${transactionId}`,
        config
      );

      return {
        success: true,
        data: response.data,
        message: "Lấy thông tin giao dịch thành công",
      };
    } catch (error) {
      console.error("VNPay Transaction Info Error:", error);
      
      return {
        success: false,
        error: error.response?.data?.message || "Lỗi lấy thông tin giao dịch",
        status: error.response?.status,
      };
    }
  },

  /**
   * Hủy giao dịch VNPay
   * @param {string} transactionId - ID giao dịch cần hủy
   * @returns {Promise<Object>} Kết quả hủy giao dịch
   */
  cancelTransaction: async (transactionId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `${BASE_URL}/vnpay/cancel-transaction`,
        { transactionId },
        config
      );

      return {
        success: true,
        data: response.data,
        message: "Hủy giao dịch thành công",
      };
    } catch (error) {
      console.error("VNPay Cancel Transaction Error:", error);
      
      return {
        success: false,
        error: error.response?.data?.message || "Lỗi hủy giao dịch",
        status: error.response?.status,
      };
    }
  },
}; 