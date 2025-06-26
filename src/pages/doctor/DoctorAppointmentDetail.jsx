import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { appointmentApi } from "../../api/appointment-api";
import { AppointmentInfo } from "../../components/patients/AppointmentInfo";
import StaffLayout from "../../layout/StaffLayout";
import UpdateAppointmentStatusModal from "../../components/UpdateAppointmentStatusModal";
import { Button } from "antd";
import { serviceApi } from "../../api/service-api";
import DoctorLayout from "../../layout/DoctorLayout";
import CompleteAppointmentModal from "../../components/CompleteAppointmentModal";

export const DoctorAppointmentDetail = () => {
  // get the booking id from the url
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [doctors, setDoctors] = useState([]);


  useEffect(() => {
    // get the booking data from the database
    const fetchAppointment = async () => {
      const booking = await appointmentApi.getAppointmentById(id);
      setAppointment(booking);
    };
    fetchAppointment();
  }, [id]);


  const handleUpdateAppointmentStatus = async (values) => {
    // values: { id, status, doctorId }
    // Gọi API cập nhật ở đây
    try {
      const response = await appointmentApi.completeAppointment(appointment.id, values);
      setModalVisible(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  return (
    <DoctorLayout activeMenu="staff/appointment" pageTitle="Appointment Detail">
      {/* Content based on active tab */}
      <div>
        <h2 className="font-bold text-xl mb-4 text-[#3B9AB8] flex items-center gap-2">
          Thông tin chi tiết cuộc hẹn
        </h2>
        <AppointmentInfo appointment={appointment} />

        <Button type="primary" onClick={() => setModalVisible(true)}>
          Hoàn thành khám bệnh
        </Button>
      </div>

      <div>
        <h2 className="font-bold text-xl mb-4 text-[#3B9AB8] flex items-center gap-2">
          Kết quả chẩn đoán
        </h2>

        <div></div>
      </div>

      <CompleteAppointmentModal
        visible={modalVisible}
        onOk={handleUpdateAppointmentStatus}
        onCancel={() => setModalVisible(false)}
        appointment={appointment}
      />
    </DoctorLayout>
  );
};
