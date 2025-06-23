import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userid || decoded.userId || decoded.id;
        if (userId) {
          fetchUserDataById(token, userId);
        } else {
          setLoading(false);
        }
      } catch (e) {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserDataById = async (token, userId) => {
    try {
      const response = await axios.get(`https://api-genderhealthcare.purintech.id.vn/api/users/${userId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        const userProfile = response.data;
        setUserData({
          name: userProfile.name || userProfile.fullname||'',
          email: userProfile.email || '',
          phoneNumber: userProfile.phoneNumber || '',
          dob: userProfile.dob || '',
          gender: userProfile.gender || '',
          role: userProfile.role || '',
          id: userProfile.id,
          avatar: userProfile.avatar || '',
        });
        localStorage.setItem('name', userProfile.name || userProfile.fullname || '');
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error fetching user data by id:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        'https://api-genderhealthcare.purintech.id.vn/api/auth/login',
        {
          email: email,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      if (response.data && response.data.token) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        // Decode token để lấy userId
        const decoded = jwtDecode(token);
        const userId = decoded.userid || decoded.userId || decoded.id;
        if (userId) {
          await fetchUserDataById(token, userId);
        }
        return {
          success: true,
          role: decoded.role,
          message: 'Đăng nhập thành công!'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Đăng nhập thất bại!'
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
        return true;
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
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
