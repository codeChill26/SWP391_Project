import React, { useEffect, useState } from 'react';
import { Drawer, List, Tag, Typography, Space } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../../api/user-api';

const { Text, Title } = Typography;

const AppointmentDrawer = ({ 
  visible, 
  onClose, 
  selectedDate, 
  appointments, 
  serviceDetails,
}) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await userApi.getUsers();
      setUsers(response);
    };
    fetchUsers();
  }, []);
  // Sắp xếp appointments theo thời gian
  const sortedAppointments = [...appointments].sort((a, b) => {
    return moment(a.appointmentTime).valueOf() - moment(b.appointmentTime).valueOf();
  });

  // Hàm lấy màu tag theo trạng thái
  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      case 'pending':
        return 'orange';
      default:
        return 'blue';
    }
  };

  // Hàm format thời gian
  const formatTime = (dateString) => {
    return moment(dateString).format('HH:mm');
  };

  return (
    <Drawer
      title={`Lịch hẹn ngày ${selectedDate}`}
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
    >
      {sortedAppointments.length === 0 ? (
        <div className="text-center py-8">
          <Text type="secondary">Không có lịch hẹn nào trong ngày này</Text>
        </div>
      ) : (
        <List
          dataSource={sortedAppointments}
          renderItem={(appointment) => {
            const service = appointment.serviceId ? serviceDetails[appointment.serviceId] : null;
            const patient = users && appointment.userId ? users.find(u => u.id === appointment.userId) : null;
            const doctor = users && appointment.doctorId ? users.find(u => u.id === appointment.doctorId) : null;
            return (
              <List.Item>
                <div className="w-full" onClick={() => navigate(`/doctor/appointment/${appointment.id}`)}>
                  <div className="flex justify-between items-start mb-2">
                    <Title level={5} style={{ margin: 0 }}>
                      {service ? service.name : 'Loading...'}
                    </Title>
                    <Tag color={getStatusColor(appointment.status)}>
                      {appointment.status || 'Unknown'}
                    </Tag>
                  </div>
                  <Space direction="vertical" size="small" className="w-full">
                    {/* Thông tin bệnh nhân */}
                    {patient && (
                      <Text type="secondary">
                        Bệnh nhân: {patient.name || patient.fullname} ({patient.email || 'N/A'})
                      </Text>
                    )}
                    {/* Thông tin bác sĩ */}
                    {doctor && (
                      <Text type="secondary">
                        Bác sĩ: {doctor.name || doctor.fullname} ({doctor.email || 'N/A'})
                      </Text>
                    )}
                    <Text type="secondary">
                      Thời gian: {formatTime(appointment.appointmentTime)}
                    </Text>
                    {appointment.notes && (
                      <Text type="secondary">
                        Ghi chú: {appointment.notes}
                      </Text>
                    )}
                    {service && (
                      <Text type="secondary">
                        Giá: {service.price?.toLocaleString()} VNĐ
                      </Text>
                    )}
                  </Space>
                </div>
              </List.Item>
            );
          }}
        />
      )}
    </Drawer>
  );
};

export default AppointmentDrawer; 