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
  
export const AppointmentDetail = () => {
  // get the booking id from the url
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    // get the booking data from the database
    const fetchAppointment = async () => {
      const booking = await appointmentApi.getAppointmentById(id);
      console.log("Booking: ", booking);
      setAppointment(booking);
    };
    fetchAppointment();
  }, [id]);

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

        <div></div>
      </div>
    </MainLayout>
  );
};
