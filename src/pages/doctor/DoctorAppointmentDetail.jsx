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
import { medicalTestApi } from "../../api/medicalTest-api";
import MedicalTestCard from "../../components/MedicalTestCard";
import CreateMedicalTestModal from "../../components/CreateMedicalTestModal";

export const DoctorAppointmentDetail = () => {
  // get the booking id from the url
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [medicalTests, setMedicalTests] = useState([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);

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
  const handleCreateMedicalTest = async (values) => {
    try {
      // Format lại ngày cho đúng chuẩn ISO nếu cần
      const data = {
        ...values,
        testDate: values.testDate.toISOString(),
      };
      await medicalTestApi.createMedicalTest(data);
      setCreateModalVisible(false);
      // Sau khi tạo thành công, reload lại danh sách
      if (appointment && appointment.id) {
        const tests = await medicalTestApi.getMedicalTestByAppointmentId(
          appointment.id
        );
        setMedicalTests(tests);
      }
    } catch (error) {
      // Xử lý lỗi nếu cần
    }
  };

  const handleUpdateAppointmentStatus = async (values) => {
    // values: { id, status, doctorId }
    // Gọi API cập nhật ở đây
    try {
      const response = await appointmentApi.completeAppointment(
        appointment.id,
        values
      );
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

        {appointment && appointment.status === "APPROVE" && (
          <Button type="primary" onClick={() => setModalVisible(true)}>
            Hoàn thành khám bệnh
          </Button>
        )}
      </div>

      <div>
        <h2 className="font-bold text-xl mb-4 text-[#3B9AB8] flex items-center gap-2">
          Kết quả chẩn đoán
        </h2>
        {appointment && appointment.status == "APPROVE" && (
          <Button
            type="dashed"
            onClick={() => setCreateModalVisible(true)}
            className="mb-4"
          >
            Thêm xét nghiệm mới
          </Button>
        )}

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

      <CompleteAppointmentModal
        visible={modalVisible}
        onOk={handleUpdateAppointmentStatus}
        onCancel={() => setModalVisible(false)}
        appointment={appointment}
      />

      <CreateMedicalTestModal
        visible={createModalVisible}
        onOk={handleCreateMedicalTest}
        onCancel={() => setCreateModalVisible(false)}
        appointmentId={appointment?.id}
      />
    </DoctorLayout>
  );
};
