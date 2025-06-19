import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useMock } from './MockContext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    dob: "",
    gender: "",
    role: "",
    id: null,
    avatar: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { useMockData, mockLogin, mockUpdateUser, mockFetchUser } = useMock();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (token && username) {
      if (useMockData) {
        // Sử dụng mock data
        const mockUser = mockFetchUser(username);
        setUserData(mockUser);
        setIsLoggedIn(true);
        setLoading(false);
      } else {
        fetchUserData(token, username);
      }
    } else {
      setLoading(false);
    }
  }, [useMockData, mockFetchUser]);

  const fetchUserData = async (token, username) => {
    try {
      const response = await axios.get('https://api-genderhealthcare.purintech.id.vn/api/users', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data) {
        const userProfile = response.data.find(user => user.name === username) || response.data[0];
        if (userProfile) {
          setUserData({
            name: userProfile.name || username,
            email: userProfile.email || '',
            phoneNumber: userProfile.phoneNumber || '',
            dob: userProfile.dob || '',
            gender: userProfile.gender || '',
            role: userProfile.role || '',
            id: userProfile.id,
            avatar: userProfile.avatar || '',
          });
          setIsLoggedIn(true);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Nếu API lỗi, sử dụng mock data
      const mockUser = mockFetchUser(username);
      setUserData(mockUser);
      setIsLoggedIn(true);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      if (useMockData) {
        // Sử dụng mock login
        const result = await mockLogin(username, password);
        
        if (result.success) {
          setUserData(result.userData);
          setIsLoggedIn(true);
        }
        
        return result;
      }

      // Code API thật (khi useMockData = false)
      const userResponse = await axios.get(
        'https://api-genderhealthcare.purintech.id.vn/api/users',
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      const userData = userResponse.data.find((user) => {
        const email = user.email?.toLowerCase();
        return email === username.toLowerCase();
      });

      if (userData) {
        const response = await axios.post(
          'https://api-genderhealthcare.purintech.id.vn/api/auth/login',
          {
            username: username,
            password: password,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }
        );

        if (response.data.token) {
          const token = response.data.token;
          const inputUsername = username.toLowerCase();

          localStorage.setItem('token', token);
          localStorage.setItem('username', inputUsername);
          localStorage.setItem('userRole', userData.role);

          setUserData({
            name: userData.name || inputUsername,
            email: userData.email || '',
            phoneNumber: userData.phoneNumber || '',
            dob: userData.dob || '',
            gender: userData.gender || '',
            role: userData.role || '',
            id: userData.id,
            avatar: userData.avatar || '',
          });
          setIsLoggedIn(true);

          return {
            success: true,
            role: userData.role,
            message: 'Đăng nhập thành công!'
          };
        } else {
          return {
            success: false,
            message: response.data.message || 'Sai mật khẩu!'
          };
        }
      } else {
        return {
          success: false,
          message: 'Email không tồn tại trong hệ thống!'
        };
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi kết nối. Vui lòng thử lại.'
      };
    }
  };

  const updateUserData = async (updatedData) => {
    try {
      if (useMockData) {
        // Sử dụng mock update
        const result = await mockUpdateUser(userData, updatedData);
        if (result.success) {
          setUserData(result.userData);
        }
        return result.success;
      }

      // Code API thật
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `https://api-genderhealthcare.purintech.id.vn/api/users/${userData.id}`,
        updatedData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        const newData = {
          ...userData,
          ...response.data,
        };
        setUserData(newData);
        localStorage.setItem('username', newData.name);
        return true;
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    setUserData({
      name: "",
      email: "",
      phoneNumber: "",
      dob: "",
      gender: "",
      role: "",
      id: null,
      avatar: "",
    });
    setIsLoggedIn(false);
  };

  return (
    <UserContext.Provider value={{ 
      userData, 
      isLoggedIn, 
      loading,
      login,
      updateUserData, 
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 