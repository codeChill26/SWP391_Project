import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const Banner = () => {
  const navigate = useNavigate();
  return (
    <section className="mb-16 relative rounded-3xl overflow-hidden shadow-2xl">
      {/* Hình nền */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://benhvien198.net/Content/Website/Assets/images/banner-lienhe.png')", // Đổi thành URL ảnh bạn muốn
        }}
      />
      {/* Overlay để làm mờ ảnh nếu muốn chữ nổi bật hơn */}
      <div className="absolute inset-0 bg-black opacity-40" />

      {/* Nội dung */}
      <div className="relative z-10 text-center py-20 px-4 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
          Chào mừng đến với dịch vụ sức khỏe giới tính <br />
          <span>GENHEALTH</span>
        </h1>
        <button
          className="group px-8 py-4 bg-white text-[#3B9AB8] font-semibold rounded-xl hover:bg-blue-50 transition duration-300 shadow-lg flex items-center justify-center gap-2 mx-auto"
          onClick={() => navigate("/login")}
        >
          <span>Khám phá ngay</span>
          <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};

export default Banner;
