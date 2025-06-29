// Mapping giữa status code và label tiếng Việt
export const statusLabels = {
  PENDING: "Đang duyệt",
  APPROVE: "Đã duyệt", 
  COMPLETED: "Hoàn thành",
  CANCEL: "Đã hủy",
  CANCELLED: "Đã hủy", // Thêm variant khác nếu có
};

// Mapping giữa status và màu sắc cho Ant Design Tag
export const getStatusColor = (status) => {
  const statusColors = {
    PENDING: "orange",
    APPROVE: "green", 
    COMPLETED: "blue",
    CANCEL: "red",
    CANCELLED: "red",
  };
  return statusColors[status] || "default";
};

// Mapping giữa status và màu sắc cho TailwindCSS
export const getStatusColorClass = (status) => {
  const statusColorClasses = {
    PENDING: "bg-yellow-500",
    APPROVE: "bg-green-500",
    COMPLETED: "bg-blue-500", 
    CANCEL: "bg-red-500",
    CANCELLED: "bg-red-500",
  };
  return statusColorClasses[status] || "bg-gray-500";
};

// Hàm lấy label tiếng Việt từ status code
export const getStatusLabel = (status) => {
  return statusLabels[status] || status;
};

// Hàm kiểm tra status có hợp lệ không
export const isValidStatus = (status) => {
  return Object.keys(statusLabels).includes(status);
};

// Danh sách tất cả status có sẵn
export const getAllStatuses = () => {
  return Object.keys(statusLabels);
};

// Hàm tạo options cho dropdown/select
export const getStatusOptions = () => {
  return Object.entries(statusLabels).map(([key, label]) => ({
    value: key,
    label: label,
    disabled: key === "PENDING" // PENDING mặc định disable
  }));
};
