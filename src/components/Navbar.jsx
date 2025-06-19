import React from "react";
import { Button, Menu, ConfigProvider, Avatar, Dropdown, Switch } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { HomeOutlined, AppstoreOutlined, FileTextOutlined, QuestionCircleOutlined, InfoCircleOutlined, CalendarOutlined, BellOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import { useUser } from '../context/UserContext';
import { useMock } from '../context/MockContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, isLoggedIn, logout } = useUser();
  const { useMockData, toggleMockMode, mockUsers } = useMock();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined style={{ fontSize: '18px' }} />,
      label: "Home",
    },
    {
      key: "/service",
      icon: <AppstoreOutlined style={{ fontSize: '18px' }} />,
      label: "Services",
    },
    {
      key: "/booking",
      icon: <CalendarOutlined style={{ fontSize: '18px' }} />,
      label: "Booking",
    },
    {
      key: "/blog",
      icon: <FileTextOutlined style={{ fontSize: '18px' }} />,
      label: "Blog",
    },
    {
      key: "/help",
      icon: <QuestionCircleOutlined style={{ fontSize: '18px' }} />,
      label: "Help Center",
    },
    {
      key: "/about",
      icon: <InfoCircleOutlined style={{ fontSize: '18px' }} />,
      label: "About",
    },
  ];

  // Dropdown menu cho user đã đăng nhập
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#3B9AB8",
        },
      }}
    >
      <header className="fixed top-0 left-0 w-full z-50 bg-[#3B9AB8] shadow-sm h-16">
        <div className="container mx-auto px-8 h-full flex items-center justify-between">
          {/* Logo + Brand */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="flex items-center justify-center h-16">
              <img
                src="/src/assets/images/image.png"
                alt="GenHealth Logo"
                className="w-[94px] h-16 object-contain translate-x-[11px] translate-y-[3px]"
              />
            </div>
            <h1
              className="text-2xl font-bold text-white ml-3"
            >
              GenHealth
            </h1>
          </div>

          {/* Navigation Menu */}
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{
              flex: 1,
              justifyContent: "center",
              border: "none",
              background: "transparent",
              fontSize: "16px",
              fontWeight: 500,
            }}
            theme="dark"
            onClick={({ key }) => navigate(key)}
          />

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {/* Mock Mode Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-white text-xs">Mock</span>
              <Switch
                size="small"
                checked={useMockData}
                onChange={toggleMockMode}
                style={{ backgroundColor: useMockData ? '#52c41a' : '#d9d9d9' }}
              /> 
            </div>

            {isLoggedIn ? (
              <>
                <BellOutlined style={{ fontSize: '22px', color: 'white' }} />
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  arrow
                >
                  <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
                    <Avatar
                      size={32}
                      src={userData.avatar}
                      icon={<UserOutlined />}
                      style={{ 
                        backgroundColor: '#fff',
                        color: '#3B9AB8',
                        marginRight: '8px'
                      }}
                    />
                    <span className="text-white text-base font-medium">
                      {userData.name}
                    </span>
                  </div>
                </Dropdown>
              </>
            ) : (
              <>
                <span
                  className="text-white text-base font-medium cursor-pointer hover:opacity-80"
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
                <Button
                  type="default"
                  style={{
                    borderRadius: 6,
                    padding: "0 24px",
                    fontWeight: 500,
                    backgroundColor: "white",
                    color: "#3B9AB8",
                    borderColor: "white",
                  }}
                  onClick={() => navigate("/register")}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
    </ConfigProvider>
  );
}