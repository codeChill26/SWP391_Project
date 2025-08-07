import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  message,
  Popconfirm,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Tooltip,
  Drawer,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../layout/AdminLayout";
import { provideMedicalTestApi } from "../../api/provideMedicalTest-api";

const { TextArea } = Input;
const { Search: SearchInput } = Input;

const AdminProvideMedicalTest = () => {
  const [medicalTests, setMedicalTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();
  const [viewForm] = Form.useForm();

  // Thống kê
  const [stats, setStats] = useState({
    totalTests: 0,
    averagePrice: 0,
    totalValue: 0,
  });

  // Fetch dữ liệu
  const fetchMedicalTests = async () => {
    setLoading(true);
    try {
      const data = await provideMedicalTestApi.getAllMedicalTests();
      setMedicalTests(data);
      
      // Tính thống kê
      const totalTests = data.length;
      const totalValue = data.reduce((sum, test) => sum + (test.price || 0), 0);
      const averagePrice = totalTests > 0 ? Math.round(totalValue / totalTests) : 0;
      
      setStats({
        totalTests,
        averagePrice,
        totalValue,
      });
    } catch (error) {
      message.error("Không thể tải danh sách xét nghiệm!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicalTests();
  }, []);

  // Tìm kiếm
  const handleSearch = async (value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      fetchMedicalTests();
      return;
    }

    setLoading(true);
    try {
      const data = await provideMedicalTestApi.searchMedicalTests(value);
      setMedicalTests(data);
    } catch (error) {
      message.error("Lỗi khi tìm kiếm!");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý form
  const handleSubmit = async (values) => {
    try {
      if (editingTest) {
        // Cập nhật
        await provideMedicalTestApi.updateMedicalTest(editingTest.id, {
          ...values,
          version: editingTest.version,
        });
        message.success("Cập nhật xét nghiệm thành công!");
      } else {
        // Tạo mới
        await provideMedicalTestApi.createMedicalTest(values);
        message.success("Thêm xét nghiệm thành công!");
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setEditingTest(null);
      fetchMedicalTests();
    } catch (error) {
      message.error("Có lỗi xảy ra!");
      console.error(error);
    }
  };

  // Xử lý xóa
  const handleDelete = async (id) => {
    try {
      await provideMedicalTestApi.deleteMedicalTest(id);
      message.success("Xóa xét nghiệm thành công!");
      fetchMedicalTests();
    } catch (error) {
      message.error("Không thể xóa xét nghiệm!");
      console.error(error);
    }
  };

  // Mở modal chỉnh sửa
  const handleEdit = (record) => {
    setEditingTest(record);
    form.setFieldsValue({
      testName: record.testName,
      description: record.description,
      descriptionLow: record.descriptionLow,
      descriptionHigh: record.descriptionHigh,
      price: record.price,
      min: record.min,
      max: record.max,
      unit: record.unit,
    });
    setIsModalVisible(true);
  };

  // Mở modal xem chi tiết
  const handleView = (record) => {
    viewForm.setFieldsValue({
      testName: record.testName,
      description: record.description,
      descriptionLow: record.descriptionLow,
      descriptionHigh: record.descriptionHigh,
      price: record.price,
      min: record.min,
      max: record.max,
      unit: record.unit,
      id: record.id,
      version: record.version,
    });
    setIsViewModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setIsViewModalVisible(false);
    setEditingTest(null);
    form.resetFields();
    viewForm.resetFields();
  };

  // Định dạng giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Cột cho bảng
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (id) => <Tag color="blue">#{id}</Tag>,
    },
    {
      title: "Tên xét nghiệm",
      dataIndex: "testName",
      key: "testName",
      render: (text) => (
        <div className="font-medium text-gray-800">{text}</div>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span className="text-gray-600">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Khoảng giá trị",
      key: "range",
      width: 150,
      render: (_, record) => (
        <div className="text-sm">
          <div className="font-medium text-gray-800">
            {record.min} - {record.max}
          </div>
          <div className="text-gray-500 text-xs">
            {record.unit}
          </div>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 150,
      render: (price) => (
        <div className="font-semibold text-green-600">
          {formatPrice(price)}
        </div>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
              className="text-blue-500 hover:text-blue-700"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              className="text-orange-500 hover:text-orange-700"
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa xét nghiệm này?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                className="text-red-500 hover:text-red-700"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout activeMenu="medical-tests">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Quản lý dịch vụ xét nghiệm
          </h1>
          <p className="text-gray-600">
            Quản lý danh sách các dịch vụ xét nghiệm y tế
          </p>
        </div>

        {/* Thống kê */}
        {/* <Row gutter={16} className="mb-6">
          <Col span={8}>
            <Card>
              <Statistic
                title="Tổng số xét nghiệm"
                value={stats.totalTests}
                valueStyle={{ color: "#1890ff" }}
                prefix={<SearchOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Giá trung bình"
                value={formatPrice(stats.averagePrice)}
                valueStyle={{ color: "#52c41a" }}
                prefix="₫"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Tổng giá trị"
                value={formatPrice(stats.totalValue)}
                valueStyle={{ color: "#722ed1" }}
                prefix="₫"
              />
            </Card>
          </Col>
        </Row> */}

        {/* Thanh công cụ */}
        <Card className="mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <SearchInput
                placeholder="Tìm kiếm xét nghiệm..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                style={{ width: 300 }}
              />
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchMedicalTests}
                loading={loading}
              >
                Làm mới
              </Button>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => setIsModalVisible(true)}
              className="bg-blue-500 border-blue-500 hover:bg-blue-600"
            >
              Thêm xét nghiệm
            </Button>
          </div>
        </Card>

        {/* Bảng dữ liệu */}
        <Card>
          <Table
            columns={columns}
            dataSource={medicalTests}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} xét nghiệm`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>

        {/* Modal thêm/sửa */}
        <Modal
          title={editingTest ? "Chỉnh sửa xét nghiệm" : "Thêm xét nghiệm mới"}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              price: 0,
              min: 0,
              max: 0,
            }}
          >
            <Form.Item
              label="Tên xét nghiệm"
              name="testName"
              rules={[
                { required: true, message: "Vui lòng nhập tên xét nghiệm!" },
                { min: 3, message: "Tên xét nghiệm phải có ít nhất 3 ký tự!" },
              ]}
            >
              <Input placeholder="Ví dụ: Xét nghiệm máu tổng quát" />
            </Form.Item>

            <Form.Item
              label="Mô tả"
              name="description"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả!" },
                { min: 10, message: "Mô tả phải có ít nhất 10 ký tự!" },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Mô tả chi tiết về xét nghiệm..."
              />
            </Form.Item>

            <Form.Item
              label="Mô tả khi kết quả thấp"
              name="descriptionLow"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả cho kết quả thấp!" },
              ]}
            >
              <TextArea
                rows={3}
                placeholder="Mô tả khi kết quả xét nghiệm thấp..."
              />
            </Form.Item>

            <Form.Item
              label="Mô tả khi kết quả cao"
              name="descriptionHigh"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả cho kết quả cao!" },
              ]}
            >
              <TextArea
                rows={3}
                placeholder="Mô tả khi kết quả xét nghiệm cao..."
              />
            </Form.Item>

            <Form.Item
              label="Giá (VNĐ)"
              name="price"
              rules={[
                { required: true, message: "Vui lòng nhập giá!" },
                { type: "number", min: 0, message: "Giá phải lớn hơn 0!" },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                placeholder="Ví dụ: 150000"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Giá trị tối thiểu"
                  name="min"
                  rules={[
                    { required: true, message: "Vui lòng nhập giá trị tối thiểu!" },
                    { type: "number", message: "Giá trị phải là số!" },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Ví dụ: 10"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Giá trị tối đa"
                  name="max"
                  rules={[
                    { required: true, message: "Vui lòng nhập giá trị tối đa!" },
                    { type: "number", message: "Giá trị phải là số!" },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Ví dụ: 20"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Đơn vị"
                  name="unit"
                  rules={[
                    { required: true, message: "Vui lòng nhập đơn vị!" },
                  ]}
                >
                  <Input
                    placeholder="Ví dụ: mg/dL"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item className="mb-0">
              <div className="flex justify-end space-x-2">
                <Button onClick={handleCancel}>Hủy</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-blue-500 border-blue-500 hover:bg-blue-600"
                >
                  {editingTest ? "Cập nhật" : "Thêm"}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal xem chi tiết */}
        <Drawer
          title="Chi tiết xét nghiệm"
          placement="right"
          onClose={() => setIsViewModalVisible(false)}
          open={isViewModalVisible}
          width={500}
        >
          <Form form={viewForm} layout="vertical" disabled>
            <Form.Item label="ID" name="id">
              <Input />
            </Form.Item>
            <Form.Item label="Version" name="version">
              <Input />
            </Form.Item>
            <Form.Item label="Tên xét nghiệm" name="testName">
              <Input />
            </Form.Item>
            <Form.Item label="Mô tả" name="description">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item label="Mô tả khi kết quả thấp" name="descriptionLow">
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item label="Mô tả khi kết quả cao" name="descriptionHigh">
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item label="Giá" name="price">
              <InputNumber
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
              />
            </Form.Item>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Giá trị tối thiểu" name="min">
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Giá trị tối đa" name="max">
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Đơn vị" name="unit">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
      </div>
    </AdminLayout>
  );
};

export default AdminProvideMedicalTest;
