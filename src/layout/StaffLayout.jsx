import React from "react";
import {
  AiOutlineAppstore,
  AiOutlineCalendar,
  AiOutlineUser,
  AiOutlineTool,
  AiOutlineQuestionCircle,
  AiOutlineLogout,
  AiOutlineHome,
  AiOutlineUserSwitch,
} from "react-icons/ai";
import { FaUserCircle, FaBell, FaChevronDown, FaSyringe, FaHospitalUser, FaUserInjured } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getRoleLabel } from "../utils/getRoleLabel";
import { Tag } from "antd";

const sidebarMenu = [
  // {
  //   label: "Dashboard",
  //   icon: <AiOutlineAppstore size={22} />,
  //   key: "staff/dashboard",
  // },
  {
    label: "Calendar",
    icon: <AiOutlineCalendar size={22} />,
    key: "staff/calendar",
  },
  {
    label: "Appointment",
    icon: <AiOutlineCalendar size={22} />,
    key: "staff/appointment",
  },
  {
    label: "Patients",
    icon: <FaUserInjured size={22} />,
    key: "staff/profilespatient",
  },
  // { label: "Services", icon: <FaSyringe size={22} />, key: "staff/services" },
  {
    label: "Profiles",
    icon: <AiOutlineUser size={22} />,
    key: "staff/profiles",
  },
  { label: "Logout", icon: <AiOutlineLogout size={22} />, key: "logout" },
];

const StaffLayout = ({ children, activeMenu, pageTitle }) => {
  const navigate = useNavigate();
  const { userData, logout } = useUser();

  // Lấy tên người dùng trực tiếp từ localStorage
  const name = localStorage.getItem("name") || "User";

  const handleMenuClick = (key) => {
    if (key === "logout") {
      logout();
      navigate("/");
    } else {
      navigate(`/${key}`);
    }
  };

  return (
    <div className="flex h-screen bg-[#F7F7F7]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col justify-between py-6 px-4">
        <div>
          <div className="flex items-center mb-10">
            <img
              src="/src/assets/images/imagePrimary.png"
              alt="GenHealth Logo"
              className="w-12 h-12 mr-2"
            />
            <span className="text-[#3B9AB8] font-bold text-2xl">GenHealth</span>
          </div>
          <nav className="flex flex-col gap-2">
            {sidebarMenu.map((item) => (
              <button
                key={item.key}
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-lg
                  transition
                  relative z-10  // Thêm position relative và z-index
                  ${
                    activeMenu === item.key
                      ? "bg-[#3B9AB8] text-white font-semibold border-l-4 border-[#217a99]"
                      : "text-gray-600 hover:bg-[#F0F8FB]"
                  }
                  ${item.key === "logout" ? "mt-2" : ""}
                `}
                onClick={() => handleMenuClick(item.key)}
              >
                <span
                  className={
                    activeMenu === item.key ? "text-white" : "text-[#3B9AB8]"
                  }
                >
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-8 pb-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-gray-500 text-lg">Hi, {name}</div>
              <Tag>{getRoleLabel(userData.role)}</Tag>
              <div className="text-2xl font-bold capitalize">{pageTitle}</div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-500">
                EN <FaChevronDown className="inline ml-1" />
              </span>
              <FaBell className="text-gray-400 text-xl" />
              <div className="flex items-center gap-2">
                <FaUserCircle className="text-2xl text-gray-400" />
                <span className="font-semibold">{name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 p-8 pt-0 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
};

export default StaffLayout;
