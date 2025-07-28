import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  Modal,
  message,
  Tooltip,
  Tag,
  Image,
} from "antd";
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { serviceApi } from "../../api/service-api";
import ServiceFormModal from "./componenents/ServiceFormModal";
import AdminLayout from "../../layout/AdminLayout";

const { Title } = Typography;
const { confirm } = Modal;

export const AdminService = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await serviceApi.getServices();
      setServices(response);
    } catch (error) {
      message.error("Lỗi khi tải danh sách dịch vụ!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = (record) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa dịch vụ này?",
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <div>
            <b>Tên:</b> {record.name}
          </div>
          <div>
            <b>Mô tả:</b> {record.description}
          </div>
          <div>
            <b>Giá:</b> {record.price?.toLocaleString()} VNĐ
          </div>
        </div>
      ),
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          setDeleteLoading(true);
          await serviceApi.deleteService(record.id);
          message.success("Xóa dịch vụ thành công!");
          fetchServices();
        } catch (error) {
          message.error("Xóa dịch vụ thất bại!");
        } finally {
          setDeleteLoading(false);
        }
      },
    });
  };

  const handleAdd = () => {
    setEditingService(null);
    setShowFormModal(true);
  };

  const handleEdit = (record) => {
    setEditingService(record);
    setShowFormModal(true);
  };

  const handleFormSubmit = async (values) => {
    setFormLoading(true);
    try {
      if (editingService) {
        await serviceApi.updateService(editingService.id, values);
        message.success("Cập nhật dịch vụ thành công!");
      } else {
        await serviceApi.createService(values);
        message.success("Tạo dịch vụ thành công!");
      }
      setShowFormModal(false);
      fetchServices();
    } catch (error) {
      message.error("Lưu dịch vụ thất bại!");
    } finally {
      setFormLoading(false);
    }
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 100,
      render: (imageUrl) => (
        <div style={{ textAlign: 'center' }}>
          <Image
            width={60}
            height={45}
            src={imageUrl || "https://imgs.search.brave.com/LpEWlQWkEEFxiHTSNhFBLm85idPVbQwwtxEG7yqcLuM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/bmhhdGh1b2Nsb25n/Y2hhdS5jb20udm4v/dW5zYWZlL2h0dHBz/Oi8vY21zLXByb2Qu/czMtc2duMDkuZnB0/Y2xvdWQuY29tL3F1/eV90cmluaF9raGFt/X2JlbmhfZ29tX25o/dW5nX2dpX21vdF9z/b19kaWV1X2Nhbl9s/dXVfeV9kYW5oX2No/b19iZW5oX25oYW5f/MV9lYzdhMTQwNDZk/LmpwZw"}
            alt="Service Image"
            fallback="https://imgs.search.brave.com/LpEWlQWkEEFxiHTSNhFBLm85idPVbQwwtxEG7yqcLuM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/bmhhdGh1b2Nsb25n/Y2hhdS5jb20udm4v/dW5zYWZlL2h0dHBz/Oi8vY21zLXByb2Qu/czMtc2duMDkuZnB0/Y2xvdWQuY29tL3F1/eV90cmluaF9raGFt/X2JlbmhfZ29tX25o/dW5nX2dpX21vdF9z/b19kaWV1X2Nhbl9s/dXVfeV9kYW5oX2No/b19iZW5oX25oYW5f/MV9lYzdhMTQwNDZk/LmpwZw"
            style={{ 
              borderRadius: '4px',
              objectFit: 'cover'
            }}
            preview={{
              mask: <EyeOutlined />,
              maskClassName: "text-white"
            }}
          />
        </div>
      ),
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <span className="font-medium text-gray-900">{text}</span>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text) => <span className="text-gray-600">{text}</span>,
      ellipsis: true,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => <span>{price?.toLocaleString()} VNĐ</span>,
    },
    {
      title: "Đối tượng",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag
          color={
            type === "male" ? "blue" : type === "female" ? "pink" : "default"
          }
        >
          {type === "male" ? "Nam" : type === "female" ? "Nữ" : "Khác"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Sửa dịch vụ">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              className="text-blue-600 hover:text-blue-800"
            />
          </Tooltip>
          <Tooltip title="Xóa dịch vụ">
            <Button
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              className="text-red-600 hover:text-red-800"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout activeMenu="admin/services" displayName="Quản lý dịch vụ">
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <Title level={2}>Quản lý dịch vụ</Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                className="bg-green-600 hover:bg-green-700"
              >
                Thêm dịch vụ
              </Button>
            </div>
            <Table
              columns={columns}
              dataSource={services}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} dịch vụ`,
              }}
              scroll={{ x: 800 }}
            />
          </div>
        </div>
        <ServiceFormModal
          visible={showFormModal}
          onCancel={() => setShowFormModal(false)}
          onSubmit={handleFormSubmit}
          initialValues={editingService}
          loading={formLoading}
        />
      </div>
    </AdminLayout>
  );
};
