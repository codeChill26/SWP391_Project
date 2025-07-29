import React from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import ServiceSection from "../components/ServiceSection";
import FeaturesSection from "../components/FeaturesSection";
import BlogSection from "../components/BlogSection";
import Partners from "../components/Partners";
import Footer from "../components/Footer";
import ChatWidget from "../components/ChatWidget";
import BackToTop from "../components/BackToTop";
import { useUser } from "../context/UserContext";

const Home = () => {
  const { isLoggedIn, userData } = useUser();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        {/* Welcome Message for Logged In Users */}
        {isLoggedIn && (
          <div className="mb-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Chào mừng trở lại, {userData.name}!
              </h2>
              {userData.role === 'admin' && (
                <p className="text-sm text-gray-500 mt-2">
                  Bạn có thể truy cập trang Admin để quản lý người dùng
                </p>
              )}
            </div>
          </div>
        )}

        <Banner />
        <ServiceSection />
        <FeaturesSection />
        <BlogSection />
      </div>
      <Partners />
      <Footer />
      {/* <ChatWidget /> */}
      <BackToTop />
    </div>
  );
};

export default Home;