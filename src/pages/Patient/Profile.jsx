import React, { useState } from "react";
import { FaEdit, FaStar, FaRegStar, FaEllipsisV } from "react-icons/fa";
import MainLayout from "../../layout/MainLayout";
import { toast } from "react-hot-toast";
import { useUser } from "../../context/UserContext";

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

const Profile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [editingData, setEditingData] = useState({});
  const { userData, updateUserData } = useUser();

  const handleEditPersonalInfo = () => {
    setEditingData({
      name: userData.name,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      dob: userData.dob,
      gender: userData.gender,
    });
    setIsEditingPersonalInfo(true);
  };

  const handleSavePersonalInfo = async () => {
    try {
      const success = await updateUserData(editingData);
      if (success) {
        setIsEditingPersonalInfo(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    setIsEditingPersonalInfo(false);
    setEditingData({});
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
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
    <MainLayout activeMenu="profile" displayName={userData.name || 'User Name'}>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Profile Header Section */}
        <div className="bg-white rounded-xl shadow mb-6 p-6 relative">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
              <img 
                src="/src/assets/images/imagePrimary.png"
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {userData.name || 'User Name'} <span className="text-gray-500 font-normal">({userData.gender || 'Not specified'})</span>
              </h3>
              <p className="text-gray-600">{userData.role || 'Role/Occupation'}</p>
              <p className="text-gray-500 text-sm">Leeds, United Kingdom</p>
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
                {isEditingPersonalInfo ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSavePersonalInfo}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                      Save
                    </button>
                    <button 
                      onClick={handleCancelEdit}
                      className="bg-transparent text-gray-600 px-4 py-2 rounded-lg font-medium border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleEditPersonalInfo}
                    className="bg-transparent text-gray-600 px-4 py-2 rounded-lg font-medium border border-gray-300 hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    Edit <FaEdit />
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div>
                  <label className="block text-gray-500 text-sm mb-1">Name</label>
                  {isEditingPersonalInfo ? (
                    <input 
                      type="text" 
                      value={editingData.name}
                      onChange={(e) => setEditingData({...editingData, name: e.target.value})}
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
                      value={editingData.dob || ''}
                      onChange={(e) => setEditingData({...editingData, dob: e.target.value})}
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
                      value={editingData.phoneNumber || ''}
                      onChange={(e) => setEditingData({...editingData, phoneNumber: e.target.value})}
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
                      value={editingData.email || ''}
                      onChange={(e) => setEditingData({...editingData, email: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B9AB8]"
                    />
                  ) : (
                    <div className="text-gray-800 font-medium">{userData.email || 'N/A'}</div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-500 text-sm mb-1">Gender</label>
                  {isEditingPersonalInfo ? (
                    <select 
                      value={editingData.gender || ''}
                      onChange={(e) => setEditingData({...editingData, gender: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B9AB8]"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <div className="text-gray-800 font-medium">{userData.gender || 'N/A'}</div>
                  )}
                </div>
              </div>

              {/* Account Settings Section */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Settings</h3>
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
                        <div className="block w-14 h-8 rounded-full bg-gray-200"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                      </div>
                      <div className="ml-3 font-medium text-gray-700">
                        Enable Notifications
                      </div>
                    </label>
                  </div>
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
            <h2 className="text-xl font-semibold mb-4">Patient Documents</h2>
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FaEllipsisV className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{doc.title}</h4>
                      <p className="text-sm text-gray-500">{doc.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-yellow-500">
                      {doc.starred ? <FaStar className="text-yellow-500" /> : <FaRegStar />}
                    </button>
                    <button className="text-blue-500 hover:text-blue-600 font-medium">View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Profile;
