import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#47a0bd",
        color: "#fff",
        padding: "40px",
        fontSize: 14,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
        <div>
          <h4>TRUNG TÂM Y TẾ</h4>
          <p>Giới thiệu</p>
          <p>Dịch vụ</p>
          <p>Đội ngũ bác sĩ</p>
        </div>
        <div>
          <h4>TRỢ GIÚP</h4>
          <p>Câu hỏi thường gặp</p>
          <p>Hướng dẫn đặt lịch</p>
          <p>Liên hệ</p>
        </div>
        <div>
          <h4>PHÁP LÝ</h4>
          <p>Chính sách bảo mật</p>
          <p>Điều khoản dịch vụ</p>
        </div>
        <div>
          <h4>LIÊN HỆ</h4>
          <p>123 Đường Y Tế, Quận 1, TP.HCM</p>
          <p>Hotline: 1900 1234</p>
          <p>Email: info@trungtamyte.com</p>
        </div>
      </div>
      <hr style={{ margin: "24px 0", borderColor: "#aaa" }} />
      <p style={{ textAlign: "center", color: "#e0e0e0" }}>
        © 2025 Trung Tâm Y Tế GenHealth. Tất cả quyền được bảo lưu.
      </p>
    </footer>
  );
}
