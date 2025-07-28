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
import { getStatusColorClass, getStatusLabel } from "../../utils/statusColor";

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

  const service = appointment?.serviceId
    ? services?.find((s) => s.id === appointment.serviceId)
    : null;
  const patient = appointment?.userId
    ? users?.find((u) => u.id === appointment.userId)
    : null;
  const doctor = appointment?.doctorId
    ? users?.find((u) => u.id === appointment.doctorId)
    : null;

  return (
    <div className="space-y-6">
      {appointment === null ? (
        <div className="flex justify-center items-center h-40">
          <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3B9AB8] mr-2"></span>
          <span className="text-[#3B9AB8] font-medium">
            Đang tải dữ liệu...
          </span>
        </div>
      ) : (
        <>
          {/* Thông tin lịch hẹn */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Schedule className="text-[#3B9AB8]" />
              Thông tin lịch hẹn
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-icons text-gray-400">
                  <MedicalInformationOutlined />
                </span>
                <span className="font-medium text-gray-600">Dịch vụ:</span>
                <span className="text-gray-800">
                  {service ? service.name : "Không rõ"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="material-icons text-gray-400">
                  <Schedule />
                </span>
                <span className="font-medium text-gray-600">
                  Thời gian hẹn:
                </span>
                <span className="text-gray-800">
                  {new Date(appointment.appointmentTime).toLocaleString(
                    "vi-VN",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="material-icons text-gray-400">
                  <Info />
                </span>
                <span className="font-medium text-gray-600">Trạng thái:</span>
                <span
                  className={`px-2 py-1 rounded text-white ${getStatusColorClass(
                    appointment.status
                  )}`}
                >
                  {getStatusLabel(appointment.status)}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-icons text-gray-400">
                    <FaDiagnoses />
                  </span>
                  <span className="font-medium text-gray-600">Mô tả của bệnh nhân:</span>
                </div>
                <div className="ml-6 p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-800">
                    {appointment.patientNotes || "Chưa có"}
                  </p>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-icons text-gray-400">
                    <FaDiagnoses />
                  </span>
                  <span className="font-medium text-gray-600">Kết luận:</span>
                </div>
                <div className="ml-6 p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-800">
                    {appointment.conclusion || "Chưa có"}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-icons text-gray-400">
                    <FaDiagnoses />
                  </span>
                  <span className="font-medium text-gray-600">
                    Kế hoạch điều trị:
                  </span>
                </div>
                <div className="ml-6 p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-800">
                    {appointment.treatmentPlan || "Chưa có"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Thông tin bệnh nhân và bác sĩ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thông tin bệnh nhân */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Person className="text-[#3B9AB8]" />
                Thông tin bệnh nhân
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">
                    Tên bệnh nhân:
                  </span>
                  <span className="text-gray-800">
                    {patient ? patient.name || patient.fullname : "Không rõ"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="text-gray-800">
                    {patient ? patient.email : "Không có"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">
                    Số điện thoại:
                  </span>
                  <span className="text-gray-800">
                    {patient ? patient.phoneNumber : "Không có"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">
                    Mô tả của bệnh nhân:
                  </span>
                  <span className="text-gray-800">
                    {appointment.patientNotes ?? "Không có"}
                  </span>
                </div>
              </div>
            </div>

            {/* Thông tin bác sĩ */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Person className="text-[#3B9AB8]" />
                Thông tin bác sĩ
              </h3>
              <div className="space-y-3">
                {doctor ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-600">
                        Bác sĩ phụ trách:
                      </span>
                      <span className="text-gray-800">
                        {doctor.name || doctor.fullname}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-600">Email:</span>
                      <span className="text-gray-800">
                        {doctor.email || "Không có"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-600">
                        Số điện thoại:
                      </span>
                      <span className="text-gray-800">
                        {doctor.phoneNumber || "Không có"}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500 italic">
                    Chưa có bác sĩ được phân công
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
