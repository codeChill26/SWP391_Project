// src/components/DoctorAppointmentCard.jsx
import React from "react";

const DoctorAppointmentCard = ({ appointment }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex flex-col items-center">
          <span className="font-bold text-lg">
            {new Date(appointment.appointmentTime).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(appointment.appointmentTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        <div>
          <div className="font-semibold">{appointment.patientName}</div>
          <div className="text-gray-500 text-sm">Issue: {appointment.issue}</div>
          <div className="text-sm mt-1">
            <span
              className={
                appointment.status === "Upcoming"
                  ? "text-blue-600"
                  : appointment.status === "Cancelled"
                  ? "text-red-500"
                  : appointment.status === "Past"
                  ? "text-gray-400"
                  : "text-green-600"
              }
            >
              {appointment.status}
            </span>
          </div>
        </div>
        <div>
          <div className="font-semibold">{appointment.patientName}</div>
          <div className="text-gray-500 text-sm">Issue: {appointment.issue}</div>
        </div>
      </div>
      <div className="flex items-center space-x-4 mt-2 md:mt-0">
        <a href={appointment.documentUrl || "#"} className="text-blue-600 underline text-sm">
          View Documents
        </a>
        <button className="bg-gray-100 px-3 py-1 rounded border text-sm">Edit</button>
      </div>
    </div>
  );
};

export default DoctorAppointmentCard;