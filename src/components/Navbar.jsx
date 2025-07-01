import React from "react";
import { Button, Menu, ConfigProvider, Avatar, Dropdown, Switch } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { HomeOutlined, AppstoreOutlined, FileTextOutlined, QuestionCircleOutlined, InfoCircleOutlined, CalendarOutlined, BellOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import { useUser } from '../context/UserContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, userData, isLoggedIn } = useUser();
  const name = userData?.name || '';
  const avatar = userData?.avatar || '';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined style={{ fontSize: '18px', color: '#fff' }} />,
      label: "Home",
    },
    {
      key: "/service",
      icon: <AppstoreOutlined style={{ fontSize: '18px', color: '#fff' }} />,
      label: "Services",
    },
    {
      key: "/blog",
      icon: <FileTextOutlined style={{ fontSize: '18px', color: '#fff' }} />,
      label: "Blog",
    },
    {
      key: "/calendar",
      icon: <CalendarOutlined style={{ fontSize: '18px', color: '#fff' }} />,
      label: "Appointments",
    },
    {
      key: "/about",
      icon: <InfoCircleOutlined style={{ fontSize: '18px', color: '#fff' }} />,
      label: "About",
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
            {isLoggedIn ? (
              <>
                <BellOutlined style={{ color: '#fff' }} className="text-2xl ml-4 cursor-pointer" />
                <span className="text-white text-base font-medium mx-2">{name}</span>
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item key="profile" icon={<UserOutlined style={{color: '#3B9AB8'}} />} onClick={() => navigate('/profile')}>
                        Profile
                      </Menu.Item>
                      <Menu.Item key="logout" icon={<LogoutOutlined style={{color: '#3B9AB8'}} />} onClick={handleLogout}>
                        Logout
                      </Menu.Item>
                    </Menu>
                  }
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <span className="flex items-center cursor-pointer">
                    {avatar ? (
                      <img src={avatar} alt="avatar" className="w-9 h-9 rounded-full object-cover border-2 border-white" />
                    ) : (
                      <UserOutlined style={{ color: '#fff' }} className="text-2xl" />
                    )}
                  </span>
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