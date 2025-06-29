// src/components/admin/CreateUserForm.jsx
import { useState } from "react";
import { Form, Input, Button, DatePicker, message, Modal } from "antd";
import dayjs from "dayjs";
import { userApi } from "../../../api/user-api";

const CreateUserModal = ({ role, visible, onCancel, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const data = {
        ...values,
        dob: values.dob ? dayjs(values.dob).format("YYYY-MM-DD") : undefined,
        role,
      };
      await userApi.createUser(data);
      message.success("Tạo người dùng thành công!");
      form.resetFields();
      if (onSuccess) onSuccess();
      if (onCancel) onCancel();
    } catch (error) {
      message.error("Tạo người dùng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      title={`Thêm ${role === "doctor" ? "bác sĩ" : role === "staff" ? "nhân viên" : "người dùng"}`}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Ngày sinh"
          name="dob"
          rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Tạo mới
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;