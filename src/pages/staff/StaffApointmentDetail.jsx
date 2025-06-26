import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { appointmentApi } from "../../api/appointment-api";
import { AppointmentInfo } from "../../components/patients/AppointmentInfo";
import StaffLayout from "../../layout/StaffLayout";

export const StaffAppointmentDetail = () => {
  // get the booking id from the url
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    // get the booking data from the database
    const fetchAppointment = async () => {
      const booking = await appointmentApi.getAppointmentById(id);
      setAppointment(booking);
    };
    fetchAppointment();
  }, [id]);
  return (
    <StaffLayout activeMenu="staff/appointment" pageTitle="Appointment Detail">
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
    </StaffLayout>
  );
};
