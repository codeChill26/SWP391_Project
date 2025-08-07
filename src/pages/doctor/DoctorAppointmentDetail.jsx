import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { appointmentApi } from "../../api/appointment-api";
import { AppointmentInfo } from "../../components/patients/AppointmentInfo";
import StaffLayout from "../../layout/StaffLayout";
import UpdateAppointmentStatusModal from "../../components/UpdateAppointmentStatusModal";
import { Button, message, Space, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { serviceApi } from "../../api/service-api";
import DoctorLayout from "../../layout/DoctorLayout";
import CompleteAppointmentModal from "../../components/CompleteAppointmentModal";
import { medicalTestApi } from "../../api/medicalTest-api";
import { provideMedicalTestApi } from "../../api/provideMedicalTest-api";
import MedicalTestCard from "../../components/MedicalTestCard";
import CreateMedicalTestModal from "../../components/CreateMedicalTestModal";
import UpdateMedicalTestModal from "../../components/UpdateMedicalTestModal";
import { vnpayApi } from "../../api/vnpay-api";
import { useUser } from "../../context/UserContext";

export const DoctorAppointmentDetail = () => {
  // get the booking id from the url
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [medicalTests, setMedicalTests] = useState([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedMedicalTest, setSelectedMedicalTest] = useState(null);
  const [providedMedicalTest, setProvidedMedicalTest] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userData } = useUser();

  useEffect(() => {
    // get the booking data from the database
    const fetchAppointment = async () => {
      const booking = await appointmentApi.getAppointmentById(id);
      setAppointment(booking);
    };
    fetchAppointment();
  }, [id]);

  useEffect(() => {
    if (appointment && appointment.id) {
      const fetchMedicalTests = async () => {
        const tests = await medicalTestApi.getMedicalTestByAppointmentId(
          appointment.id
        );
        setMedicalTests(tests);
      };
      fetchMedicalTests();
    }
  }, [appointment]);

  const handleCreateMedicalTest = async (values) => {
    try {
      // Format lại ngày cho đúng chuẩn ISO nếu cần
      const data = {
        appointmentId: appointment.id,
        testName: values.testName,
        testDate: values.testDate.toISOString(),
        status: "pending", // Trạng thái mặc định là pending
        price: values.price || 0,
      };
      await medicalTestApi.createMedicalTest(data);
      setCreateModalVisible(false);
      message.success("Tạo xét nghiệm thành công!");
      // Sau khi tạo thành công, reload lại danh sách
      if (appointment && appointment.id) {
        const tests = await medicalTestApi.getMedicalTestByAppointmentId(
          appointment.id
        );
        setMedicalTests(tests);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo xét nghiệm!");
      console.error(error);
    }
  };

  const handleUpdateAppointmentStatus = async (values) => {
    // values: { id, status, doctorId }
    // Gọi API cập nhật ở đây
    try {
      const response = await appointmentApi.completeAppointment(
        appointment.id,
        values
      );
      setModalVisible(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  // Xử lý thanh toán cho medical tests
  const handlePayment = async () => {
    try {
      setLoading(true);

      // Lấy danh sách medical tests chưa thanh toán
      const unpaidTests = medicalTests.filter(
        (test) => test.status === "pending"
      );

      if (unpaidTests.length === 0) {
        message.warning("Không có xét nghiệm nào cần thanh toán!");
        return;
      }

      // Tính tổng tiền
      const totalAmount = unpaidTests.reduce(
        (sum, test) => sum + test.price,
        0
      );

      // Tạo orderId với random string để tránh trùng lặp
      const orderId = `MEDICAL_${appointment.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Gọi API VNPay để tạo thanh toán
      const response = await vnpayApi.createPayment({
        amount: totalAmount,
        orderId: orderId,
        orderInfo: `Thanh toán xét nghiệm - Bệnh nhân`,
        returnUrl: `${window.location.origin}/payment-callback`,
      });

      // Lưu thông tin pending vào localStorage
      const pendingData = {
        orderId: orderId,
        appointmentId: appointment.id,
        testIds: unpaidTests.map((test) => test.id),
        totalAmount: totalAmount,
      };
      localStorage.setItem("pendingMedicalTests", JSON.stringify(pendingData));

      // Chuyển hướng đến trang thanh toán
      window.location.href = response.paymentUrl;
    } catch (error) {
      console.error("Error creating payment:", error);
      message.error("Có lỗi xảy ra khi tạo thanh toán!");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa xét nghiệm
  const handleDeleteMedicalTest = async (testId) => {
    console.log(testId)
    try {
      // Kiểm tra xem xét nghiệm có thể xóa không (chỉ xóa những test chưa thanh toán)
      const testToDelete = medicalTests.find(test => test.id === testId);
      if (!testToDelete) {
        message.error("Không tìm thấy xét nghiệm!");
        return;
      }
      console.log(testToDelete)

      if (testToDelete.status !== "pending") {
        message.warning("Chỉ có thể xóa xét nghiệm chưa thanh toán!");
        return;
      }

      // Hiển thị confirm dialog
      const confirmed = window.confirm("Bạn có chắc chắn muốn xóa xét nghiệm này?");
      if (!confirmed) return;

      // Gọi API xóa xét nghiệm
      await medicalTestApi.deleteMedicalTest(testId);
      
      message.success("Xóa xét nghiệm thành công!");
      
      // Reload lại danh sách medical tests
      if (appointment && appointment.id) {
        const tests = await medicalTestApi.getMedicalTestByAppointmentId(appointment.id);
        setMedicalTests(tests);
      }
    } catch (error) {
      console.error("Error deleting medical test:", error);
      message.error("Có lỗi xảy ra khi xóa xét nghiệm!");
    }
  };

  // Xử lý mở modal cập nhật medical test
  const handleOpenUpdateModal = async (test) => {
    if (test.status !== "paid") {
      message.warning("Chỉ có thể cập nhật kết quả cho xét nghiệm đã thanh toán!");
      return;
    }

    try {
      // Lấy thông tin provided medical test
      const providedTests = await provideMedicalTestApi.getAllMedicalTests();
      const providedTest = providedTests.find(pt => pt.testName === test.testName);
      setProvidedMedicalTest(providedTest);
      setSelectedMedicalTest(test);
      setUpdateModalVisible(true);
    } catch (error) {
      console.error('Error fetching provided medical test:', error);
      // Nếu không lấy được thông tin provided, vẫn mở modal với thông tin cơ bản
      setProvidedMedicalTest(null);
      setSelectedMedicalTest(test);
      setUpdateModalVisible(true);
    }
  };

  // Xử lý cập nhật medical test
  const handleUpdateMedicalTest = async (updatedData) => {
    try {
      // Gọi API cập nhật medical test - chỉ gửi result và notes
      await medicalTestApi.updateMedicalTest(updatedData.id, {
        testName: updatedData.testName,
        testDate: updatedData.testDate,
        status: updatedData.status,
        price: updatedData.price,
        paymentId: updatedData.paymentId,
        appointmentId: updatedData.appointmentId,
        
        result: updatedData.result,
        notes: updatedData.notes,
      });
      
      message.success("Cập nhật kết quả xét nghiệm thành công!");
      setUpdateModalVisible(false);
      setSelectedMedicalTest(null);
      
      // Reload lại danh sách medical tests
      if (appointment && appointment.id) {
        const tests = await medicalTestApi.getMedicalTestByAppointmentId(appointment.id);
        setMedicalTests(tests);
      }
    } catch (error) {
      console.error("Error updating medical test:", error);
      message.error("Có lỗi xảy ra khi cập nhật kết quả xét nghiệm!");
    }
  };

  // Kiểm tra có medical tests chưa thanh toán không
  const hasUnpaidTests = medicalTests
    ? medicalTests.some((test) => test.status === "pending")
    : false;
  const unpaidTestsCount = medicalTests
    ? medicalTests.filter((test) => test.status === "pending").length
    : 0;
  const totalUnpaidAmount = medicalTests
    ? medicalTests
        .filter((test) => test.status === "pending")
        .reduce((sum, test) => sum + (test.price || 0), 0)
    : 0;

  // Hàm format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Hàm hiển thị trạng thái
  const getStatusTag = (status) => {
    switch (status) {
      case "pending":
        return <Tag color="orange">Chờ thanh toán</Tag>;
      case "paid":
        return <Tag color="green">Đã thanh toán</Tag>;
      case "completed":
        return <Tag color="blue">Hoàn thành</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  return (
    <DoctorLayout activeMenu="staff/appointment" pageTitle="Appointment Detail">
      {/* Content based on active tab */}
      <div>
        <h2 className="font-bold text-xl mb-4 text-[#3B9AB8] flex items-center gap-2">
          Thông tin chi tiết cuộc hẹn
        </h2>
        <AppointmentInfo appointment={appointment} />

        {appointment && appointment.status === "APPROVE" && (medicalTests.length === 0 || !hasUnpaidTests) && (
          <Button type="primary" onClick={() => setModalVisible(true)}>
            Hoàn thành khám bệnh
          </Button>
        )}
      </div>

      <div>
        <h2 className="font-bold text-xl mb-4 text-[#3B9AB8] flex items-center gap-2">
          Kết quả chẩn đoán
        </h2>

        {/* Thống kê medical tests */}
        {medicalTests.length > 0 && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-600">Tổng số xét nghiệm: </span>
                <span className="font-semibold">{medicalTests.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Chưa thanh toán: </span>
                <span className="font-semibold text-orange-600">
                  {unpaidTestsCount}
                </span>
              </div>
              {hasUnpaidTests && (
                <div>
                  <span className="text-gray-600">
                    Tổng tiền chưa thanh toán:{" "}
                  </span>
                  <span className="font-semibold text-red-600">
                    {formatPrice(totalUnpaidAmount)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {appointment && appointment.status == "APPROVE" && (
          <Space className="mb-4">
            <Button type="dashed" onClick={() => setCreateModalVisible(true)}>
              Thêm xét nghiệm mới
            </Button>

            {hasUnpaidTests && (
              <Button
                type="primary"
                // danger
                loading={loading}
                onClick={handlePayment}
              >
                Thanh toán ({unpaidTestsCount} xét nghiệm -{" "}
                {formatPrice(totalUnpaidAmount)})
              </Button>
            )}
          </Space>
        )}

        {medicalTests.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            Không có xét nghiệm nào.
          </div>
        ) : (
          <div className="space-y-4">
            {medicalTests.map((test) => (
              <div key={test.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{test.testName}</h3>
                  <div className="flex items-center gap-2">
                    {getStatusTag(test.status)}
                    {/* Nút xóa chỉ hiển thị cho xét nghiệm chưa thanh toán */}
                    {test.status === "pending" && (
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteMedicalTest(test.id)}
                        title="Xóa xét nghiệm"
                        size="small"
                      />
                    )}
                    {/* Nút cập nhật chỉ hiển thị cho xét nghiệm đã thanh toán và appointment đang approve */}
                    {test.status === "paid" && appointment?.status === "APPROVE" && (
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleOpenUpdateModal(test)}
                        title="Cập nhật kết quả"
                        size="small"
                      />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Ngày xét nghiệm: </span>
                    <span>
                      {new Date(test.testDate).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Giá: </span>
                    <span className="font-semibold text-green-600">
                      {formatPrice(test.price)}
                    </span>
                  </div>
                  {/* Hiển thị paymentId nếu có */}
                  {test.paymentId && (
                    <div className="col-span-2">
                      <span className="text-gray-600">Mã thanh toán: </span>
                      <Tag color="blue" className="font-mono text-xs">
                        {test.paymentId}
                      </Tag>
                    </div>
                  )}
                  {test.result && (
                    <div className="col-span-2">
                      <span className="text-gray-600">Kết quả: </span>
                      <span>{test.result}</span>
                    </div>
                  )}
                  {test.notes && (
                    <div className="col-span-2">
                      <span className="text-gray-600">Ghi chú: </span>
                      <span>{test.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CompleteAppointmentModal
        visible={modalVisible}
        onOk={handleUpdateAppointmentStatus}
        onCancel={() => setModalVisible(false)}
        appointment={appointment}
      />

      <CreateMedicalTestModal
        visible={createModalVisible}
        onOk={handleCreateMedicalTest}
        onCancel={() => setCreateModalVisible(false)}
        appointmentId={appointment?.id}
      />

      <UpdateMedicalTestModal
        visible={updateModalVisible}
        medicalTest={selectedMedicalTest}
        providedMedicalTest={providedMedicalTest}
        onOk={handleUpdateMedicalTest}
        onCancel={() => {
          setUpdateModalVisible(false);
          setSelectedMedicalTest(null);
          setProvidedMedicalTest(null);
        }}
      />
    </DoctorLayout>
  );
};
