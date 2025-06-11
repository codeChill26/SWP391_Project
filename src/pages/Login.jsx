import React from 'react';
import { Button, Form, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";


const Login = () => {
  const onFinish = (values) => {
    console.log('Received values:', values);
  };
 const navigate = useNavigate();
  return (
    <div className='flex h-screen w-screen overflow-hidden'>
      {/* Left side - Image */}
      <div className='hidden md:block w-1/2 h-full relative bg-gray-100'>
        <img 
          src="/src/assets/images/side.png" 
          alt="Healthcare Illustration" 
          className='absolute top-0 left-0 w-full h-full object-cover ' 
        />
      </div>
      
      {/* Right side - Form */}
      <div className='w-full md:w-1/2 h-full flex justify-center items-center bg-white p-6 overflow-y-auto'>
        <div className='w-full max-w-md'>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to access your account</p>
          </div>

          <Form
            name="login_form"
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input 
                prefix={<UserOutlined className="text-gray-400" />} 
                placeholder="Username or Email" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <div className="flex justify-between items-center mb-6">
              <Form.Item name="remember" valuePropName="checked" className="mb-0">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2 rounded text-blue-500 focus:ring-blue-400"/>
                  <span className="text-gray-600">Remember me</span>
                </div>
              </Form.Item>
              <a href="#" className="text-blue-500 hover:underline">Forgot password?</a>
            </div>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="w-full h-12 text-lg bg-blue-500 hover:bg-blue-600 border-none"
              >
                Sign In
              </Button>
            </Form.Item>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <a  onClick={() => navigate("/register")}  className="text-blue-500 font-medium hover:underline">
                  Sign up
                </a>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;