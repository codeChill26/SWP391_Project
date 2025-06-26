import { useParams } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import { useState, useEffect } from "react";
import { appointmentApi } from "../../api/appointment-api";
import {
  Info,
  MedicalInformationOutlined,
  Person,
  Schedule,
} from "@mui/icons-material";
import { FaDiagnoses } from "react-icons/fa";
import { AppointmentInfo } from "../../components/patients/AppointmentInfo";
import { medicalTestApi } from "../../api/medicalTest-api";
  
export const AppointmentDetail = () => {
  // get the booking id from the url
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [medicalTests, setMedicalTests] = useState([]);

  useEffect(() => {
    // get the booking data from the database
    const fetchAppointment = async () => {
      const booking = await appointmentApi.getAppointmentById(id);
      console.log("Booking: ", booking);
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

  return (
    <MainLayout activeMenu="appointment">
      {/* Content based on active tab */}
      <h2 className="font-bold text-xl mb-4 text-[#3B9AB8] flex items-center gap-2">
        Thông tin chi tiết cuộc hẹn
      </h2>
      <AppointmentInfo appointment={appointment} />

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
    </MainLayout>
  );
};
