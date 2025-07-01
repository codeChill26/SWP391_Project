import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { appointmentApi } from "../../api/appointment-api";
import { AppointmentInfo } from "../../components/patients/AppointmentInfo";
import StaffLayout from "../../layout/StaffLayout";
import UpdateAppointmentStatusModal from "../../components/UpdateAppointmentStatusModal";
import { Button } from "antd";
import { serviceApi } from "../../api/service-api";
import { medicalTestApi } from "../../api/medicalTest-api";
import MedicalTestCard from "../../components/MedicalTestCard";

export const StaffAppointmentDetail = () => {
  // get the booking id from the url
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [medicalTests, setMedicalTests] = useState([]);

  useEffect(() => {
    // get the booking data from the database
    const fetchAppointment = async () => {
      const booking = await appointmentApi.getAppointmentById(id);
      setAppointment(booking);
    };
    fetchAppointment();
  }, [id]);

  useEffect(() => {
    // get the list of doctors from the database
    const fetchDoctors = async () => {
      const doctorsList = await appointmentApi.getDoctors();
      setDoctors(doctorsList);
    };
    fetchDoctors();
  }, []);
  console.log("Fetch appointment for staff", appointment);

  const handleUpdateAppointmentStatus = async (values) => {
    // values: { id, status, doctorId }
    // Gọi API cập nhật ở đây
    try {
      const response = await appointmentApi.updateAppointmentStatus(values);
      setModalVisible(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };
  useEffect(() => {
    if (appointment && appointment.id) {
      const fetchMedicalTests = async () => {
        const tests = await medicalTestApi.getMedicalTestByAppointmentId(
          appointment.id
        );
        setMedicalTests(tests);
      };
      fetchMedicalTests();
    }
  }, [appointment]);

  return (
    <StaffLayout activeMenu="staff/appointment" pageTitle="Appointment Detail">
      {/* Content based on active tab */}
      <div>
        <h2 className="font-bold text-xl mb-4 text-[#3B9AB8] flex items-center gap-2">
          Thông tin chi tiết cuộc hẹn
        </h2>
        <AppointmentInfo appointment={appointment} />

        {appointment && appointment.status !== "COMPLETED" && (
          <Button type="primary" onClick={() => setModalVisible(true)}>
            Cập nhật trạng thái
          </Button>
        )}
      </div>

      <div>
        <h2 className="font-bold text-xl mb-4 text-[#3B9AB8] flex items-center gap-2">
          Kết quả chẩn đoán
        </h2>

        {medicalTests.length === 0 ? (
          <div>Không có xét nghiệm nào.</div>
        ) : (
          <div>
            {medicalTests.map((test) => (
              <MedicalTestCard key={test.testId} test={test} />
            ))}
          </div>
        )}
      </div>

      <UpdateAppointmentStatusModal
        visible={modalVisible}
        onOk={handleUpdateAppointmentStatus}
        onCancel={() => setModalVisible(false)}
        appointment={appointment}
        doctors={doctors}
      />
    </StaffLayout>
  );
};
