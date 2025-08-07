// src/components/admin/ServiceFormModal.jsx
import { Form, Input, InputNumber, Modal, Select, Row, Col, Image, Upload, Button, message } from "antd";
import { UploadOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { cloudinaryApi } from "../../../api/cloudinary-api";

const ServiceFormModal = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  loading,
}) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  // Hình ảnh mặc định
  const defaultImage = "https://via.placeholder.com/200x150?text=Không+có+hình+ảnh";

  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue(initialValues);
        setImageUrl(initialValues.imageUrl || "");
        setUploadedFile(null);
      } else {
        setImageUrl("");
        setUploadedFile(null);
      }
    }
  }, [visible, initialValues, form]);



  const handleFileUpload = async (file) => {
    // Kiểm tra file hợp lệ
    const validation = cloudinaryApi.validateImageFile(file);
    if (!validation.valid) {
      message.error(validation.error);
      return false;
    }

    setUploading(true);
    try {
      const result = await cloudinaryApi.uploadImage(file);
      if (result.success) {
        console.log("upload result success", result);
        setImageUrl(result.imageUrl);
        setUploadedFile(file);
        message.success("Upload ảnh thành công!");
        form.setFieldsValue({ imageUrl: result.imageUrl });
      } else {
        message.error(result.error || "Upload ảnh thất bại!");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi upload ảnh!");
    } finally {
      setUploading(false);
    }
    return false; // Ngăn không cho Ant Design tự upload
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setUploadedFile(null);
    form.setFieldsValue({ imageUrl: "" });
    message.info("Đã xóa ảnh");
  };

  return (
    <Modal
      open={visible}
      title={initialValues ? "Cập nhật dịch vụ" : "Thêm dịch vụ"}
      onCancel={onCancel}
      onOk={async () => {
        try {
          const values = await form.validateFields();
          
          // Kiểm tra xem có ảnh được upload chưa
          if (uploadedFile && !imageUrl) {
            message.warning("Vui lòng đợi upload ảnh hoàn tất!");
            return;
          }
          
                     // Kiểm tra xem có ảnh được upload chưa
           if (!imageUrl) {
             message.warning("Vui lòng upload hình ảnh!");
             return;
           }
          
          onSubmit(values);
        } catch (error) {
          console.error("Form validation error:", error);
        }
      }}
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
          label="Hình ảnh dịch vụ"
          name="imageUrl"
          rules={[{ required: true, message: "Vui lòng upload hình ảnh" }]}
        >
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Upload
              name="file"
              listType="picture"
              showUploadList={false}
              beforeUpload={handleFileUpload}
              accept="image/*"
              disabled={uploading}
            >
              <Button 
                icon={<UploadOutlined />} 
                loading={uploading}
                disabled={uploading}
                type="primary"
                size="large"
              >
                {uploading ? "Đang upload..." : "Chọn ảnh"}
              </Button>
            </Upload>
            {imageUrl && (
              <Button 
                icon={<DeleteOutlined />} 
                onClick={handleRemoveImage}
                danger
                size="large"
              >
                Xóa ảnh
              </Button>
            )}
          </div>
        </Form.Item>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Preview hình ảnh">
              <div style={{ textAlign: 'center' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
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
                    preview={{
                      visible: previewVisible,
                      onVisibleChange: (visible) => setPreviewVisible(visible),
                    }}
                  />
                  {imageUrl && (
                    <Button
                      type="primary"
                      size="small"
                      icon={<EyeOutlined />}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        opacity: 0.8,
                      }}
                      onClick={() => setPreviewVisible(true)}
                    >
                      Xem
                    </Button>
                  )}
                </div>
              </div>
            </Form.Item>
          </Col>
          <Col span={12}>
            <div style={{ paddingTop: '32px' }}>
              <p style={{ fontSize: '12px', color: '#666' }}>
                <strong>Hướng dẫn:</strong>
              </p>
                             <ul style={{ fontSize: '12px', color: '#666', margin: '8px 0' }}>
                 <li>Click "Chọn ảnh" để upload file từ máy tính</li>
                 <li>Hỗ trợ: JPEG, PNG, GIF, WEBP (tối đa 10MB)</li>
                 <li>Ảnh sẽ được upload lên Cloudinary tự động</li>
                 <li>Click "Xem" để xem ảnh kích thước đầy đủ</li>
                 <li>Click "Xóa ảnh" để chọn ảnh khác</li>
               </ul>
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ServiceFormModal;