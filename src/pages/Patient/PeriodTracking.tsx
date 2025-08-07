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
  DeleteOutlined,
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

  // Hàm tính tuổi
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Kiểm tra điều kiện truy cập
  const checkAccessPermission = () => {
    if (!userData) return { allowed: false, reason: 'no_user' };
    
    // Kiểm tra giới tính
    if (userData.gender !== 'female') {
      return { allowed: false, reason: 'gender' };
    }
    
    // Kiểm tra tuổi
    if (userData.dob) {
      const age = calculateAge(userData.dob);
      if (age < 8) {
        return { allowed: false, reason: 'age' };
      }
    }
    
    return { allowed: true };
  };

  const accessCheck = checkAccessPermission();

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
      console.log("userData", userData);
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
        recordDate: values.recordDate.format("YYYY-MM-DD"),
        notes: values.notes,
        periodDate: parseInt(values.periodLength),
        cycleLength: parseInt(values.cycleLength),
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

  const handleDeleteRecord = async (recordId) => {
    try {
      await healthCycleApi.deleteHealthCycle(recordId);
      message.success("Xóa thành công!");

      const fetchHealthCycles = async () => {
        const healthCycles = await healthCycleApi.getHealthCycleByUserId(
          userData.id
        );
        setPeriodRecords(healthCycles);
      };
      fetchHealthCycles();
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa!");
    }
  };

  const handleEditRecord = (record) => {
    setCurrentRecord(record);
    setIsEditModalVisible(true);
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

  // Định nghĩa kiểu dữ liệu cho advice
  interface Advice {
    title: string;
    subtitle: string;
    tips: string[];
    nutrition: string[];
    activities: string[];
  }

  // Hàm xác định giai đoạn hiện tại và đưa ra lời khuyên
  const getCurrentPhaseAndAdvice = () => {
    if (periodRecords.length === 0) return null;

    const today = dayjs();
    const sortedRecords = [...periodRecords].sort((a, b) =>
      dayjs(b.recordDate).diff(dayjs(a.recordDate))
    );
    const lastRecord = sortedRecords[0];
    const lastStartDate = dayjs(lastRecord.recordDate);
    const cycleLength = lastRecord.cycleLength;
    const periodLength = lastRecord.periodDate;

    // Tính ngày bắt đầu kỳ kinh tiếp theo
    const nextPeriodStart = lastStartDate.add(cycleLength, "day");
    
    // Tính ngày rụng trứng (14 ngày trước kỳ kinh tiếp theo)
    const ovulationDate = nextPeriodStart.subtract(14, "day");
    
    // Tính khoảng thời gian dễ thụ thai (5 ngày trước và sau ngày rụng trứng)
    const fertileStart = ovulationDate.subtract(2, "day");
    const fertileEnd = ovulationDate.add(2, "day");

    // Xác định giai đoạn hiện tại
    let currentPhase = "";
    let advice: Advice = {
      title: "",
      subtitle: "",
      tips: [],
      nutrition: [],
      activities: []
    };
    let colorClass = "";

    // Kiểm tra xem hôm nay có phải là ngày hành kinh không
    const isInPeriod = (today.isAfter(nextPeriodStart) || today.isSame(nextPeriodStart)) && 
                      today.isBefore(nextPeriodStart.add(periodLength, "day"));

    if (isInPeriod) {
      // Giai đoạn hành kinh
      currentPhase = "Hành kinh";
      colorClass = "bg-red-50 border-red-400 text-red-800";
      advice = {
        title: "🩸 Giai đoạn hành kinh",
        subtitle: "Chăm sóc sức khỏe trong kỳ kinh",
        tips: [
          "Nghỉ ngơi đầy đủ và ngủ sớm",
          "Uống nhiều nước và ăn thực phẩm giàu sắt",
          "Tập thể dục nhẹ nhàng như yoga, đi bộ",
          "Tránh stress và căng thẳng",
          "Sử dụng tampon/băng vệ sinh thay đổi thường xuyên"
        ],
        nutrition: [
          "Thực phẩm giàu sắt: thịt đỏ, rau xanh, đậu",
          "Thực phẩm giàu vitamin C: cam, chanh, ớt chuông",
          "Tránh caffeine và đồ uống có cồn"
        ],
        activities: [
          "Tập yoga nhẹ nhàng",
          "Đi bộ 15-20 phút mỗi ngày",
          "Thiền định để giảm stress"
        ]
      };
    } else if ((today.isAfter(fertileStart) || today.isSame(fertileStart)) && (today.isBefore(fertileEnd) || today.isSame(fertileEnd))) {
      // Giai đoạn dễ thụ thai
      currentPhase = "Dễ thụ thai";
      colorClass = "bg-yellow-50 border-yellow-400 text-yellow-800";
      advice = {
        title: "🌺 Giai đoạn dễ thụ thai",
        subtitle: "Thời điểm rụng trứng - cơ thể có nhiều năng lượng",
        tips: [
          "Tăng cường tập thể dục với cường độ vừa phải",
          "Ăn uống đầy đủ dinh dưỡng",
          "Quan hệ tình dục an toàn nếu có ý định mang thai",
          "Theo dõi nhiệt độ cơ thể và chất nhầy cổ tử cung",
          "Tránh stress để tăng khả năng thụ thai"
        ],
        nutrition: [
          "Thực phẩm giàu protein: cá, thịt, trứng",
          "Thực phẩm giàu vitamin E: hạt hướng dương, bơ",
          "Thực phẩm giàu kẽm: hải sản, hạt bí"
        ],
        activities: [
          "Tập cardio vừa phải",
          "Yoga hoặc pilates",
          "Đi bộ nhanh 30 phút"
        ]
      };
    } else {
      // Các ngày còn lại
      currentPhase = "Các ngày còn lại";
      colorClass = "bg-blue-50 border-blue-400 text-blue-800";
      advice = {
        title: "🌸 Giai đoạn phát triển nang trứng",
        subtitle: "Cơ thể đang chuẩn bị cho chu kỳ tiếp theo",
        tips: [
          "Duy trì chế độ tập luyện đều đặn",
          "Ăn uống cân bằng và đầy đủ dinh dưỡng",
          "Theo dõi các triệu chứng PMS",
          "Chuẩn bị tinh thần cho kỳ kinh sắp tới",
          "Giữ tâm trạng thoải mái và tích cực"
        ],
        nutrition: [
          "Thực phẩm giàu vitamin B: ngũ cốc nguyên hạt, chuối",
          "Thực phẩm giàu magie: hạt điều, chocolate đen",
          "Thực phẩm giàu omega-3: cá hồi, hạt chia"
        ],
        activities: [
          "Tập thể dục cường độ trung bình",
          "Thiền định hoặc yoga",
          "Hoạt động ngoài trời"
        ]
      };
    }

    return {
      phase: currentPhase,
      advice,
      colorClass,
      daysUntilNextPeriod: nextPeriodStart.diff(today, "day"),
      daysUntilOvulation: fertileStart.diff(today, "day")
    };
  };

  const currentPhaseInfo = getCurrentPhaseAndAdvice();


  return (
    <MainLayout
      activeMenu="period-tracking"
      displayName="Theo dõi chu kỳ kinh nguyệt"
    >
      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Kiểm tra quyền truy cập */}
        {!accessCheck.allowed ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-red-500 text-6xl mb-4">🚫</div>
              <h2 className="text-2xl font-bold text-red-700 mb-4">
                Không thể truy cập
              </h2>
              <p className="text-red-600 mb-4">
                {accessCheck.reason === 'gender' 
                  ? 'Tính năng này chỉ dành cho người dùng nữ.'
                  : accessCheck.reason === 'age'
                  ? 'Bạn phải từ 8 tuổi trở lên để sử dụng tính năng này.'
                  : 'Không thể xác định thông tin người dùng.'
                }
              </p>
              <p className="text-sm text-red-500">
                Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
              </p>
            </div>
          </div>
        ) : periodRecords.length === 0 ? (
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

          

            {/* Calendar và Thống kê */}
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
                <Card title="Thống kê theo tháng">
                  <div className="space-y-4">
                    {chartData.slice(0, 3).map((data, index) => {
                      const record = periodRecords.find(r => 
                        dayjs(r.recordDate).format("DD/MM/YYYY") === data.month
                      );
                      
                      return (
                        <div key={index} className="border-b pb-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">
                              {data.month}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">
                                {data.cycleLength} ngày
                              </span>
                              {/* Chỉ hiển thị nút cho phần tử đầu tiên (mới nhất) */}
                              {index === 0 && record && (
                                <div className="flex space-x-1">
                                  <Button
                                    type="text"
                                    size="small"
                                    icon={<EditOutlined />}
                                    onClick={() => handleEditRecord(record)}
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Cập nhật"
                                  />
                                  <Button
                                    type="text"
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    onClick={() => {
                                      Modal.confirm({
                                        title: 'Xác nhận xóa',
                                        content: 'Bạn có chắc chắn muốn xóa kỳ kinh này?',
                                        okText: 'Xóa',
                                        okType: 'danger',
                                        cancelText: 'Hủy',
                                        onOk: () => handleDeleteRecord(record.id)
                                      });
                                    }}
                                    className="text-red-600 hover:text-red-800"
                                    title="Xóa"
                                  />
                                </div>
                              )}
                            </div>
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
                      );
                    })}
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Lời khuyên sức khỏe dựa trên giai đoạn hiện tại */}
            {currentPhaseInfo && (
              <Row>
                <Col span={24}>
                  <Card 
                    title={`Lời khuyên sức khỏe - ${currentPhaseInfo.phase}`}
                    className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200"
                  >
                    {/* Thông tin giai đoạn hiện tại */}
                    <div className={`p-4 mb-4 border-l-4 rounded ${currentPhaseInfo.colorClass}`}>
                      <h3 className="text-lg font-semibold mb-2">{currentPhaseInfo.advice?.title}</h3>
                      <p className="text-sm mb-3">{currentPhaseInfo.advice?.subtitle}</p>
                      
                      {/* Thông tin thời gian */}
                      <div className="flex space-x-4 text-xs">
                        {currentPhaseInfo.daysUntilNextPeriod > 0 && (
                          <span className="bg-white px-2 py-1 rounded">
                            Kỳ kinh tiếp theo: {currentPhaseInfo.daysUntilNextPeriod} ngày nữa
                          </span>
                        )}
                        {currentPhaseInfo.daysUntilOvulation > 0 && (
                          <span className="bg-white px-2 py-1 rounded">
                            Thời điểm dễ thụ thai: {currentPhaseInfo.daysUntilOvulation} ngày nữa
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Lời khuyên chi tiết */}
                    <Row gutter={16}>
                      <Col span={8}>
                        <div className="p-4 bg-white rounded border">
                          <h4 className="font-medium text-gray-800 mb-3">💡 Lời khuyên chung</h4>
                          <ul className="text-xs space-y-2">
                            {currentPhaseInfo.advice?.tips?.map((tip, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-pink-500 mr-2">•</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </Col>
                      
                      <Col span={8}>
                        <div className="p-4 bg-white rounded border">
                          <h4 className="font-medium text-gray-800 mb-3">🥗 Dinh dưỡng</h4>
                          <ul className="text-xs space-y-2">
                            {currentPhaseInfo.advice?.nutrition?.map((item, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-500 mr-2">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </Col>
                      
                      <Col span={8}>
                        <div className="p-4 bg-white rounded border">
                          <h4 className="font-medium text-gray-800 mb-3">🏃‍♀️ Hoạt động</h4>
                          <ul className="text-xs space-y-2">
                            {currentPhaseInfo.advice?.activities?.map((activity, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </Col>
                    </Row>

                    {/* Lời khuyên bổ sung dựa trên thống kê */}
                    <div className="mt-4">
                      <Row gutter={16}>
                        {stats && stats.daysUntilNext <= 7 && (
                          <Col span={8}>
                            <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                              <p className="text-sm font-medium text-orange-800 mb-2">
                                ⚠️ Kỳ kinh sắp đến
                              </p>
                              <p className="text-xs text-orange-600">
                                Chuẩn bị sẵn sàng cho kỳ kinh sắp tới. Nghỉ ngơi đầy đủ và ăn uống lành mạnh.
                              </p>
                            </div>
                          </Col>
                        )}
                        
                        {stats && (stats.avgCycleLength < 25 || stats.avgCycleLength > 35) && (
                          <Col span={8}>
                            <div className={`p-4 border-l-4 rounded ${
                              stats.avgCycleLength < 25 
                                ? 'bg-blue-50 border-blue-400' 
                                : 'bg-yellow-50 border-yellow-400'
                            }`}>
                              <p className={`text-sm font-medium mb-2 ${
                                stats.avgCycleLength < 25 ? 'text-blue-800' : 'text-yellow-800'
                              }`}>
                                {stats.avgCycleLength < 25 ? '💡 Chu kỳ ngắn' : '⏰ Chu kỳ dài'}
                              </p>
                              <p className={`text-xs ${
                                stats.avgCycleLength < 25 ? 'text-blue-600' : 'text-yellow-600'
                              }`}>
                                {stats.avgCycleLength < 25 
                                  ? 'Chu kỳ của bạn ngắn hơn bình thường. Nên tham khảo ý kiến bác sĩ nếu có bất thường.'
                                  : 'Chu kỳ của bạn dài hơn bình thường. Theo dõi thêm và tham khảo ý kiến chuyên gia.'
                                }
                              </p>
                            </div>
                          </Col>
                        )}
                        
                        {stats && stats.avgPeriodLength > 7 && (
                          <Col span={8}>
                            <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded">
                              <p className="text-sm font-medium text-red-800 mb-2">
                                🩸 Thời gian hành kinh dài
                              </p>
                              <p className="text-xs text-red-600">
                                Thời gian hành kinh kéo dài có thể cần được kiểm tra. Tham khảo ý kiến bác sĩ.
                              </p>
                            </div>
                          </Col>
                        )}
                      </Row>
                    </div>
                  </Card>
                </Col>
              </Row>
            )}
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
                  if (dateDiff && dateDiff >= 21 && dateDiff <= 45) {
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
              <Input type="number" min={1} max={14} placeholder="Ví dụ: 5" />
            </Form.Item>

            <Form.Item
              label="Chu kỳ trung bình (ngày)"
              name="cycleLength"
              rules={[
                { required: true, message: "Vui lòng nhập chu kỳ trung bình!" },
              ]}
            >
              <Input type="number" min={20} max={60} placeholder="Ví dụ: 28" />
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
          width={600}
        >
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleEditSubmit}
            initialValues={
              currentRecord
                ? {
                    recordDate: dayjs(currentRecord.recordDate),
                    periodLength: currentRecord.periodDate,
                    cycleLength: currentRecord.cycleLength,
                    notes: currentRecord.notes,
                  }
                : {}
            }
          >
            <Form.Item
              label="Ngày bắt đầu kinh"
              name="recordDate"
              rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                onChange={(date) => {
                  // Tính lại chu kỳ trung bình động
                  if (currentRecord && date) {
                    const recentRecords = periodRecords.filter(r => r.id !== currentRecord.id);
                    if (recentRecords.length > 0) {
                      const lastRecord = recentRecords[0];
                      const dateDiff = dayjs(date).diff(dayjs(lastRecord.recordDate), "day");
                      if (dateDiff && dateDiff >= 21 && dateDiff <= 45) {
                        editForm.setFieldsValue({ cycleLength: dateDiff });
                      }
                    }
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
              <Input type="number" min={1} max={14} placeholder="Ví dụ: 5" />
            </Form.Item>

            <Form.Item
              label="Chu kỳ trung bình (ngày)"
              name="cycleLength"
              rules={[
                { required: true, message: "Vui lòng nhập chu kỳ trung bình!" },
              ]}
            >
              <Input type="number" min={20} max={60} placeholder="Ví dụ: 28" />
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
