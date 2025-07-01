import React from "react";

const MedicalTestCard = ({ test }) => {
  if (!test) return null;
  return (
    <div className="border rounded p-3 mb-3 bg-white shadow">
      <div><b>Tên xét nghiệm:</b> {test.testName}</div>
      <div><b>Ngày xét nghiệm:</b> {new Date(test.testDate).toLocaleString("vi-VN")}</div>
      <div><b>Kết quả:</b> {test.result}</div>
      <div><b>Ghi chú:</b> {test.notes}</div>
      <div><b>Giá:</b> {test.price?.toLocaleString()} VNĐ</div>
    </div>
  );
};

export default MedicalTestCard;