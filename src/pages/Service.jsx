import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaClock, FaDollarSign, FaChevronRight } from "react-icons/fa";
import MainLayout from "../layout/MainLayout";

const allServices = [
  {
    id: 1,
    name: "Hormone Level Test (Estrogen, Testosterone)",
    specialty: "Endocrinology",
    yearsExperience: "8 years",
    price: 80,
    time: "08:00 AM-11:00 AM",
    image: "/src/assets/images/service1.png",
  },
  {
    id: 2,
    name: "Genetic Counseling for Gender Identity",
    specialty: "Genetics & Counseling",
    yearsExperience: "10 years",
    price: 120,
    time: "09:00 AM-12:00 PM",
    image: "/src/assets/images/service2.png",
  },
  {
    id: 3,
    name: "Gender-Affirming Hormone Therapy Consultation",
    specialty: "Endocrinology",
    yearsExperience: "15 years",
    price: 150,
    time: "01:00 PM-04:00 PM",
    image: "/src/assets/images/service3.png",
  },
  {
    id: 4,
    name: "Fertility Preservation Consultation",
    specialty: "Reproductive Health",
    yearsExperience: "10 years",
    price: 100,
    time: "10:00 AM-01:00 PM",
    image: "/src/assets/images/service1.png",
  },
  {
    id: 5,
    name: "Sexual Health Screening (STIs)",
    specialty: "Infectious Diseases",
    yearsExperience: "7 years",
    price: 70,
    time: "09:00 AM-12:00 PM",
    image: "/src/assets/images/service2.png",
  },
  {
    id: 6,
    name: "Vocal Feminization/Masculinization Therapy",
    specialty: "Speech Pathology",
    yearsExperience: "9 years",
    price: 90,
    time: "02:00 PM-05:00 PM",
    image: "/src/assets/images/service3.png",
  },
  {
    id: 7,
    name: "Mental Health Support for Transitioning Individuals",
    specialty: "Psychiatry & Counseling",
    yearsExperience: "12 years",
    price: 130,
    time: "03:00 PM-06:00 PM",
    image: "/src/assets/images/service1.png",
  },
  {
    id: 8,
    name: "Post-Surgical Care and Recovery Planning",
    specialty: "Post-Op Care",
    yearsExperience: "10 years",
    price: 110,
    time: "09:00 AM-12:00 PM",
    image: "/src/assets/images/service2.png",
  },
  {
    id: 9,
    name: "Legal Name and Gender Marker Change Assistance",
    specialty: "Legal Aid & Advocacy",
    yearsExperience: "6 years",
    price: 75,
    time: "10:00 AM-01:00 PM",
    image: "/src/assets/images/service3.png",
  },
  {
    id: 10,
    name: "Support Groups for LGBTQ+ Individuals",
    specialty: "Community Support",
    yearsExperience: "5 years",
    price: 40,
    time: "06:00 PM-08:00 PM",
    image: "/src/assets/images/service1.png",
  },
];

const Service = () => {
  const [services, setServices] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [payment, setPayment] = useState('cash');
  const [notes, setNotes] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://api-genderhealthcare.purintech.id.vn/api/services')
      .then(res => setServices(res.data))
      .catch(() => setServices([]));
  }, []);

  const userId = Number(localStorage.getItem('userId'));

  const showBookingModal = (service) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedService(null);
    setDate(null);
  };

  const handleBooking = async () => {
    if (!date || !selectedService) {
      message.error('Vui lòng chọn ngày!');
      return;
    }
    try {
      const userId = Number(localStorage.getItem('userId'));
      const appointmentTime = moment(date).startOf('day').toISOString();
      const data = {
        user_id: userId,
        service_id: selectedService.id,
        appointment_time: appointmentTime,
        specialization: 'General',
        status: 'pending',
        notes: 'nothing',
        conclusion: null,
        payment_status: 'pending'
      };
      await axios.post('https://api-genderhealthcare.purintech.id.vn/api/appointments/schedule', data);
      message.success('Đặt lịch thành công!');
      setModalOpen(false);
      setSelectedService(null);
      setDate(null);
    } catch (err) {
      message.error('Đặt lịch thất bại!');
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