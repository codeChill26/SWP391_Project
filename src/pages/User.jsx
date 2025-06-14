import React, { useState, useEffect } from "react";
import {
  AiOutlineAppstore,
  AiOutlineCalendar,
  AiOutlineUser,
  AiOutlineTool,
  AiOutlineQuestionCircle,
  AiOutlineLogout,
} from "react-icons/ai";
import { FaStar, FaRegStar, FaUserCircle, FaBell, FaChevronDown, FaEllipsisV } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const documents = [
  { id: 1, title: "Blood report", date: "May 14, 2023, 13:25 PM", starred: true },
  { id: 2, title: "Dr. Inglai\'s Prescription", date: "May 14, 2023, 13:25 PM", starred: false },
  { id: 3, title: "Blood report", date: "May 14, 2023, 13:25 PM", starred: false },
  { id: 4, title: "Blood report", date: "May 14, 2023, 13:25 PM", starred: true },
  { id: 5, title: "Blood report", date: "May 14, 2023, 13:25 PM", starred: true },
  { id: 6, title: "Blood report", date: "May 6, 2023, 13:25 PM", starred: false },
  { id: 7, title: "Blood report", date: "May 7, 2023, 13:25 PM", starred: false },
  { id: 8, title: "Blood report", date: "May 8, 2023, 13:25 PM", starred: false },
];

const tabs = [
  "General",
  "Consultation History",
  "Patient Documents"
];

const sidebarMenu = [
  { label: "Dashboard", icon: <AiOutlineAppstore size={22} />, key: "dashboard" },
  { label: "Calendar", icon: <AiOutlineCalendar size={22} />, key: "calendar" },
  { label: "Profile", icon: <AiOutlineUser size={22} />, key: "profile" },
  { label: "Service", icon: <AiOutlineTool size={22} />, key: "service" },
  { label: "Help", icon: <AiOutlineQuestionCircle size={22} />, key: "help" },
  { label: "Logout", icon: <AiOutlineLogout size={22} />, key: "logout" },
];

const User = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeMenu, setActiveMenu] = useState("profile");
  const [displayName, setDisplayName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    if (!storedUsername || !token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch('https://api-genderhealthcare.purintech.id.vn/api/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const users = await response.json();
          const currentUser = users.find(user => user.name === storedUsername || user.email === storedUsername);
          if (currentUser) {
            setUserData(currentUser);
            setDisplayName(currentUser.name);
          } else {
            setDisplayName(storedUsername);
          }
        } else {
          console.error('Failed to fetch users:', response.status, response.statusText);
          setDisplayName(storedUsername);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setDisplayName(storedUsername);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleMenuClick = (key) => {
    if (key === 'logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      navigate('/');
    } else {
      setActiveMenu(key);
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="flex min-h-screen bg-[#F7F7F7]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col justify-between py-6 px-4">
        <div>
          <div className="flex items-center mb-10">
            <img src="/src/assets/images/imagePrimary.png" alt="GenHealth Logo" className="w-12 h-12 mr-2" />
            <span className="text-[#3B9AB8] font-bold text-2xl">GenHealth</span>
          </div>
          <nav className="flex flex-col gap-2">
            {sidebarMenu.map((item) => (
              <button
                key={item.key}
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-lg
                  transition
                  ${activeMenu === item.key
                    ? "bg-[#3B9AB8] text-white font-semibold border-l-4 border-[#217a99]"
                    : "text-gray-600 hover:bg-[#F0F8FB]"}
                  ${item.key === "logout" ? "mt-2" : ""}
                `}
                onClick={() => handleMenuClick(item.key)}
              >
                <span className={activeMenu === item.key ? "text-white" : "text-[#3B9AB8]"}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-gray-500 text-lg">Hi, {displayName}</div>
            <div className="text-2xl font-bold">Profile</div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500">EN <FaChevronDown className="inline ml-1" /></span>
            <FaBell className="text-gray-400 text-xl" />
            <div className="flex items-center gap-2">
              <FaUserCircle className="text-2xl text-gray-400" />
              <span className="font-semibold">{displayName}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab, idx) => (
            <button
              key={tab}
              className={`px-6 py-2 rounded-t-lg font-medium ${
                activeTab === idx
                  ? "bg-white border border-b-0 border-gray-200 text-[#3B9AB8]"
                  : "bg-gray-100 text-gray-500"
              }`}
              onClick={() => setActiveTab(idx)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === 0 && (
          <div className="bg-white rounded-xl shadow p-6">
            {/* Profile Image, Name and Gender Section */}
            <div className="flex items-center gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                <img 
                  src="/src/assets/images/imagePrimary.png" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{displayName}</h3>
                <p className="text-gray-600">Male</p>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                <button 
                  onClick={handleEdit}
                  className="bg-[#3B9AB8] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#2d7a94] transition-colors"
                >
                  {isEditing ? 'Save' : 'Edit'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-600 mb-1">Full Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B9AB8]"
                    />
                  ) : (
                    <div className="text-gray-800 font-medium">{displayName}</div>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-600 mb-1">Date of Birth</label>
                  {isEditing ? (
                    <input 
                      type="date" 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B9AB8]"
                    />
                  ) : (
                    <div className="text-gray-800 font-medium">01/01/1990</div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">Age</label>
                  {isEditing ? (
                    <input 
                      type="number" 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B9AB8]"
                    />
                  ) : (
                    <div className="text-gray-800 font-medium">33</div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">Phone Number</label>
                  {isEditing ? (
                    <input 
                      type="tel" 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B9AB8]"
                    />
                  ) : (
                    <div className="text-gray-800 font-medium">+84 123 456 789</div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">Email</label>
                  {isEditing ? (
                    <input 
                      type="email" 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B9AB8]"
                    />
                  ) : (
                    <div className="text-gray-800 font-medium">user@example.com</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Consultation History</h2>
            <p className="text-gray-500">No consultation history available.</p>
          </div>
        )}

        {activeTab === 2 && (
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">Documents</div>
              <button className="bg-[#3B9AB8] text-white px-4 py-2 rounded-lg font-medium">+ New Document</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {documents.map((doc) => (
                <div key={doc.id} className="bg-[#F9F9F9] rounded-xl p-4 shadow border border-gray-100 relative">
                  <button className="absolute top-3 left-3 text-[#FFD600] text-lg">
                    {doc.starred ? <FaStar /> : <FaRegStar className="text-gray-300" />}
                  </button>
                  <button className="absolute top-3 right-3 text-gray-400">
                    <FaEllipsisV />
                  </button>
                  <div className="flex justify-center mb-3">
                    <img src="/src/assets/images/doc.png" alt="doc" className="w-20 h-20 object-contain" />
                  </div>
                  <div className="font-semibold text-gray-700 text-center">{doc.title}</div>
                  <div className="text-xs text-gray-400 text-center">{doc.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default User;