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
import { useMock } from "../context/MockContext";
import { Alert, Card } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const Home = () => {
  const { isLoggedIn, userData } = useUser();
  const { useMockData, mockUsers } = useMock();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        {/* Mock Mode Info */}
        {useMockData && (
          <Alert
            message="Mock Mode Active"
            description={
              <div>
                <p className="mb-2">API backend đang lỗi. Hệ thống đang sử dụng dữ liệu mock để test.</p>
                <div className="space-y-1 text-sm">
                  <p><strong>Tài khoản test:</strong></p>
                  {mockUsers.map((user, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{user.name} ({user.role})</span>
                      <span className="text-gray-600">{user.email}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Đăng nhập với email trên và mật khẩu bất kỳ để test
                </p>
              </div>
            }
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
            className="mb-6"
          />
        )}

        {/* Welcome Message for Logged In Users */}
        {isLoggedIn && (
          <Card className="mb-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Chào mừng trở lại, {userData.name}!
              </h2>
              <p className="text-gray-600">
                Bạn đang đăng nhập với vai trò: <span className="font-semibold text-blue-600">{userData.role}</span>
              </p>
              {userData.role === 'admin' && (
                <p className="text-sm text-gray-500 mt-2">
                  Bạn có thể truy cập trang Admin để quản lý người dùng
                </p>
              )}
            </div>
          </Card>
        )}

        <Banner />
        <ServiceSection />
        <FeaturesSection />
        <BlogSection />
      </div>
      <Partners />
      <Footer />
      <ChatWidget />
      <BackToTop />
    </div>
  );
};

export default Home;