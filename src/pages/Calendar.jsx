import React from 'react';
import MainLayout from '../layout/MainLayout';
import { useUser } from '../context/UserContext';
import { Calendar } from 'antd';

const CalendarPage = () => {
  const { userData } = useUser();

  const onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  return (
    <MainLayout activeMenu="calendar" displayName={userData.name || 'User'}>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Calendar</h1>
        <Calendar onPanelChange={onPanelChange} />
      </div>
    </MainLayout>
  );
};

export default CalendarPage;
