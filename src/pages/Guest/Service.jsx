import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Button, Modal, DatePicker, TimePicker, Radio, Input, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { appointmentApi } from '../../api/appointment-api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const Service = () => {
  const [services, setServices] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState(null);
  const [notes, setNotes] = useState('');
  

  useEffect(() => {
    axios.get('https://api-genderhealthcare.purintech.id.vn/api/services')
      .then(res => setServices(res.data))
      .catch(() => setServices([]));
  }, []);

  const showBookingModal = (service) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedService(null);
    setDate(null);
    setNotes('');
  };

  const handleBooking = async () => {
    if (!date || !selectedService) {
      message.error('Vui lòng chọn ngày!');
      return;
    }
    try {
      const userId = Number(localStorage.getItem('id'));
      const appointmentTime = dayjs(date).startOf('day').utc().add(7, 'hours').toISOString();
      
      console.log(typeof date);
      console.log("date", date)
      console.log("appointmentTime", appointmentTime)

      const data = {
        service_id: selectedService.id,
        userId: userId,
        specialization: 'ANDROLOGY', // TODO: Chuyên khoa nam khoa (ANDROLOGY), nữ khoa GYNECOLOGY
        patientNotes: notes || '',
        appointmentTime: appointmentTime,
        paymentMethod: 'pending'
      };
      //const response = await appointmentApi.scheduleAppointment(data);
      //console.log("schedule data", response)
      message.success('Đặt lịch thành công!');
      setModalOpen(false);
      setSelectedService(null);
      setDate(null);
      setNotes('');
    } catch (error) {
      message.error('Đặt lịch thất bại!');
      console.log("error", error)
    
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
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
              <Button
                type="primary"
                style={{ background: '#3B9AB8', borderColor: '#3B9AB8' }}
                onClick={() => showBookingModal(service)}
              >
                Book Now
              </Button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
      <Modal
        title="Đặt lịch dịch vụ"
        open={modalOpen}
        onCancel={handleModalClose}
        footer={null}
      >
        <div className="mb-4">
          <label>Tên dịch vụ:</label>
          <Input value={selectedService?.name || ''} disabled />
        </div>
        <div className="mb-4">
          <label>Giá dịch vụ:</label>
          <Input value={selectedService ? `${selectedService.price.toLocaleString()} VNĐ` : ''} disabled />
        </div>
        <div className="mb-4">
          <label>Chọn ngày:</label>
          <DatePicker
            className="w-full"
            value={date}
            onChange={setDate}
            disabledDate={d => d && d < new Date()}
          />
        </div>
        <div className="mb-4">
          <label>Nêu tình trạng (Nếu có):</label>
          <Input 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Nhập tình trạng của bạn..."
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleModalClose} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button
            type="primary"
            style={{ background: '#3B9AB8', borderColor: '#3B9AB8' }}
            onClick={handleBooking}
          >
            Tiếp tục
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Service;