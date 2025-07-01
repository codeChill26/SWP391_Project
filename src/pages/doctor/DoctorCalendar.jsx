import React, { useEffect, useState } from 'react';
import MainLayout from '../../layout/MainLayout';
import { useUser } from '../../context/UserContext';
import { Calendar } from 'antd';
import axios from 'axios';
  import DoctorLayout from '../../layout/DoctorLayout';
  import AppointmentDrawer from './Profile/AppointmentDrawer';

const DoctorCalendar = () => {
  const { userData } = useUser();
  const [appointments, setAppointments] = useState([]);
  const [serviceDetails, setServiceDetails] = useState({});
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateAppointments, setSelectedDateAppointments] = useState([]);

  useEffect(() => {
    if (!userData.id) return;
    axios.get(`https://api-genderhealthcare.purintech.id.vn/api/appointments`)
      .then(async res => {
        const appts = res.data || [];
        setAppointments(appts.filter(appt => appt.doctorId === userData.id));
        // Fetch service details for each appointment
        const serviceIds = appts.map(a => a.serviceId).filter(Boolean);
        const uniqueServiceIds = [...new Set(serviceIds)];
        const serviceMap = {};
        await Promise.all(uniqueServiceIds.map(async (sid) => {
          try {
            const resp = await axios.get(`https://api-genderhealthcare.purintech.id.vn/api/services/${sid}`);
            serviceMap[sid] = resp.data;
          } catch {}
        }));
        setServiceDetails(serviceMap);
      })
      .catch(() => setAppointments([]));
  }, [userData.id]);

  // Render dấu chấm màu cho từng ngày
  const dateCellRender = (value) => {
    const appts = appointments.filter(appt => {
      if (!appt.appointmentTime) return false;
      const apptDate = new Date(appt.appointmentTime);
      // So sánh ngày (không so sánh giờ)
      return apptDate.getFullYear() === value.year() &&
        apptDate.getMonth() === value.month() &&
        apptDate.getDate() === value.date();
    });
    if (appts.length === 0) return null;
    return (
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {appts.map((appt, idx) => {
          let color = '#52c41a'; // xanh
          if ((appt.status || '').toLowerCase() === 'cancelled') color = '#ff4d4f'; // đỏ
          else if ((appt.status || '').toLowerCase() === 'pending') color = '#faad14'; // vàng
          const service = appt.serviceId ? serviceDetails[appt.serviceId] : null;
          return (
            <li key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: color, marginRight: 6 }}></span>
              <span style={{ fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 80 }}>
                {service ? service.name : 'Loading...'}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  // Xử lý khi click vào ngày
  const onDateSelect = (value) => {
    const selectedDateStr = value.format('YYYY-MM-DD');
    const appts = appointments.filter(appt => {
      if (!appt.appointmentTime) return false;
      const apptDate = new Date(appt.appointmentTime);
      return apptDate.getFullYear() === value.year() &&
        apptDate.getMonth() === value.month() &&
        apptDate.getDate() === value.date();
    });
    
    setSelectedDate(selectedDateStr);
    setSelectedDateAppointments(appts);
    setDrawerVisible(true);
  };

  const onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  return (
    <DoctorLayout activeMenu="doctor/calendar" displayName={userData.name || 'User'}>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Calendar</h1>
        <Calendar 
          onPanelChange={onPanelChange} 
          dateCellRender={dateCellRender}
          onSelect={onDateSelect}
        />
      </div>

      <AppointmentDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        selectedDate={selectedDate}
        appointments={selectedDateAppointments}
        serviceDetails={serviceDetails}
      />
    </DoctorLayout>
  );
};

export default DoctorCalendar;
