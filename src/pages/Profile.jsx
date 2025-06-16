import React, { useState, useEffect } from "react";
import { FaEdit, FaStar, FaRegStar, FaEllipsisV } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import MainLayout from "../layout/MainLayout";

const documents = [
  { id: 1, title: "Blood report", date: "May 14, 2023, 13:25 PM", starred: true },
  { id: 2, title: "Dr. Inglai's Prescription", date: "May 14, 2023, 13:25 PM", starred: false },
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

const User = () => {
  const [activeTab, setActiveTab] = useState(0); // Initialize activeTab
  const [displayName, setDisplayName] = useState("");
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phoneNumber: "", // Changed from phoneNum to phoneNumber as per API
    dob: "",
    gender: "",
    role: "", // Added role for Bio
    id: null, // Add id to state
  });
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
        const response = await axios.get('https://api-genderhealthcare.purintech.id.vn/api/users', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.data) {
          // Assuming the API returns an array, we take the first user or find the specific user
          // For now, let's assume the first object in the array is the relevant user.
          // In a real app, you'd likely filter by ID or a specific user endpoint.
          const userProfile = response.data.find(user => user.name === storedUsername) || response.data[0];

          if (userProfile) {
            setUserData({
              name: userProfile.name || storedUsername,
              email: userProfile.email || '',
              phoneNumber: userProfile.phoneNumber || '',
              dob: userProfile.dob || '',
              gender: userProfile.gender || '',
              role: userProfile.role || '', // Set role
              id: userProfile.id, // Store the user ID
            });
            setDisplayName(userProfile.name || storedUsername);
          } else {
            console.warn('User profile not found in API response for stored username. Using fallback.');
            setDisplayName(storedUsername);
            setUserData(prev => ({ ...prev, name: storedUsername }));
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setDisplayName(storedUsername);
        setUserData(prev => ({
          ...prev,
          name: storedUsername
        }));
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEditPersonalInfo = () => {
    setIsEditingPersonalInfo(!isEditingPersonalInfo);
  };

  const handleSavePersonalInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `https://api-genderhealthcare.purintech.id.vn/api/users/${userData.id}`,
        {
          name: userData.name, // Use userData.name directly for save
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          dob: userData.dob,
          gender: userData.gender,
          role: userData.role, // Include role in save
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        // Assuming API returns updated user data
        const updatedProfile = response.data; // The API returns an array, adjust if it's a single object
        setUserData({
          name: updatedProfile.name || userData.name,
          email: updatedProfile.email || userData.email,
          phoneNumber: updatedProfile.phoneNumber || userData.phoneNumber,
          dob: updatedProfile.dob || userData.dob,
          gender: updatedProfile.gender || userData.gender,
          role: updatedProfile.role || userData.role,
          id: updatedProfile.id || userData.id, // Ensure ID is updated if returned, or kept
        });
        setDisplayName(updatedProfile.name || userData.name); // Update display name after save
        setIsEditingPersonalInfo(false);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A'; // Changed to N/A for consistency with image
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
    <MainLayout activeMenu="profile" displayName={displayName}>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Profile Header Section */}
        <div className="bg-white rounded-xl shadow mb-6 p-6 relative">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
              <img 
                src="/src/assets/images/imagePrimary.png" // Placeholder image
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {userData.name || 'User Name'} <span className="text-gray-500 font-normal">({userData.gender || 'Not specified'})</span>
              </h3>
              <p className="text-gray-600">{userData.role || 'Role/Occupation'}</p>
              <p className="text-gray-500 text-sm">Leeds, United Kingdom</p> {/* Hardcoded as per image */}
            </div>
          </div>
          <button 
            onClick={handleEditPersonalInfo}
            className="absolute top-6 right-6 bg-transparent text-gray-600 px-4 py-2 rounded-lg font-medium border border-gray-300 hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            Edit <FaEdit />
          </button>
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
          <>
            {/* Personal Information Section */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                <button 
                    onClick={isEditingPersonalInfo ? handleSavePersonalInfo : handleEditPersonalInfo}
                    className="bg-transparent text-gray-600 px-4 py-2 rounded-lg font-medium border border-gray-300 hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    {isEditingPersonalInfo ? 'Save' : 'Edit'} <FaEdit />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div>
                  <label className="block text-gray-500 text-sm mb-1">Name</label>
                  {isEditingPersonalInfo ? (
                    <input 
                      type="text" 
                      value={userData.name}
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B9AB8]"
                    />
                  ) : (
                    <div className="text-gray-800 font-medium">{userData.name || 'N/A'}</div>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-500 text-sm mb-1">Date Of Birth</label>
                  {isEditingPersonalInfo ? (
                    <input 
                      type="date" 
                      value={userData.dob || ''}
                      onChange={(e) => setUserData({...userData, dob: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B9AB8]"
                    />
                  ) : (
                    <div className="text-gray-800 font-medium">{userData.dob || 'N/A'}</div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-500 text-sm mb-1">Age</label>
                  <div className="text-gray-800 font-medium">
                    {userData.dob ? calculateAge(userData.dob) : 'N/A'}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-500 text-sm mb-1">Phone Number</label>
                  {isEditingPersonalInfo ? (
                    <input 
                      type="tel" 
                      value={userData.phoneNumber || ''}
                      onChange={(e) => setUserData({...userData, phoneNumber: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B9AB8]"
                    />
                  ) : (
                    <div className="text-gray-800 font-medium">{userData.phoneNumber || 'N/A'}</div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-500 text-sm mb-1">Email Address</label>
                  {isEditingPersonalInfo ? (
                    <input 
                      type="email" 
                      value={userData.email || ''}
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B9AB8]"
                    />
                  ) : (
                    <div className="text-gray-800 font-medium">{userData.email || 'N/A'}</div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-500 text-sm mb-1">Sex</label>
                  {isEditingPersonalInfo ? (
                    <input 
                      type="text" 
                      value={userData.gender || ''}
                      onChange={(e) => setUserData({...userData, gender: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B9AB8]"
                    />
                  ) : (
                    <div className="text-gray-800 font-medium">{userData.gender || 'N/A'}</div>
                  )}
                </div>
              </div>
            </div>

            {/* General Section */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">General</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                <div>
                  <label className="block text-gray-500 text-sm mb-1">Change Password</label>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors">
                    Change
                  </button>
                </div>
                <div>
                  <label className="block text-gray-500 text-sm mb-1">Notifications</label>
                  <label htmlFor="toggle-notifications" className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" id="toggle-notifications" className="sr-only" />
                      <div className="block bg-gray-200 w-14 h-8 rounded-full"></div>
                      <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                    </div>
                    <div className="ml-3 text-gray-700 font-medium">Enable Notifications</div>
                  </label>
                </div>
              </div>
            </div>
          </>
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
      </div>
    </MainLayout>
  );
};

export default User;
