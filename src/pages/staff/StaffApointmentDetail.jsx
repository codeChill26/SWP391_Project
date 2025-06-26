import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { appointmentApi } from "../../api/appointment-api";
import { AppointmentInfo } from "../../components/patients/AppointmentInfo";
import StaffLayout from "../../layout/StaffLayout";
import UpdateAppointmentStatusModal from "../../components/UpdateAppointmentStatusModal";
import { Button } from "antd";
import { serviceApi } from "../../api/service-api";

export const StaffAppointmentDetail = () => {
  // get the booking id from the url
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);

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

  const handleCompleteAppointment = async (values) => {
    try {
      await appointmentApi.completeAppointment(appointment.id, values); // Gọi API
      setCompleteModalVisible(false);
      window.location.reload(); // hoặc gọi lại fetchAppointment() nếu muốn mượt hơn
    } catch (error) {
      // Xử lý lỗi nếu cần
    }
  };
  return (
    <StaffLayout activeMenu="staff/appointment" pageTitle="Appointment Detail">
      {/* Content based on active tab */}
      <div>
        <h2 className="font-bold text-xl mb-4 text-[#3B9AB8] flex items-center gap-2">
          Thông tin chi tiết cuộc hẹn
        </h2>
        <AppointmentInfo appointment={appointment} />

        <Button type="primary" onClick={() => setCompleteModalVisible(true)}>
          Hoàn thành khám bệnh
        </Button>
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
    </StaffLayout>
  );
};
