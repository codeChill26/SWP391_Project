// src/components/admin/ServiceFormModal.jsx
import { Form, Input, InputNumber, Modal, Select, Row, Col, Image } from "antd";
import { useEffect, useState } from "react";

const ServiceFormModal = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  loading,
}) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");

  // Hình ảnh mặc định
  const defaultImage = "https://via.placeholder.com/200x150?text=Không+có+hình+ảnh";

  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue(initialValues);
        setImageUrl(initialValues.imageUrl || "");
      } else {
        setImageUrl("");
      }
    }
  }, [visible, initialValues, form]);

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  return (
    <Modal
      open={visible}
      title={initialValues ? "Cập nhật dịch vụ" : "Thêm dịch vụ"}
      onCancel={onCancel}
      onOk={() => form.validateFields().then(onSubmit)}
      confirmLoading={loading}
      okText={initialValues ? "Cập nhật" : "Tạo mới"}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          label="Tên dịch vụ"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Giá"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Đối tượng"
          name="type"
          rules={[{ required: true, message: "Vui lòng chọn đối tượng" }]}
        >
          <Select>
            <Select.Option value="male">Nam</Select.Option>
            <Select.Option value="female">Nữ</Select.Option>
            <Select.Option value="other">Khác</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Link hình ảnh"
          name="imageUrl"
          rules={[{ required: true, message: "Vui lòng nhập link hình ảnh" }]}
        >
          <Input 
            placeholder="Nhập URL hình ảnh" 
            onChange={handleImageUrlChange}
          />
        </Form.Item>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Preview hình ảnh">
              <div style={{ textAlign: 'center' }}>
                <Image
                  width={200}
                  height={150}
                  src={imageUrl || defaultImage}
                  alt="Preview"
                  fallback={defaultImage}
                  style={{ 
                    border: '1px solid #d9d9d9', 
                    borderRadius: '6px',
                    objectFit: 'cover'
                  }}
                />
              </div>
            </Form.Item>
          </Col>
          <Col span={12}>
            <div style={{ paddingTop: '32px' }}>
              <p style={{ fontSize: '12px', color: '#666' }}>
                <strong>Hướng dẫn:</strong>
              </p>
              <ul style={{ fontSize: '12px', color: '#666', margin: '8px 0' }}>
                <li>Nhập URL hình ảnh hợp lệ</li>
                <li>Hình ảnh sẽ được hiển thị ở bên cạnh</li>
                <li>Nếu không có hình ảnh, sẽ hiển thị hình mặc định</li>
              </ul>
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ServiceFormModal;