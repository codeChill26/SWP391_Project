import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { useUser } from "../context/UserContext";

const Banner = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userData } = useUser();
  return (
    <section className="mb-16 text-center py-16 bg-[#3B9AB8] rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
          Chào mừng đến với dịch vụ sức khỏe giới tính
        </h1>

        <button
          className="group px-8 py-4 bg-white text-[#3B9AB8] font-semibold rounded-xl hover:bg-blue-50 transition duration-300 shadow-lg flex items-center justify-center gap-2 mx-auto"
          onClick={() =>{
            if(isLoggedIn){
              navigate("/service");
            }else{
              navigate("/login");
            }
          }}
        >
          <span>Khám phá ngay</span>
          <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10 z-0"></div>
    </section>
  );
};

export default Banner;