import React, { createContext, useState, useContext } from 'react';

const MockContext = createContext();

// Mock user data để test khi API lỗi
export const MOCK_USERS = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phoneNumber: "0123456789",
    dob: "1990-05-15",
    gender: "Male",
    role: "user",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Admin User",
    email: "admin@example.com",
    phoneNumber: "0987654321",
    dob: "1985-03-20",
    gender: "Female",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  }
];

export const MockProvider = ({ children }) => {
  const [useMockData, setUseMockData] = useState(false); // Để mặc định là tắt mock

  const toggleMockMode = () => {
    setUseMockData(!useMockData);
  };

  const mockLogin = async (username, password) => {
    // Mock login - chấp nhận bất kỳ email nào từ MOCK_USERS
    const mockUser = MOCK_USERS.find(user => user.email === username);
    
    if (mockUser) {
      // Giả lập delay để giống API thật
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const token = 'mock-token-' + Date.now();
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('userRole', mockUser.role);

      return {
        success: true,
        userData: mockUser,
        role: mockUser.role,
        message: 'Đăng nhập thành công! (Mock Mode)'
      };
    } else {
      return {
        success: false,
        message: 'Email không tồn tại trong hệ thống!'
      };
    }
  };

  const mockUpdateUser = async (currentUserData, updatedData) => {
    // Mock update - chỉ cập nhật local state
    const newData = {
      ...currentUserData,
      ...updatedData,
    };
    localStorage.setItem('username', newData.name);
    return {
      success: true,
      userData: newData
    };
  };

  const mockFetchUser = (username) => {
    // Mock fetch user data
    const mockUser = MOCK_USERS.find(user => user.email === username) || MOCK_USERS[0];
    return mockUser;
  };

  return (
    <MockContext.Provider value={{
      useMockData,
      toggleMockMode,
      mockLogin,
      mockUpdateUser,
      mockFetchUser,
      mockUsers: MOCK_USERS
    }}>
      {children}
    </MockContext.Provider>
  );
};

export const useMock = () => {
  const context = useContext(MockContext);
  if (!context) {
    throw new Error('useMock must be used within a MockProvider');
  }
  return context;
}; 