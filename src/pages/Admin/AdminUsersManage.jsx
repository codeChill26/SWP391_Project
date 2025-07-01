import { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { userApi } from "../../api/user-api";
import { Table, Tag, Button, Space, Typography, Modal, message } from "antd";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { confirm } = Modal;

export const AdminUsersManage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userApi.getUsers();
        setUsers(response);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "purple";
      case "doctor":
        return "blue";
      case "staff":
        return "orange";
      case "patient":
        return "green";
      default:
        return "default";
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "doctor":
        return "Bác sĩ";
      case "staff":
        return "Nhân viên";
      case "patient":
        return "Bệnh nhân";
      default:
        return role;
    }
  };

  const handleEdit = (record) => {
    console.log("Edit user:", record);
    // Add edit functionality
  };

  const handleDelete = (record) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa người dùng này?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div className="mt-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-3">Thông tin người dùng:</h4>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Tên:</span> {record.name || record.fullname}</div>
              <div><span className="font-medium">Email:</span> {record.email}</div>
              <div><span className="font-medium">Số điện thoại:</span> {record.phoneNumber || 'N/A'}</div>
              <div><span className="font-medium">Ngày sinh:</span> {record.dob ? new Date(record.dob).toLocaleDateString('vi-VN') : 'N/A'}</div>
              <div><span className="font-medium">Giới tính:</span> {record.gender || 'N/A'}</div>
              <div><span className="font-medium">Vai trò:</span> {getRoleLabel(record.role)}</div>
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
          message.success('Xóa người dùng thành công!');
          // Refresh danh sách sau khi xóa
          const updatedUsers = users.filter(user => user.id !== record.id);
          setUsers(updatedUsers);
        } catch (error) {
          console.error('Error deleting user:', error);
          message.error('Xóa người dùng thất bại. Vui lòng thử lại!');
        } finally {
          setDeleteLoading(false);
        }
      },
    });
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
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={getRoleColor(role)}>
          {getRoleLabel(role)}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            className="text-red-600 hover:text-red-800"
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <AdminLayout activeMenu="admin/users" displayName="User Management">
        <div className="min-h-screen bg-gray-100 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeMenu="admin/users" displayName="User Management">
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <Title level={2} className="mb-6">
              Quản lý người dùng
            </Title>

            <Table
              columns={columns}
              dataSource={users}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} người dùng`,
              }}
              scroll={{ x: 800 }}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
