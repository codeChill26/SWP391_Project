import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { appointmentApi } from "../../api/appointment-api";
import { serviceApi } from "../../api/service-api";
import MainLayout from "../../layout/MainLayout";
import { List, Space, Tabs, Tag, Typography, Select } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
const { Text, Title } = Typography;
import TabPane from "antd/es/tabs/TabPane";
import StaffLayout from "../../layout/StaffLayout";
import { userApi } from "../../api/user-api";

const statusTabs = [
  { key: "ALL", label: "Tất cả" },
  { key: "PENDING", label: "Đang duyệt" },
  { key: "APPROVE", label: "Đã duyệt" },
  { key: "CANCELLED", label: "Đã hủy" },
  { key: "COMPLETED", label: "Hoàn thành" },
];

const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  return new Date(timeString).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
};

const getStatusColor = (status) => {
  const statusColors = {
    "Đã xác nhận": "green",
    "Chờ xác nhận": "orange",
    "Đã hủy": "red",
    "Hoàn thành": "blue",
    "Đang khám": "purple",
  };
  return statusColors[status] || "default";
};
export const StaffAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("PENDING");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" hoặc "desc"
  
  const sortOptions = [
    { value: "asc", label: "Cũ nhất trước" },
    { value: "desc", label: "Mới nhất trước" },
  ];

  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await appointmentApi.getAppointments();
      setAppointments(response);
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      const response = await serviceApi.getServices();
      setServices(response);
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await userApi.getUsers();
      setUsers(response);
    };
    fetchUsers();
  }, []);

  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  const filteredAppointments = (activeTab === "ALL"
    ? appointments
    : appointments.filter((app) => app.status === activeTab)
  ).sort((a, b) => {
    const dateA = new Date(a.appointmentTime);
    const dateB = new Date(b.appointmentTime);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <StaffLayout activeMenu="staff/appointment" pageTitle="Appointment List">
      <div className="flex justify-between items-center mb-4">
        <Tabs activeKey={activeTab} onChange={setActiveTab} className="flex-1">
          {statusTabs.map((tab) => (
            <TabPane tab={tab.label} key={tab.key} />
          ))}
        </Tabs>
        <Select
          value={sortOrder}
          onChange={handleSortChange}
          options={sortOptions}
          style={{ width: 150 }}
          prefix={<ClockCircleOutlined />}
          placeholder="Sắp xếp theo thời gian"
        />
      </div>

      {filteredAppointments.length === 0 ? (
        <Text type="secondary">Không có lịch hẹn nào</Text>
      ) : (
        <List
          dataSource={filteredAppointments}
          renderItem={(appointment) => {
            const service =
              appointment.serviceId && services && services.length > 0
                ? services.find(
                    (service) => service.id === appointment.serviceId
                  )
                : null;
            const user =
              appointment.userId && users && users.length > 0
                ? users.find((user) => user.id === appointment.userId)
                : null;
            const doctor =
              appointment.doctorId && users && users.length > 0
                ? users.find((user) => user.id === appointment.doctorId)
                : null;

            return (
              <List.Item>
                <div
                  className="w-full"
                  onClick={() => navigate(`/staff/appointment/${appointment.id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <Title level={5} style={{ margin: 0 }}>
                      {service ? service.name : "Loading..."}
                    </Title>
                    <Tag color={getStatusColor(appointment.status)}>
                      {appointment.status || "Unknown"}
                    </Tag>
                  </div>
                  <Space direction="vertical" size="small" className="w-full">
                    <Text type="secondary">
                      Bệnh nhân: {user ? user.name || user.fullname : "Không rõ"}
                    </Text>
                    {doctor && (
                      <Text type="secondary">
                        Bác sĩ: {doctor.name || doctor.fullname}
                      </Text>
                    )}
                    <Text type="secondary">
                      Thời gian: {formatTime(appointment.appointmentTime)}
                    </Text>
                    {appointment.patientNotes && (
                      <Text type="secondary">
                        Ghi chú: {appointment.patientNotes}
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
    </StaffLayout>
  );
};
