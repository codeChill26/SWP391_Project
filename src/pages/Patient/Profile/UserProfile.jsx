import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useUser } from '../../../context/UserContext';

const UserProfile = () => {
  const { userData, updateUserData } = useUser();
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [editingData, setEditingData] = useState({});

  // Hàm chuyển đổi gender từ tiếng Anh sang tiếng Việt
  const getGenderDisplay = (gender) => {
    switch (gender) {
      case 'male':
        return 'Nam';
      case 'female':
        return 'Nữ';
      case 'other':
        return 'Khác';
      default:
        return 'N/A';
    }
  };

  // Khởi tạo editingData
  React.useEffect(() => {
    setEditingData({
      name: userData?.name || '',
      email: userData?.email || '',
      phoneNumber: userData?.phoneNumber || '',
      dob: userData?.dob || '',
      gender: userData?.gender || '',
    });
  }, [userData]);

  // Hàm tính tuổi
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Hàm bắt đầu chỉnh sửa
  const handleEditPersonalInfo = () => {
    setEditingData({
      name: userData?.name || '',
      email: userData?.email || '',
      phoneNumber: userData?.phoneNumber || '',
      dob: userData?.dob || '',
      gender: userData?.gender || '',
      role: userData?.role || '',
    });
    setIsEditingPersonalInfo(true);
  };

  // Hàm hủy chỉnh sửa
  const handleCancelEdit = () => {
    setIsEditingPersonalInfo(false);
  };

  // Hàm lưu thông tin
  const handleSavePersonalInfo = async () => {
    try {
      console.log(editingData)
      await updateUserData(editingData);
      setIsEditingPersonalInfo(false);
      message.success('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Error updating user data:', error);
      message.error('Cập nhật thông tin thất bại. Vui lòng thử lại!');
    }
  };

  return (
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
              <div className="text-gray-800 font-medium">{userData?.name || 'N/A'}</div>
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
              <div className="text-gray-800 font-medium">{userData?.dob || 'N/A'}</div>
            )}
          </div>

          <div>
            <label className="block text-gray-500 text-sm mb-1">Age</label>
            <div className="text-gray-800 font-medium">
              {userData?.dob ? calculateAge(userData.dob) : 'N/A'}
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
              <div className="text-gray-800 font-medium">{userData?.phoneNumber || 'N/A'}</div>
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
              <div className="text-gray-800 font-medium">{userData?.email || 'N/A'}</div>
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
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            ) : (
              <div className="text-gray-800 font-medium">{getGenderDisplay(userData?.gender)}</div>
            )}
          </div>
        </div>

        {/* Account Settings Section */}
        {/* <div className="mt-8 pt-6 border-t border-gray-200">
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
        </div> */}
      </div>
    </>
  );
};

export default UserProfile;
