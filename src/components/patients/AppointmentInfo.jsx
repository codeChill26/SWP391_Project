import {
  Info,
  MedicalInformationOutlined,
  Person,
  Schedule,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { FaDiagnoses } from "react-icons/fa";
import { userApi } from "../../api/user-api";
import { serviceApi } from "../../api/service-api";

export const AppointmentInfo = ({ appointment }) => {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await userApi.getUsers();
      setUsers(response);
    };
    fetchUsers();
  }, []);
  useEffect(() => {
    const fetchServices = async () => {
      const response = await serviceApi.getServices();
      setServices(response);
    };
    fetchServices();
  }, []);

  const service = services?.find((s) => s.id === appointment.serviceId);
  const patient = users?.find((u) => u.id === appointment.userId);
  const doctor = users?.find((u) => u.id === appointment.doctorId);
  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
        {appointment === null ? (
          <div className="flex justify-center items-center h-40">
            <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3B9AB8] mr-2"></span>
            <span className="text-[#3B9AB8] font-medium">
              Đang tải dữ liệu...
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-icons text-gray-400">
                <Person />
              </span>
              <span className="font-medium">Bệnh nhân:</span>
              <span>
                {patient ? patient.name || patient.fullname : "Không rõ"}
              </span>
            </div>
            {doctor && (
              <div className="flex items-center gap-2">
                <span className="material-icons text-gray-400">
                  <Person />
                </span>
                <span className="font-medium">Bác sĩ phụ trách:</span>
                <span>{doctor.name || doctor.fullname}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="material-icons text-gray-400">
                <MedicalInformationOutlined />
              </span>
              <span className="font-medium">Dịch vụ:</span>
              <span>{service ? service.name : "Không rõ"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-icons text-gray-400">
                <Schedule />
              </span>
              <span className="font-medium">Thời gian hẹn:</span>
              <span>
                {new Date(appointment.appointmentTime).toLocaleString("vi-VN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-icons text-gray-400">
                <Info />
              </span>
              <span className="font-medium">Trạng thái:</span>
              <span
                className={`px-2 py-1 rounded text-white ${
                  appointment.status === "Đã xác nhận"
                    ? "bg-green-500"
                    : appointment.status === "Chờ xác nhận"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              >
                {appointment.status}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="material-icons text-gray-400">
                  <FaDiagnoses />
                </span>
                <span className="font-medium">Kết luận:</span>
              </div>
              <p className="italic ml-2">
                {appointment.conclusion || "Chưa có"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
