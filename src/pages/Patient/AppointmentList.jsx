import React, { useEffect, useState } from "react";
import { UserLayout } from "../../layout/userLayout";
import MainLayout from "../../layout/MainLayout";
import { appointmentApi } from "../../api/appointment-api";
import { useUser } from "../../context/UserContext";
import { List, Tag, Space, Typography, Tabs } from "antd";
import { serviceApi } from "../../api/service-api";
import { useNavigate } from "react-router-dom";
import { getStatusColor, getStatusLabel } from "../../utils/statusColor";
import dayjs from "dayjs";
const { Text, Title } = Typography;
const { TabPane } = Tabs;

// Service details mapping
const serviceDetails = {
  1: { name: "Khám tổng quát", price: 200000 },
  2: { name: "Xét nghiệm máu", price: 150000 },
  3: { name: "Tư vấn sức khỏe", price: 100000 },
  // Thêm các dịch vụ khác nếu cần
};

// Format time function
const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  return dayjs(timeString).format("DD/MM/YYYY HH:mm");
};

const statusMap = {
  PENDING: "Đang duyệt",
  APPROVE: "Đã duyệt",
  CANCEL: "Đã hủy",
  COMPLETED: "Hoàn thành",
};

const statusTabs = [
  { key: "PENDING", label: "Đang duyệt" },
  { key: "APPROVE", label: "Đã duyệt" },
  { key: "CANCEL", label: "Đã hủy" },
  { key: "COMPLETED", label: "Hoàn thành" },
];

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const { userData, loading } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("PENDING");

  useEffect(() => {
    const fetchAppointments = async () => {
      console.log(userData)
      if (!loading && userData && userData.id) {
        const response = await appointmentApi.getAppointmentByUserId(
          userData.id
        );
        setAppointments(response);
        console.log(response);
      }
    };
    
    fetchAppointments();
  }, [userData, loading]);

  useEffect(() => {
    const fetchServices = async () => {
      const response = await serviceApi.getServices();
      setServices(response);
    };
    fetchServices();
  }, [])

  const filteredAppointments = appointments
    .filter(app => app.status === activeTab)
    .sort((a, b) => new Date(b.appointmentTime) - new Date(a.appointmentTime));

  return (
    <MainLayout activeMenu="appointment">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="mb-6"
      >
        {statusTabs.map(tab => (
          <TabPane tab={tab.label} key={tab.key} />
        ))}
      </Tabs>

      {filteredAppointments.length === 0 ? (
        <Text type="secondary">Không có lịch hẹn nào</Text>
      ) : (
        <List
          dataSource={filteredAppointments}
          renderItem={(appointment) => {
            const service = appointment.serviceId && services && services.length > 0 
            ? services.find(service => service.id === appointment.serviceId) 
            : null;
            console.log('services', services)
            return (
              <List.Item>
                <div className="w-full" onClick={() => navigate(`/appointment/${appointment.id}`)}>
                  <div className="flex justify-between items-start mb-2">
                    <Title level={5} style={{ margin: 0 }}>
                      {service ? service.name : "Loading..."}
                    </Title>
                    <Tag color={getStatusColor(appointment.status)}>
                      {getStatusLabel(appointment.status)}
                    </Tag>
                  </div>
                  <Space direction="vertical" size="small" className="w-full">
                    <Text type="secondary">
                      Thời gian: {formatTime(appointment.appointmentTime)}
                    </Text>
                    {appointment.patientNotes && (
                      <Text type="secondary">Ghi chú: {appointment.patientNotes}</Text>
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
    </MainLayout>
  );
};

export default AppointmentList;
