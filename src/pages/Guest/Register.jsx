import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      console.log('Attempting registration with:', values);
      const response = await axios.post('https://api-genderhealthcare.purintech.id.vn/api/auth/register', {
        name: values.name,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
        dob: values.dob,
        gender: values.gender
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: true
      });
      console.log('Response:', response);
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response && error.response.data) {
        message.error(error.response.data || 'Đăng ký thất bại. Vui lòng thử lại.');
      } else {
        message.error('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex h-screen w-screen overflow-hidden'>
      {/* Close button */}
      <button
        onClick={() => navigate('/')}
        className='absolute top-4 right-4 z-50 p-2 rounded-full hover:bg-gray-100 transition-colors'
      >
        <CloseOutlined className='text-2xl text-gray-600' />
      </button>

      {/* Hình minh họa bên trái giống Login */}
      <div className='hidden md:block w-1/2 h-full relative bg-gray-100'>
        <img
          src='/src/assets/images/side1.png'
          alt='Healthcare Illustration'
          className='absolute top-0 left-0 w-full h-full object-cover'
        />
      </div>
      
      {/* Right side - Form */}
      <div className='w-full md:w-1/2 h-full flex justify-center items-center bg-white p-6 overflow-y-auto'>
        <div className='w-full max-w-md'>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
            <p className="text-gray-600">Join us to get started</p>
          </div>

          <Form
            name="register_form"
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input 
                prefix={<UserOutlined className="text-gray-400" />} 
                placeholder="Họ và tên" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined className="text-gray-400" />} 
                placeholder="Địa chỉ email" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^0\d{9,11}$/, message: 'Số điện thoại không hợp lệ!' }
              ]}
            >
              <Input 
                prefix={<UserOutlined className="text-gray-400" />} 
                placeholder="Số điện thoại" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="dob"
              rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
            >
              <Input 
                type="date"
                size="large"
                placeholder="Ngày sinh"
              />
            </Form.Item>

            <Form.Item
              name="gender"
              rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
            >
              <select 
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                size="large"
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Mật khẩu"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Xác nhận mật khẩu"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="w-full h-12 text-lg bg-blue-500 hover:bg-blue-600 border-none"
                loading={loading}
              >
                Register
              </Button>
            </Form.Item>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account?{' '}
                <a onClick={() => navigate("/login")} className="text-blue-500 font-medium hover:underline cursor-pointer">
                  Sign in
                </a>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;