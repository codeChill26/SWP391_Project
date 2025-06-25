import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaCalendarAlt,  FaChevronRight, FaClock, FaDollarSign } from "react-icons/fa";
import MainLayout from "../../layout/MainLayout";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import { toast } from "react-toastify";

const services = [
  {
    id: 1,
    name: "Online Consultation",
    specialty: "General Practice",
    yearsExperience: "5 years",
    price: 25,
    time: "10:00 AM-01:00 PM",
    image: "/src/assets/images/service1.png", // Placeholder image
  },
  {
    id: 2,
    name: "In-person Checkup",
    specialty: "Pediatrics",
    yearsExperience: "8 years",
    price: 35,
    time: "09:00 AM-12:00 PM",
    image: "/src/assets/images/service2.png", // Placeholder image
  },
  {
    id: 3,
    name: "Lab Test",
    specialty: "Pathology",
    yearsExperience: "10 years",
    price: 15,
    time: "08:00 AM-10:00 AM",
    image: "/src/assets/images/service3.png", // Placeholder image
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serviceDetails, setServiceDetails] = useState({});

  useEffect(() => {
    if (!userData.id) return;
    setLoading(true);
    axios.get(`https://api-genderhealthcare.purintech.id.vn/api/appointments/user/${userData.id}`)
      .then(async res => {
        let appts = res.data || [];
        appts = appts.filter(a => !['cancelled', 'rejected', 'pending'].includes((a.status || '').toLowerCase()));
        setAppointments(appts);
        setError(null);
        // Fetch service details for each appointment
        const serviceIds = appts.map(a => a.serviceId).filter(Boolean);
        const uniqueServiceIds = [...new Set(serviceIds)];
        const serviceMap = {};
        await Promise.all(uniqueServiceIds.map(async (sid) => {
          try {
            const resp = await axios.get(`https://api-genderhealthcare.purintech.id.vn/api/services/${sid}`);
            serviceMap[sid] = resp.data;
          } catch {
            toast.error("error");
          }
        }));
        setServiceDetails(serviceMap);
      })
      .catch(() => {
        setAppointments([]);
        setError("Failed to load appointments");
      })
      .finally(() => setLoading(false));
  }, [userData.id]);

  return (
    <MainLayout activeMenu="dashboard" displayName={userData.name || 'User'}>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-gray-500 text-lg">Hi, {userData.name || 'User'}</h1>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
        </div>

        {/* Search Bar Section */}
        <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between mb-8">
          <div className="flex items-center flex-grow">
            <FaSearch className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search service"
              className="flex-grow border-none focus:outline-none placeholder-gray-400 text-gray-700"
            />
          </div>
          <button className="ml-8 bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors">
            Search
          </button>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Banner */}
          <div className="lg:col-span-2 bg-blue-100 rounded-xl overflow-hidden shadow relative flex items-center p-8"
            style={{ backgroundImage: 'url(/src/assets/images/doctors_banner.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="relative z-10 text-white p-6">
              <h3 className="text-3xl font-bold mb-2">No need to visit local hospitals</h3>
              <p className="text-xl mb-4">Get your consultation online</p>
              <p className="text-lg font-medium">Audio/text/video/in-person</p>
              <div className="flex items-center mt-6">
                <div className="flex -space-x-2 overflow-hidden mr-3">
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1491528323818-fdd1faba65f8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                </div>
                <span className="text-sm font-medium">+180 doctors are online</span>
              </div>
            </div>
          </div>

          {/* Right Column: Upcoming Appointments */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Upcoming Appointments</h3>
              <button onClick={() => navigate('/calendar')} className="text-blue-500 text-sm font-medium flex items-center">
                View All <FaChevronRight className="ml-1 text-xs" />
              </button>
            </div>
            {/* Mini Appointment List */}
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-400">{error}</div>
            ) : appointments.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <FaCalendarAlt className="text-4xl mx-auto mb-2 text-gray-300" />
                <p>No upcoming appointments</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[350px] overflow-y-auto">
                {appointments.slice(0, 5).map((appt) => {
                  const service = appt.serviceId ? serviceDetails[appt.serviceId] : null;
                  const dateObj = appt.appointmentTime ? new Date(appt.appointmentTime) : null;
                  const day = dateObj ? dateObj.toLocaleDateString('en-US', { weekday: 'short' }) : '';
                  const date = dateObj ? dateObj.getDate() : '';
                  const month = dateObj ? dateObj.toLocaleDateString('en-US', { month: 'short' }) : '';
                  const time = dateObj ? dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';
                  return (
                    <div key={appt.id} className="flex flex-col bg-blue-50 rounded-lg p-3 shadow-sm border border-blue-100">
                      <div className="font-bold text-lg text-gray-900">
                        {day} {date} {month}
                      </div>
                      <div className="text-md text-gray-700 mb-1">
                        {time}
                      </div>
                      <div className="text-sm text-blue-900 font-semibold">
                        {service ? service.name : 'Loading...'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recommended Service Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recommended Service</h2>
            <button onClick={() => navigate('/service')} className="text-blue-500 font-medium flex items-center">
              View All <FaChevronRight className="ml-1 text-sm" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <div key={service.id} className="bg-white rounded-xl shadow p-6 border border-gray-100 flex flex-col items-center text-center">
                <img src={service.image} alt={service.name} className="w-24 h-24 rounded-full object-cover mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{service.name}</h3>
                <p className="text-gray-600 text-sm">{service.specialty} | {service.yearsExperience} experience</p>
                <div className="flex justify-center my-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{service.specialty}</span>
                </div>
                <div className="flex items-center justify-between w-full mt-auto pt-4 border-t border-gray-200">
                  <div className="flex items-center text-gray-600">
                    <FaClock className="mr-1 text-sm" /> {service.time}
                  </div>
                  <div className="flex items-center text-gray-800 font-semibold">
                    <FaDollarSign className="mr-1 text-sm" /> {service.price}
                  </div>
                </div>
                <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors w-full">
                  Book an appointment
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
