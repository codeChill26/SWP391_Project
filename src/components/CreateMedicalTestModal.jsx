import { Modal, Form, Input, InputNumber, DatePicker } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";

const CreateMedicalTestModal = ({ visible, onOk, onCancel, appointmentId }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue({
        appointmentId,
        testDate: dayjs(), // mặc định là ngày hiện tại
      });
    }
  }, [visible, appointmentId, form]);

  return (
    <Modal
      open={visible}
      title="Thêm xét nghiệm mới"
      onOk={() => form.validateFields().then(onOk)}
      onCancel={onCancel}
      okText="Tạo"
      cancelText="Hủy"
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item name="appointmentId" style={{ display: "none" }}>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item
          label="Tên xét nghiệm"
          name="testName"
          rules={[{ required: true, message: "Vui lòng nhập tên xét nghiệm" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Ngày xét nghiệm"
          name="testDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày xét nghiệm" }]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DDTHH:mm:ss.SSS[Z]"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="Kết quả"
          name="result"
          rules={[{ required: true, message: "Vui lòng nhập kết quả" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Ghi chú"
          name="notes"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Giá"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateMedicalTestModal;