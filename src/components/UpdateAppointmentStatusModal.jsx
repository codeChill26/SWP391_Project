import { Modal, Form, Select } from "antd";
import { useEffect, useState } from "react";
import { userApi } from "../api/user-api";

const { Option } = Select;

const statusOptions = [
  { value: "PENDING", label: "Đang duyệt", disabled: true },
  { value: "CANCELLED", label: "Đã hủy" },
  { value: "APPROVE", label: "Đã duyệt" },
  { value: "COMPLETED", label: "Hoàn thành" },
];

const UpdateAppointmentStatusModal = ({
  visible,
  onOk,
  onCancel,
  appointment,
}) => {
  const [form] = Form.useForm();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await userApi.getUsers();
      setDoctors(response.filter(user => user.role === "doctor"));
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (appointment) {
      form.setFieldsValue({
        id: appointment.id,
        status: appointment.status,
        doctorId: appointment.doctorId || undefined,
      });
    }
  }, [appointment, form]);

  const status = Form.useWatch("status", form);

  return (
    <Modal
      open={visible}
      title="Cập nhật trạng thái lịch hẹn"
      onOk={() => form.validateFields().then(onOk)}
      onCancel={onCancel}
      okText="Cập nhật"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" initialValues={{ id: appointment?.id }}>
        <Form.Item name="id" style={{ display: "none" }}>
          <input type="hidden" />
        </Form.Item>
        <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}>
          <Select>
            {statusOptions.map(opt => (
              <Option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {status === "APPROVE" && (
          <Form.Item label="Bác sĩ phụ trách" name="doctorId" rules={[{ required: true, message: "Vui lòng chọn bác sĩ" }]}>
            <Select placeholder="Chọn bác sĩ">
              {doctors.map(doctor => (
                <Option key={doctor.id} value={doctor.id}>
                  {doctor.name || doctor.fullname}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default UpdateAppointmentStatusModal;