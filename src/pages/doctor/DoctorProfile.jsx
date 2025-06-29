import React, { useState } from "react";
import { FaEdit, FaStar, FaRegStar, FaEllipsisV } from "react-icons/fa";
import MainLayout from "../../layout/MainLayout";
import { toast } from "react-hot-toast";
import { useUser } from "../../context/UserContext";
import UserProfile from './Profile/UserProfile';
import StaffLayout from "../../layout/StaffLayout";
import DoctorLayout from "../../layout/DoctorLayout";

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

const DoctorProfile = () => {
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
    <DoctorLayout activeMenu="doctor/profile" pageTitle="Profile">
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
            </div>
          </div>
         
        </div>
        <UserProfile />        
      </div>
    </DoctorLayout>
  );
};

export default DoctorProfile;
