import React from 'react';
import { Drawer, List, Tag, Typography, Space } from 'antd';
import moment from 'moment';

const { Text, Title } = Typography;

const AppointmentDrawer = ({ 
  visible, 
  onClose, 
  selectedDate, 
  appointments, 
  serviceDetails 
}) => {
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
      {appointments.length === 0 ? (
        <div className="text-center py-8">
          <Text type="secondary">Không có lịch hẹn nào trong ngày này</Text>
        </div>
      ) : (
        <List
          dataSource={appointments}
          renderItem={(appointment) => {
            const service = appointment.serviceId ? serviceDetails[appointment.serviceId] : null;
            return (
              <List.Item>
                <div className="w-full">
                  <div className="flex justify-between items-start mb-2">
                    <Title level={5} style={{ margin: 0 }}>
                      {service ? service.name : 'Loading...'}
                    </Title>
                    <Tag color={getStatusColor(appointment.status)}>
                      {appointment.status || 'Unknown'}
                    </Tag>
                  </div>
                  <Space direction="vertical" size="small" className="w-full">
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