export const getRoleLabel = (role) => {
  switch (role) {
    case "patient":
      return "Bệnh nhân";
    case "admin":
      return "Quản trị viên";
    case "staff":
      return "Nhân viên";
    case "doctor":
      return "Bác sĩ";
    default:
      return "Không xác định";
  }
};
