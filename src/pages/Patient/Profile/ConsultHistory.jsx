import { useEffect, useState } from "react";
import { appointmentApi } from "../../../api/appointment-api";
import { serviceApi } from "../../../api/service-api";
import { userApi } from "../../../api/user-api";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import { List, Space, Tag, Typography } from "antd";
import { getStatusColor, getStatusLabel } from "../../../utils/statusColor";
import dayjs from "dayjs";
const { Text, Title } = Typography;

const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  return dayjs(timeString).format("DD/MM/YYYY HH:mm");
};

export default function ConsultHistory() {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const { userData, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      console.log(userData);
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
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await userApi.getUsers();
      setUsers(response);
    };
    fetchUsers();
  }, []);

  const filteredAppointments = appointments
    //.filter(app => app.status === activeTab)
    .sort((a, b) => new Date(b.appointmentTime) - new Date(a.appointmentTime));
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Lịch sử tư vấn</h2>
      {filteredAppointments.length === 0 ? (
        <p className="text-gray-500">Không có lịch hẹn nào.</p>
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
            console.log("services", services);
            return (
              <List.Item>
                <div
                  className="w-full"
                  onClick={() => navigate(`/appointment/${appointment.id}`)}
                >
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
                      Bệnh nhân: {user ? user.name || user.fullname : "Không rõ"}
                    </Text>
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
    </div>
  );
}
