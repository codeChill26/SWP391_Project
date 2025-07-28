import {
  Info,
  MedicalInformationOutlined,
  Person,
  Schedule,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { FaDiagnoses } from "react-icons/fa";
import { userApi } from "../../api/user-api";
import { useParams } from "react-router-dom";
import StaffLayout from "../../layout/StaffLayout";

export const Patient = () => {
  const [userv, setUsers] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await userApi.getUserById(id);
      setUsers(response);
    };
    fetchUser();
  }, [id]);

  // const userv =
  //   userv.length > 0 ? userv.find((user) => user.role === "patient") : null;

  return (
    <StaffLayout activeMenu="staff/profilespatient" pageTitle="Appointment">
      <div className="space-y-6 p-6 bg-gray-100 min-h-screen">
        {userv === null ? (
          <div className="flex justify-center items-center h-40">
            <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3B9AB8] mr-2"></span>
            <span className="text-[#3B9AB8] font-medium">
              Đang tải dữ liệu...
            </span>
          </div>
        ) : (
          <>
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
                    {userv.name || userv.fullname || "Không rõ"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="text-gray-800">
                    {userv.email || "Không có"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">
                    Số điện thoại:
                  </span>
                  <span className="text-gray-800">
                    {userv.phoneNumber || "Không có"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">
                    Mô tả của bệnh nhân:
                  </span>
                  <span className="text-gray-800">
                    {userv.patientNotes || "Không có"}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </StaffLayout>
  );
};
