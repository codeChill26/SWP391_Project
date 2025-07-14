import React, { useState } from "react";
import { FaEdit, FaStar, FaRegStar, FaEllipsisV } from "react-icons/fa";
import MainLayout from "../../layout/MainLayout";
import { toast } from "react-hot-toast";
import { useUser } from "../../context/UserContext";
import UserProfile from './Profile/UserProfile';
import ConsultHistory from "./Profile/ConsultHistory";

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

const PatientProfile = () => {
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
                {userData.name || 'User Name'}
              </h3>
              <p className="text-gray-600">{userData.role || 'Role/Occupation'}</p>
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
          <UserProfile />
        )}

        {activeTab === 1 && (
          <ConsultHistory/>
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

export default PatientProfile;
