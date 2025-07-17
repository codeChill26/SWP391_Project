import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import {
  Calendar,
  theme,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Card,
  Progress,
  Statistic,
  Row,
  Col,
  message,
} from "antd";
import {
  PlusOutlined,
  CalendarOutlined,
  BarChartOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useUser } from "../../context/UserContext";
import { healthCycleApi } from "../../api/heealthCycle-api";

const { TextArea } = Input;

const onPanelChange = (value, mode) => {
  console.log(value.format("YYYY-MM-DD"), mode);
};

export const PeriodTracking = () => {
  const [periodRecords, setPeriodRecords] = useState([]);
  const { userData, isLoggedIn } = useUser();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const { token } = theme.useToken();
  const wrapperStyle = {
    width: "100%",
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  // Mock data - thay thế bằng API call thực tế
  useEffect(() => {
    if (isLoggedIn) {
      const fetchHealthCycles = async () => {
        const healthCycles = await healthCycleApi.getHealthCycleByUserId(
          userData.id
        );
        setPeriodRecords(healthCycles);
      };
      fetchHealthCycles();
    }
  }, [userData]);

  // Tính toán thống kê
  const calculateStats = () => {
    if (periodRecords.length === 0) return null;

    // Lấy tối đa 3 record gần nhất để tính trung bình
    const recentRecords = periodRecords.slice(0, 3);
    
    const avgCycleLength =
      recentRecords.reduce((sum, record) => sum + record.cycleLength, 0) / recentRecords.length;
    const avgPeriodLength =
      recentRecords.reduce((sum, record) => sum + record.periodDate, 0) / recentRecords.length;

    // Lấy kỳ kinh gần nhất
    const lastRecord = periodRecords[0];
    const lastStartDate = dayjs(lastRecord.recordDate);
    const nextPeriodDate = lastStartDate.add(lastRecord.cycleLength, "day");
    const daysUntilNext = nextPeriodDate.diff(dayjs(), "day");

    return {
      avgCycleLength: Math.round(avgCycleLength),
      avgPeriodLength: Math.round(avgPeriodLength),
      nextPeriodDate: nextPeriodDate.format("DD/MM/YYYY"),
      daysUntilNext: Math.max(0, daysUntilNext),
    };
  };

  const stats = calculateStats();

  // Tạo dữ liệu cho calendar
  const getCalendarData = () => {
    const calendarData = {};

    periodRecords.forEach((record) => {
      const startDate = dayjs(record.recordDate);
      const cycleLength = record.cycleLength;

      // Đánh dấu ngày hành kinh (màu đỏ)
      for (let i = 0; i < record.periodDate; i++) {
        const periodDate = startDate.add(i, "day");
        calendarData[periodDate.format("YYYY-MM-DD")] = "period";
      }

      // Đánh dấu ngày dễ thụ thai (màu vàng) - 14 ngày trước kỳ kinh tiếp theo
      const ovulationDate = startDate.add(cycleLength - 14, "day");
      var start = -Math.floor(record.periodDate/2);
      var end = Math.floor(record.periodDate/2);
      for (let i = start; i <= end; i++) {
        const fertileDate = ovulationDate.add(i, "day");
        // Không ghi đè ngày hành kinh
        if (!calendarData[fertileDate.format("YYYY-MM-DD")]) {
          calendarData[fertileDate.format("YYYY-MM-DD")] = "fertile";
        }
      }
    });

    // Đánh dấu kỳ kinh dự đoán tháng kế tiếp
    if (periodRecords.length > 0) {
      // Lấy record mới nhất
      const sortedRecords = [...periodRecords].sort((a, b) =>
        dayjs(b.recordDate).diff(dayjs(a.recordDate))
      );
      const lastRecord = sortedRecords[0];
      const nextStartDate = dayjs(lastRecord.recordDate).add(lastRecord.cycleLength, "day");

      // Đánh dấu ngày hành kinh dự đoán (màu đỏ nhạt)
      for (let i = 0; i < lastRecord.periodDate; i++) {
        const periodDate = nextStartDate.add(i, "day");
        // Nếu chưa có màu thì đánh dấu là "predicted-period"
        if (!calendarData[periodDate.format("YYYY-MM-DD")]) {
          calendarData[periodDate.format("YYYY-MM-DD")] = "predicted-period";
        }
      }

      // Đánh dấu ngày dễ thụ thai dự đoán (màu vàng nhạt)
      const ovulationDate = nextStartDate.add(lastRecord.cycleLength - 14, "day");
      for (let i = -2; i <= 2; i++) {
        const fertileDate = ovulationDate.add(i, "day");
        if (!calendarData[fertileDate.format("YYYY-MM-DD")]) {
          calendarData[fertileDate.format("YYYY-MM-DD")] = "predicted-fertile";
        }
      }
    }

    return calendarData;
  };

  const calendarData = getCalendarData();

  // Custom date cell renderer
  const dateCellRender = (value) => {
    const dateStr = value.format("YYYY-MM-DD");
    const cellType = calendarData[dateStr];

    if (cellType === "period") {
      return (
        <div className="w-full h-full bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">●</span>
        </div>
      );
    } else if (cellType === "fertile") {
      return (
        <div className="w-full h-full bg-yellow-400 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">●</span>
        </div>
      );
    } else if (cellType === "predicted-period") {
      return (
        <div className="w-full h-full bg-red-200 rounded-full flex items-center justify-center">
          <span className="text-red-600 text-xs">●</span>
        </div>
      );
    } else if (cellType === "predicted-fertile") {
      return (
        <div className="w-full h-full bg-yellow-100 rounded-full flex items-center justify-center">
          <span className="text-yellow-600 text-xs">●</span>
        </div>
      );
    }
    return null;
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const newRecord = {
        userId: userData.id,
        recordDate: values.startDate.format("YYYY-MM-DD"),
        notes: values.notes || "",
        periodDate: parseInt(values.periodLength),
        cycleLength: parseInt(values.cycleLength),
      };

      await healthCycleApi.createHealthCycle(newRecord);
      //setPeriodRecords([...periodRecords, newRecord]);
      
      const fetchHealthCycles = async () => {
        const healthCycles = await healthCycleApi.getHealthCycleByUserId(
          userData.id
        );
        setPeriodRecords(healthCycles);
      };
      fetchHealthCycles();
      setIsModalVisible(false);
      form.resetFields();
      message.success("Đã ghi nhận chu kỳ kinh nguyệt!");
    } catch (error) {
      message.error("Có lỗi xảy ra!" + error.response.data.message);
      console.log(error);
    }
  };

  // Handle edit form submission
  const handleEditSubmit = async (values) => {
    try {
      const updatedRecord = {
        userId: userData.id,
        recordDate: currentRecord.recordDate, // hoặc lấy từ currentRecord/startDate
        notes: values.notes,
        periodDate: currentRecord.periodDate, // hoặc cho phép sửa nếu muốn
        cycleLength: currentRecord.cycleLength, // hoặc cho phép sửa nếu muốn
      };

      await healthCycleApi.updateHealthCycle(currentRecord.id, updatedRecord);
      // Cập nhật lại state periodRecords nếu cần
      setIsEditModalVisible(false);
      setCurrentRecord(null);
      editForm.resetFields();
      message.success("Đã cập nhật thông tin!");
      
      const fetchHealthCycles = async () => {
        const healthCycles = await healthCycleApi.getHealthCycleByUserId(
          userData.id
        );
        setPeriodRecords(healthCycles);
      };
      fetchHealthCycles();
    } catch (error) {
      message.error("Có lỗi xảy ra!");
    }
  };

  // Tạo dữ liệu cho biểu đồ
  const getChartData = () => {
    console.log(periodRecords);
    return periodRecords.sort((a, b) => dayjs(b.recordDate).diff(dayjs(a.recordDate))).map((record) => ({
      month: dayjs(record.recordDate).format("DD/MM/YYYY"),
      cycleLength: record.cycleLength,
      periodDate: record.periodDate,
    }));
  };

  const chartData = getChartData();

  const getNextPeriods = (count = 3) => {
    if (periodRecords.length === 0) return [];
    // Sắp xếp giảm dần theo recordDate
    const sortedRecords = [...periodRecords].sort((a, b) =>
      dayjs(b.recordDate).diff(dayjs(a.recordDate))
    );
    const lastRecord = sortedRecords[0];
    const results = [];
    let lastDate = dayjs(lastRecord.recordDate);
    let cycleLength = lastRecord.cycleLength;

    for (let i = 1; i <= count; i++) {
      lastDate = lastDate.add(cycleLength, "day");
      results.push(lastDate.format("DD/MM/YYYY"));
    }
    return results;
  };

  const nextPeriods = getNextPeriods(3);

  // Hàm lấy giá trị mặc định cho form dựa trên record gần nhất
  const getDefaultValues = () => {
    if (periodRecords.length === 0) return {};
    
    // Lấy record gần nhất
    const sortedRecords = [...periodRecords].sort((a, b) =>
      dayjs(b.recordDate).diff(dayjs(a.recordDate))
    );
    const lastRecord = sortedRecords[0];
    
    // Kiểm tra nếu chu kỳ nằm trong khoảng 21-35 ngày thì điền sẵn
    const defaultValues: { cycleLength?: number; periodLength?: number } = {};
    
    if (lastRecord.cycleLength >= 21 && lastRecord.cycleLength <= 35) {
      defaultValues.cycleLength = lastRecord.cycleLength;
    }
    
    if (lastRecord.periodDate >= 3 && lastRecord.periodDate <= 7) {
      defaultValues.periodLength = lastRecord.periodDate;
    }
    
    return defaultValues;
  };


  return (
    <MainLayout
      activeMenu="period-tracking"
      displayName="Theo dõi chu kỳ kinh nguyệt"
    >
      <div className="max-w-7xl mx-auto py-6 px-4">
        {periodRecords.length === 0 ? (
          // Giao diện khi chưa có dữ liệu
          <div className="text-center py-12">
            <CalendarOutlined className="text-6xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Bắt đầu theo dõi chu kỳ kinh nguyệt
            </h2>
            <p className="text-gray-500 mb-8">
              Ghi nhận thông tin chu kỳ để theo dõi sức khỏe tốt hơn
            </p>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
              className="bg-pink-500 border-pink-500 hover:bg-pink-600"
            >
              Nhập thông tin chu kỳ
            </Button>
          </div>
        ) : (
          // Giao diện khi đã có dữ liệu
          <div className="space-y-6">
            {/* Header với nút thêm mới */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">
                Theo dõi chu kỳ kinh nguyệt
              </h1>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
                className="bg-pink-500 border-pink-500 hover:bg-pink-600"
              >
                Thêm kỳ kinh mới
              </Button>
            </div>

            {/* Thống kê */}
            {stats && (
              <Row gutter={16}>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Kỳ kinh tiếp theo"
                      value={stats.nextPeriodDate}
                      valueStyle={{ color: "#3f8600" }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Còn lại"
                      value={stats.daysUntilNext}
                      suffix="ngày"
                      valueStyle={{ color: "#cf1322" }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Chu kỳ trung bình"
                      value={stats.avgCycleLength}
                      suffix="ngày"
                      valueStyle={{ color: "#1890ff" }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Số ngày hành kinh TB"
                      value={stats.avgPeriodLength}
                      suffix="ngày"
                      valueStyle={{ color: "#722ed1" }}
                    />
                  </Card>
                </Col>
              </Row>
            )}

          

            {/* Calendar và Biểu đồ */}
            <Row gutter={16}>
              <Col span={16}>
                <Card
                  title="Lịch theo dõi"
                  extra={
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span>Hành kinh</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                        <span>Dễ thụ thai</span>
                      </div>
                    </div>
                  }
                >
                  <div style={wrapperStyle}>
                    <Calendar
                      fullscreen={false}
                      onPanelChange={onPanelChange}
                      dateCellRender={dateCellRender}
                    />
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  title="Thống kê theo tháng"
                  // extra={
                  //   <Button
                  //     type="text"
                  //     icon={<EditOutlined />}
                  //     onClick={() => {
                  //       setCurrentRecord(
                  //         periodRecords[periodRecords.length - 1]
                  //       );
                  //       setIsEditModalVisible(true);
                  //     }}
                  //   >
                  //     Cập nhật
                  //   </Button>
                  // }
                >
                  <div className="space-y-4">
                    {chartData.slice(0, 4).map((data, index) => (
                      <div key={index} className="border-b pb-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">
                            {data.month}
                          </span>
                          <span className="text-xs text-gray-500">
                            {data.cycleLength} ngày
                          </span>
                        </div>
                        <Progress
                          percent={(data.periodDate / data.cycleLength) * 100}
                          size="small"
                          strokeColor="#ff4d4f"
                          showInfo={false}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Hành kinh: {data.periodDate} ngày</span>
                          <span>Chu kỳ: {data.cycleLength} ngày</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        )}

        {/* Modal nhập thông tin mới */}
        <Modal
          title="Nhập thông tin chu kỳ kinh nguyệt"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form 
            form={form} 
            layout="vertical" 
            onFinish={handleSubmit}
            initialValues={getDefaultValues()}
          >
            <Form.Item
              label="Ngày bắt đầu kinh"
              name="startDate"
              rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                onChange={(date) => {
                  // Tính lại chu kỳ trung bình động

                  const recentRecords = periodRecords[0];
                  const dateDiff = dayjs(date).diff(dayjs(recentRecords.recordDate), "day");
                  console.log(dateDiff);
                  if (dateDiff && dateDiff >= 21 && dateDiff <= 35) {
                    form.setFieldsValue({ cycleLength: dateDiff });
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              label="Số ngày hành kinh"
              name="periodLength"
              rules={[
                { required: true, message: "Vui lòng nhập số ngày hành kinh!" },
              ]}
            >
              <Input type="number" min={3} max={10} placeholder="Ví dụ: 5" />
            </Form.Item>

            <Form.Item
              label="Chu kỳ trung bình (ngày)"
              name="cycleLength"
              rules={[
                { required: true, message: "Vui lòng nhập chu kỳ trung bình!" },
              ]}
            >
              <Input type="number" min={20} max={45} placeholder="Ví dụ: 28" />
            </Form.Item>

            <Form.Item label="Ghi chú" name="notes">
              <TextArea rows={3} placeholder="Ghi chú về kỳ kinh này..." />
            </Form.Item>

            <Form.Item className="mb-0">
              <div className="flex justify-end space-x-2">
                <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-pink-500 border-pink-500 hover:bg-pink-600"
                >
                  Lưu
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal cập nhật thông tin */}
        <Modal
          title="Cập nhật thông tin chu kỳ"
          open={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          footer={null}
          width={500}
        >
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleEditSubmit}
            initialValues={
              currentRecord
                ? {
                    endDate: dayjs(currentRecord.endDate),
                    notes: currentRecord.notes,
                  }
                : {}
            }
          >
            <Form.Item
              label="Ngày kết thúc chu kỳ"
              name="endDate"
              rules={[
                { required: true, message: "Vui lòng chọn ngày kết thúc!" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item label="Ghi chú" name="notes">
              <TextArea rows={3} placeholder="Ghi chú về kỳ kinh này..." />
            </Form.Item>

            <Form.Item className="mb-0">
              <div className="flex justify-end space-x-2">
                <Button onClick={() => setIsEditModalVisible(false)}>
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-pink-500 border-pink-500 hover:bg-pink-600"
                >
                  Cập nhật
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </MainLayout>
  );
};
