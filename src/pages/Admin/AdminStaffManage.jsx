import { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { userApi } from "../../api/user-api";
import { Table, Tag, Button, Space, Typography, Modal, message, Tooltip } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import CreateUserModal from "./componenents/CreateUserModal";

const { Title } = Typography;
const { confirm } = Modal;

export const AdminStaffManage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const fetchStaff = async () => {
    try {
      const response = await userApi.getUsers();
      // Lọc chỉ lấy users có role là staff
      const staffList = response.filter(user => user.role === 'staff');
      setStaff(staffList);
    } catch (error) {
      console.error("Error fetching staff:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    
    fetchStaff();
  }, []);

  const handleViewDetails = (record) => {
    Modal.info({
      title: 'Thông tin chi tiết nhân viên',
      width: 600,
      content: (
        <div className="mt-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium">Tên:</span> {record.name || record.fullname}</div>
              <div><span className="font-medium">Email:</span> {record.email}</div>
              <div><span className="font-medium">Số điện thoại:</span> {record.phoneNumber || 'N/A'}</div>
              <div><span className="font-medium">Ngày sinh:</span> {record.dob ? new Date(record.dob).toLocaleDateString('vi-VN') : 'N/A'}</div>
              <div><span className="font-medium">Giới tính:</span> {record.gender || 'N/A'}</div>
              <div><span className="font-medium">Địa chỉ:</span> {record.address || 'N/A'}</div>
            </div>
          </div>
        </div>
      ),
      okText: 'Đóng',
    });
  };

  const handleDelete = (record) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa nhân viên này?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div className="mt-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-3">Thông tin nhân viên:</h4>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Tên:</span> {record.name || record.fullname}</div>
              <div><span className="font-medium">Email:</span> {record.email}</div>
              <div><span className="font-medium">Số điện thoại:</span> {record.phoneNumber || 'N/A'}</div>
              <div><span className="font-medium">Ngày sinh:</span> {record.dob ? new Date(record.dob).toLocaleDateString('vi-VN') : 'N/A'}</div>
              <div><span className="font-medium">Giới tính:</span> {record.gender || 'N/A'}</div>
            </div>
          </div>
          <div className="mt-3 text-red-600 text-sm">
            <ExclamationCircleOutlined className="mr-1" />
            Hành động này không thể hoàn tác!
          </div>
        </div>
      ),
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      confirmLoading: deleteLoading,
      onOk: async () => {
        try {
          setDeleteLoading(true);
          await userApi.deleteUser(record.id);
          message.success('Xóa nhân viên thành công!');
          // Refresh danh sách sau khi xóa
          const updatedStaff = staff.filter(staffMember => staffMember.id !== record.id);
          setStaff(updatedStaff);
        } catch (error) {
          console.error('Error deleting staff:', error);
          message.error('Xóa nhân viên thất bại. Vui lòng thử lại!');
        } finally {
          setDeleteLoading(false);
        }
      },
    });
  };

  const handleAddStaff = () => {
    setShowCreateModal(true);
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div>
          <div className="font-medium text-gray-900">{text || record.fullname}</div>
          {record.phoneNumber && (
            <div className="text-sm text-gray-500">{record.phoneNumber}</div>
          )}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      render: (dob) => (
        <span className="text-gray-600">
          {dob ? new Date(dob).toLocaleDateString('vi-VN') : 'N/A'}
        </span>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => (
        <Tag color={gender === 'Male' ? 'blue' : gender === 'Female' ? 'pink' : 'default'}>
          {gender || 'N/A'}
        </Tag>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      render: (address) => (
        <span className="text-gray-600 text-sm">
          {address || 'N/A'}
        </span>
      ),
      ellipsis: true,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
              className="text-blue-600 hover:text-blue-800"
            />
          </Tooltip>
          <Tooltip title="Xóa nhân viên">
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

  if (loading) {
    return (
      <AdminLayout activeMenu="admin/staff" displayName="Staff Management">
        <div className="min-h-screen bg-gray-100 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeMenu="admin/staff" displayName="Staff Management">
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <Title level={2}>
                Quản lý nhân viên
              </Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddStaff}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Thêm nhân viên
              </Button>
            </div>

            <Table
              columns={columns}
              dataSource={staff}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} nhân viên`,
              }}
              scroll={{ x: 800 }}
            />
          </div>
        </div>
      </div>
      <CreateUserModal
        role="staff"
        visible={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          fetchStaff();
        }}
      />
    </AdminLayout>
  );
}; 