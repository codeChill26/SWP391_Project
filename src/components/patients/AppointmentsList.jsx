import { List, Modal } from "antd";
import { useEffect, useState } from "react";
import { AppointmentDetail } from "./AppointmentDetail";
import { TestResultsDialog } from "./TestListDialog";

const AppointmentsList = ({ appointments }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [open, setOpen] = useState(false);

  const handleItemClick = (appointment) => {
    setSelectedAppointment(appointment);
    setOpen(true);
    console.log("Selected appointment:", appointment);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAppointment(null);
  };

  useEffect(() => {}, []);

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <List
        itemLayout="vertical"
        dataSource={appointments}
        renderItem={(appointment) => (
          <List.Item
            key={appointment.id}
            onClick={() => handleItemClick(appointment)}
            className="cursor-pointer hover:bg-gray-100 transition-all"
          >
            <AppointmentDetail appointment={appointment} />
          </List.Item>
        )}
      />

      <Modal
        title="Danh sách kết quả xét nghiệm"
        open={open}
        onCancel={handleClose}
        footer={null}
        width={800}
      >
        {selectedAppointment && (
          <>
            {/* <AppointmentDetail appointment={selectedAppointment} /> */}
            <TestResultsDialog testResults={selectedAppointment} />

            {/* {selectedAppointment.length > 0 ? (
              <TestResultsDialog testResults={selectedAppointment} />
            ) : (
              <p className="text-gray-500">Không có kết quả xét nghiệm.</p>
            )} */}
          </>
        )}
      </Modal>
    </div>
  );
};

export default AppointmentsList;
