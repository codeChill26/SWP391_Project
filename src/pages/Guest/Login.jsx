import { useState } from 'react';
import { Button, Form, Input, Alert, Card } from 'antd';
import { UserOutlined, LockOutlined, CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../../context/UserContext';



const Login = () => {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [form] = Form.useForm();
  const { login } = useUser();
  const navigate = useNavigate();

    const onFinish = async (values) => {
      setLoading(true);
      setLoginError('');
      
      try {
        const userData = await login(values.email,values.password)
        
        if (userData.success) {
        
          toast.success('Đăng nhập thành công!');
          
          
          if (userData.role === 'admin') {
            navigate('/admin/dashboard');
          } else if (userData.role === 'patient') {
            navigate('/');
          } 
          else if (userData.role === 'doctor') {
            navigate('/doctor/dashboard');
          } 
          else if (userData.role === 'staff') {
            navigate('/staff/dashboard');
          } else {
            navigate('/');
          }
        } else {
          setLoginError(userData.message || 'Đăng nhập thất bại!');
          toast.error(userData.message || 'Đăng nhập thất bại!');
        }
      } catch{
        setLoginError('Lỗi kết nối. Vui lòng thử lại.');
        toast.error('Lỗi kết nối. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className='flex h-screen w-screen overflow-hidden'>
      <button
        onClick={() => navigate('/')}
        className='absolute top-4 right-4 z-50 p-2 rounded-full hover:bg-gray-100 transition-colors'
      >
        <CloseOutlined className='text-2xl text-gray-600' />
      </button>

      <div className='hidden md:block w-1/2 h-full relative bg-gray-100'>
        <img
          src='/src/assets/images/side1.png'
          alt='Healthcare Illustration'
          className='absolute top-0 left-0 w-full h-full object-cover'
        />
      </div>

      <div className='w-full md:w-1/2 h-full flex justify-center items-center bg-white p-6 overflow-y-auto'>
        <div className='w-full max-w-md'>
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>Welcome Back</h1>
            <p className='text-gray-600'>Sign in to access your account</p>
          </div>

          <Form form={form} name='login_form' layout='vertical' onFinish={onFinish}>
            <Form.Item
              name='email'
              rules={[{ required: true, message: 'Please input your email address!' }]}
            >
              <Input
                prefix={<UserOutlined className='text-gray-400' />}
                placeholder='Email Address'
                size='large'
                type='email'
              />
            </Form.Item>

            <Form.Item
              name='password'
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className='text-gray-400' />}
                placeholder='Password'
                size='large'
              />
            </Form.Item>

            <div className='flex justify-between items-center mb-6'>
              <Form.Item name='remember' valuePropName='checked' className='mb-0'>
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    className='mr-2 rounded text-blue-500 focus:ring-blue-400'
                  />
                  <span className='text-gray-600'>Remember me</span>
                </div>
              </Form.Item>
              <a href='#' className='text-blue-500 hover:underline'>
                Forgot password?
              </a>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className='w-full h-12 text-lg bg-blue-500 hover:bg-blue-600 border-none'
                loading={loading}
              >
                Sign In
              </Button>
            </Form.Item>

            {loginError && (
              <div style={{ color: 'red', textAlign: 'center', marginTop: 8 }}>
                {loginError}
              </div>
            )}

            <div className='text-center mt-6'>
              <p className='text-gray-600'>
                Don't have an account?{' '}
                <a
                  onClick={() => navigate('/register')}
                  className='text-blue-500 font-medium hover:underline cursor-pointer'
                >
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
