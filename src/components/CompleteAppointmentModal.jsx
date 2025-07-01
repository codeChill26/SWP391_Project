import { Modal, Form, Input } from "antd";
import { useEffect } from "react";

const CompleteAppointmentModal = ({ visible, onOk, onCancel, appointment }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (appointment) {
      form.setFieldsValue({
        conclusion: appointment.conclusion || "",
        treatmentPlan: appointment.treatmentPlan || "",
      });
    }
  }, [appointment, form]);

  return (
    <Modal
      open={visible}
      title="Hoàn thành khám bệnh"
      onOk={() => form.validateFields().then(onOk)}
      onCancel={onCancel}
      okText="Xác nhận"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Kết luận"
          name="conclusion"
          rules={[{ required: true, message: "Vui lòng nhập kết luận" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item
          label="Kế hoạch điều trị"
          name="treatmentPlan"
          rules={[{ required: true, message: "Vui lòng nhập kế hoạch điều trị" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CompleteAppointmentModal;