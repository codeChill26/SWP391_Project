import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layout/MainLayout';
import axios from 'axios';

const ServiceUser = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://api-genderhealthcare.purintech.id.vn/api/services')
      .then(res => setServices(res.data))
      .catch(() => setServices([]));
  }, []);

  const handleBooking = (serviceId) => {
    navigate(`/calendar?service=${serviceId}`);
  };

  return (
    <MainLayout activeMenu="services">
      <div className="bg-[#3B9AB8] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Our Services</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Comprehensive gender healthcare services designed to support your journey with expert care and understanding.
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map(service => (
          <div key={service.id} className="bg-white rounded-lg shadow p-6 flex flex-col items-stretch justify-between aspect-square min-h-[300px]">
            <h2 className="text-xl font-bold mb-2">{service.name}</h2>
            <p className="text-gray-600 mb-2">{service.description}</p>
            <p className="text-blue-600 font-semibold mb-2">Giá: {service.price.toLocaleString()} VNĐ</p>
            <div className="flex-1"></div>
            <Button type="primary" style={{ background: '#3B9AB8', borderColor: '#3B9AB8' }} onClick={() => handleBooking(service.id)}>
              Book Now
            </Button>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default ServiceUser;