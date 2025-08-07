import axios from "axios";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/da8hu1c5b/image/upload";
const UPLOAD_PRESET = "gender_image";

export const cloudinaryApi = {
  /**
   * Upload ảnh lên Cloudinary
   * @param {File} file - File ảnh cần upload
   * @returns {Promise<Object>} Kết quả upload
   */
  uploadImage: async (file) => {
    try {
      // Tạo FormData
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      console.log("Cloudinary Upload Request:", {
        url: CLOUDINARY_URL,
        file: file.name,
        size: file.size,
        type: file.type,
      });

      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      });

      console.log("Cloudinary Upload Response:", response.data);

      return {
        success: true,
        data: response.data,
        imageUrl: response.data.secure_url,
        publicId: response.data.public_id,
        message: "Upload ảnh thành công",
      };
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      
      // Xử lý các loại lỗi khác nhau
      if (error.response) {
        // Lỗi từ Cloudinary server
        const errorMessage = error.response.data?.error?.message || 
                           "Có lỗi xảy ra khi upload ảnh";
        
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
          error: "Không thể kết nối đến Cloudinary. Vui lòng kiểm tra kết nối mạng.",
        };
      } else {
        // Lỗi khác
        return {
          success: false,
          error: error.message || "Có lỗi xảy ra khi upload ảnh",
        };
      }
    }
  },

  /**
   * Xóa ảnh khỏi Cloudinary
   * @param {string} publicId - Public ID của ảnh
   * @returns {Promise<Object>} Kết quả xóa
   */
  deleteImage: async (publicId) => {
    try {
      const response = await axios.delete(
        `https://api.cloudinary.com/v1_1/da8hu1c5b/image/destroy`,
        {
          data: {
            public_id: publicId,
          },
        }
      );

      return {
        success: true,
        data: response.data,
        message: "Xóa ảnh thành công",
      };
    } catch (error) {
      console.error("Cloudinary Delete Error:", error);
      
      return {
        success: false,
        error: error.response?.data?.error?.message || "Lỗi xóa ảnh",
        status: error.response?.status,
      };
    }
  },

  /**
   * Kiểm tra file ảnh hợp lệ
   * @param {File} file - File cần kiểm tra
   * @returns {Object} Kết quả validation
   */
  validateImageFile: (file) => {
    // Kiểm tra loại file
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: "Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WEBP)",
      };
    }

    // Kiểm tra kích thước file (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: "Kích thước file không được vượt quá 10MB",
      };
    }

    return {
      valid: true,
      error: null,
    };
  },
}; 