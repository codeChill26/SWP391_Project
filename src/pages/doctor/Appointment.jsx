import DoctorAppointmentCard from "../../components/doctor/AppointmentCard";
import DoctorLayout from "../../layout/DoctorLayout";

const mockAppointments = [
  {
    id: 1,
    appointmentTime: "2024-06-15T09:00:00",
    patientName: "Stephine Claire",
    issue: "Fever",
    documentUrl: "#",
    status: "Upcoming",
  },
  {
    id: 2,
    appointmentTime: "2024-06-16T09:00:00",
    patientName: "Stephine Claire",
    issue: "Fever",
    documentUrl: "#",
    status: "Upcoming",
  },
  {
    id: 3,
    appointmentTime: "2024-06-19T09:00:00",
    patientName: "Stephine Claire",
    issue: "Fever",
    documentUrl: "#",
    status: "Cancelled",
  },
  // ... các appointment khác
];

export const DoctorAppointment = () => {
  return (
    <DoctorLayout activeMenu="appointment">
      <div className="space-y-4">
        {mockAppointments.map((item) => (
          <DoctorAppointmentCard key={item.id} appointment={item} />
        ))}
      </div>
    </DoctorLayout>
  );
};
