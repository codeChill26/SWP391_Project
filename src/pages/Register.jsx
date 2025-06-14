import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      console.log('Attempting registration with:', values);
      
      const response = await fetch('http://api-genderhealthcare.purintech.id.vn/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          fullName: values.fullName,
          email: values.email,
          password: values.password
        })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        message.success('Registration successful! Please login.');
        navigate('/login');
      } else {
        message.error(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      message.error('An error occurred. Please try again.');
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

      {/* Left side - Image */}
      <div className='hidden md:block w-1/2 h-full relative bg-gray-100'>
        <img 
          src="/src/assets/images/side.png" 
          alt="Healthcare Illustration" 
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
              name="fullName"
              rules={[{ required: true, message: 'Please input your full name!' }]}
            >
              <Input 
                prefix={<UserOutlined className="text-gray-400" />} 
                placeholder="Full Name" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined className="text-gray-400" />} 
                placeholder="Email Address" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Confirm Password"
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