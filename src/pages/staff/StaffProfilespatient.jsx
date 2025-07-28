import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { appointmentApi } from "../../api/appointment-api";
import { serviceApi } from "../../api/service-api";
import MainLayout from "../../layout/MainLayout";
import { List, Space, Tabs, Tag, Typography, Select, Input } from "antd"; // Thêm Input vào imports
import { ClockCircleOutlined } from "@ant-design/icons";
const { Text, Title } = Typography;
import TabPane from "antd/es/tabs/TabPane";
import StaffLayout from "../../layout/StaffLayout";
import { userApi } from "../../api/user-api";
import { Patient } from "../../components/patients/PatientsList";
import { Person } from "@mui/icons-material";

const statusTabs = [
  { key: "ALL", label: "Tất cả" },
  { key: "PENDING", label: "Đang duyệt" },
  { key: "APPROVE", label: "Đã duyệt" },
  { key: "CANCELLED", label: "Đã hủy" },
  { key: "COMPLETED", label: "Hoàn thành" },
];

const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  return new Date(timeString).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const getStatusColor = (status) => {
  const statusColors = {
    "Đã xác nhận": "green",
    "Chờ xác nhận": "orange",
    "Đã hủy": "red",
    "Hoàn thành": "blue",
    "Đang khám": "purple",
  };
  return statusColors[status] || "default";
};
export const StaffProfilespatient = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" hoặc "desc"
  const [searchText, setSearchText] = useState(""); // Thêm state cho search
  const sortOptions = [
    { value: "asc", label: "Cũ nhất trước" },
    { value: "desc", label: "Mới nhất trước" },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await userApi.getUsers();
      setUsers(response);
    };
    fetchUsers();
  }, []);

  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  // Thêm hàm lọc để tìm kiếm
  const filteredUsers = users.filter((user) => {
    const name = (user.name || user.fullname || "").toLowerCase();
    const search = searchText.toLowerCase();
    return user.role === "patient" && name.includes(search);
  });

  return (
    <StaffLayout activeMenu="staff/profilespatient" pageTitle="Patients List">
      <div className="flex flex-col gap-4 mb-4">
        <Input.Search
          placeholder="Tìm kiếm theo tên bệnh nhân..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "100%" }}
          allowClear
        />
        <Select
          value={sortOrder}
          onChange={handleSortChange}
          options={sortOptions}
          style={{ width: 150 }}
          prefix={<ClockCircleOutlined />}
          placeholder="Sắp xếp theo thời gian"
        />
      </div>

      <div className="mt-4">
        <List
          className="bg-white rounded-lg shadow"
          dataSource={filteredUsers}
          renderItem={(user) => (
            <List.Item
              key={user.id}
              // className="border-b last:border-b-0"
              className="w-full"
              onClick={() => navigate(`/staff/profilespatient/${user.id}`)}
            >
              <div className="w-full p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Person className="text-[#3B9AB8]" />
                    {user.name || user.fullname || "Không rõ"}
                  </h3>
                  <Tag color={user.status === "active" ? "green" : "orange"}>
                    {user.status === "active"
                      ? "Đang hoạt động"
                      : "Không hoạt động"}
                  </Tag>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-600">Email:</span>
                      <span className="text-gray-800">
                        {user.email || "Không có"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-600">
                        Số điện thoại:
                      </span>
                      <span className="text-gray-800">
                        {user.phoneNumber || "Không có"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-600">
                        Ngày sinh:
                      </span>
                      <span className="text-gray-800">
                        {user.dob
                          ? new Date(user.dob).toLocaleDateString("vi-VN")
                          : "Không có"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-600">
                        Địa chỉ:
                      </span>
                      <span className="text-gray-800">
                        {user.address || "Không có"}
                      </span>
                    </div>
                  </div>
                </div>

                {user.patientNotes && (
                  <div className="mt-3 pt-3 border-t">
                    <span className="font-medium text-gray-600">Ghi chú:</span>
                    <p className="mt-1 text-gray-800">{user.patientNotes}</p>
                  </div>
                )}
              </div>
            </List.Item>
          )}
          pagination={{
            pageSize: 5,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} bệnh nhân`,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </div>
    </StaffLayout>
  );
};
