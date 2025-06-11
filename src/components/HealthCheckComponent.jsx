import React from 'react';

export default function HealthCheckComponent() {
  return (
    <div className="p-6 bg-white rounded-lg border shadow-md max-w-7xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Kiểm tra sức khỏe</h2>
      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel */}
        <div className="col-span-12 lg:col-span-4 bg-blue-600 text-white rounded-xl p-4">
          <h3 className="text-xl font-bold mb-2">KIỂM TRA <br /> <span className="text-2xl">SỨC KHỎE</span><br />Chỉ <span className="text-3xl font-extrabold">4</span> bước<br />Đơn giản</h3>
          <ul className="mt-4 space-y-4 text-sm font-medium">
            <li><strong>BƯỚC 1:</strong> Lấy mẫu tại nhà</li>
            <li><strong>BƯỚC 2:</strong> Nhận kết quả, xét nghiệm online</li>
            <li><strong>BƯỚC 3:</strong> Khám tại phòng khám tuỳ chọn</li>
            <li><strong>BƯỚC 4:</strong> Nhận tư vấn sức khoẻ từ Bác sĩ</li>
          </ul>
          <div className="mt-6 text-xs space-y-1">
            <div>📦 Dịch vụ tại nhà</div>
            <div>⏱ Tư vấn nhanh chóng</div>
            <div>✔️ Không cần chờ đợi</div>
            <div>⭐ Tận tình - Chuyên nghiệp</div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {/* Tabs */}
          <div className="flex space-x-2 mb-2">
            <button className="bg-blue-500 text-white px-4 py-1 rounded-full">Phổ biến</button>
            <button className="bg-gray-200 px-4 py-1 rounded-full">Nữ giới</button>
            <button className="bg-gray-200 px-4 py-1 rounded-full">Nam giới</button>
          </div>

          {/* Packages */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Basic Health Check Package */}
            <div className="border rounded-lg p-4 shadow">
              <img src="https://via.placeholder.com/300x150?text=Bác+sĩ" alt="Doctor" className="rounded mb-2" />
              <h4 className="font-bold text-lg">Gói khám sức khỏe cơ bản</h4>
              <p className="text-sm text-gray-600">Dành cho độ tuổi từ <strong>20 - 70</strong> tuổi</p>
              <p className="text-green-600 text-sm">Theo dõi sức khỏe định kỳ</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <span>🩺 13 xét nghiệm</span>
                <span>📋 4 Hạng mục khám</span>
              </div>
              <div className="mt-2 font-bold text-lg">1.590.000đ</div>
              <button className="mt-2 px-4 py-1 bg-blue-500 text-white rounded">Xem chi tiết</button>
            </div>

            {/* Home Test Package */}
            <div className="border rounded-lg p-4 shadow">
              <img src="https://via.placeholder.com/300x150?text=Xét+nghiệm" alt="Test tube" className="rounded mb-2" />
              <h4 className="font-bold text-lg">Gói xét nghiệm tổng quát tại nhà</h4>
              <p className="text-sm text-gray-600">Dành cho độ tuổi từ <strong>20 - 70</strong> tuổi</p>
              <p className="text-green-600 text-sm">Theo dõi sức khỏe định kỳ</p>
              <div className="flex items-center mt-2 text-sm text-gray-600">🩺 13 xét nghiệm</div>
              <div className="mt-2 font-bold text-lg">850.000đ</div>
              <button className="mt-2 px-4 py-1 bg-blue-500 text-white rounded">Xem chi tiết</button>
            </div>
          </div>

          <div className="text-center mt-4">
            <button className="text-blue-600 border border-blue-600 px-4 py-1 rounded">Xem tất cả dịch vụ</button>
          </div>
        </div>
      </div>
    </div>
  );
}
