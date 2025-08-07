import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  getAppointmentData, 
  clearAppointmentData, 
  isPaymentSuccessful, 
  extractPaymentResult 
} from '../../utils/paymentUtils';
import { appointmentApi } from '../../api/appointment-api';
import { medicalTestApi } from '../../api/medicalTest-api';
import { Card, Descriptions, Tag, Divider, Typography, Space, Table } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, DollarOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useUser } from '../../context/UserContext';

const { Title, Text } = Typography;

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userData } = useUser();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [message, setMessage] = useState('Đang xử lý thanh toán...');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [medicalTestDetails, setMedicalTestDetails] = useState(null);

  useEffect(() => {
    const handlePaymentCallback = async () => {
      try {
        // Extract payment result from URL parameters
        const paymentResult = extractPaymentResult(searchParams);

        console.log("paymentResult", paymentResult)
        console.log("URL searchParams:", Object.fromEntries(searchParams.entries()))
        setPaymentDetails(paymentResult);
        
        // Check if payment was successful
        if (isPaymentSuccessful(paymentResult)) {
          // Kiểm tra xem có phải thanh toán medical test không
          const pendingMedicalTests = localStorage.getItem('pendingMedicalTests');
          console.log("pendingMedicalTests from localStorage:", pendingMedicalTests);
          
          // Kiểm tra xem có phải medical test payment dựa trên orderId
          const isMedicalTestPayment = paymentResult.transactionId && 
            paymentResult.transactionId.startsWith('MEDICAL_');
          
          if (pendingMedicalTests || isMedicalTestPayment) {
            // Xử lý thanh toán medical test
            await handleMedicalTestPayment(paymentResult);
          } else {
            // Xử lý thanh toán appointment thông thường
            await handleAppointmentPayment(paymentResult);
          }
          
        } else {
          // Payment failed
          const appointmentData = getAppointmentData();
          setAppointmentDetails(appointmentData);
          clearAppointmentData();
          localStorage.removeItem('pendingMedicalTests');
          setStatus('error');
          setMessage('Thanh toán thất bại. Vui lòng thử lại.');
        }
        
      } catch (error) {
        console.error('Error processing payment callback:', error);
        const appointmentData = getAppointmentData();
        setAppointmentDetails(appointmentData);
        clearAppointmentData();
        localStorage.removeItem('pendingMedicalTests');
        setStatus('error');
        setMessage('Có lỗi xảy ra. Vui lòng liên hệ hỗ trợ.');
      }
    };

    const handleMedicalTestPayment = async (paymentResult) => {
      try {
        let pendingData = null;
        
        // Thử lấy từ localStorage trước
        const pendingMedicalTests = localStorage.getItem('pendingMedicalTests');
        if (pendingMedicalTests) {
          pendingData = JSON.parse(pendingMedicalTests);
        } else {
          // Nếu không có trong localStorage, tạo từ orderId
          const orderIdParts = paymentResult.transactionId.split('_');
          if (orderIdParts.length >= 3) {
            const appointmentId = orderIdParts[1];
            pendingData = {
              orderId: paymentResult.transactionId,
              appointmentId: appointmentId,
              testIds: [], // Sẽ được lấy từ API
              totalAmount: parseInt(paymentResult.amount) / 100 // VNPay trả về số tiền nhân 100
            };
          }
        }
        
        if (!pendingData) {
          throw new Error('Không thể xác định thông tin thanh toán medical test');
        }
        
        // Gọi API để cập nhật trạng thái thanh toán cho tất cả medical tests
        await medicalTestApi.updateMedicalTestPayment(
          pendingData.appointmentId, 
          paymentResult.transactionId
        );

        // Lấy danh sách medical tests để hiển thị số lượng
        try {
          const medicalTests = await medicalTestApi.getMedicalTestByAppointmentId(pendingData.appointmentId);
          pendingData.testIds = medicalTests.map(test => test.id);
          pendingData.testCount = medicalTests.length;
          pendingData.medicalTests = medicalTests; // Lưu toàn bộ danh sách để hiển thị bảng
        } catch (error) {
          console.warn('Không thể lấy danh sách medical tests:', error);
          pendingData.testCount = pendingData.testIds.length || 0;
          pendingData.medicalTests = []; // Mảng rỗng nếu không lấy được
        }
        
        setMedicalTestDetails(pendingData);

        // Xóa dữ liệu pending
        localStorage.removeItem('pendingMedicalTests');
        
        setStatus('success');
        setMessage('Thanh toán xét nghiệm thành công!');
        
      } catch (error) {
        console.error('Error updating medical test payment status:', error);
        setStatus('error');
        setMessage('Thanh toán thành công nhưng có lỗi khi cập nhật trạng thái. Vui lòng liên hệ hỗ trợ.');
      }
    };

    const handleAppointmentPayment = async (paymentResult) => {
      try {
        // Get stored appointment data
        const appointmentData = getAppointmentData(paymentResult.transactionId);
        console.log("appointmentData", appointmentData)
        setAppointmentDetails(appointmentData);

        if (!appointmentData) {
          setStatus('error');
          setMessage('Không tìm thấy dữ liệu đăng ký. Vui lòng thử lại.');
          return;
        }

        // Call API to create appointment
        await appointmentApi.scheduleAppointment(appointmentData);
        
        // Clear stored data
        clearAppointmentData();
        
        setStatus('success');
        setMessage('Thanh toán thành công! Lịch hẹn đã được tạo.');
        
      } catch (error) {
        console.error('Error creating appointment:', error);
        setStatus('error');
        setMessage('Thanh toán thành công nhưng có lỗi khi tạo lịch hẹn. Vui lòng liên hệ hỗ trợ.');
      }
    };

    handlePaymentCallback();
  }, [searchParams, navigate]);

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <ClockCircleOutlined className="text-blue-600 text-6xl mb-4" />;
      case 'success':
        return <CheckCircleOutlined className="text-green-600 text-6xl mb-4" />;
      case 'error':
        return <CloseCircleOutlined className="text-red-600 text-6xl mb-4" />;
      default:
        return null;
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  const formatAmount = (amount) => {
    if (!amount) return 'N/A';
    // VNPay trả về số tiền nhân 100, cần chia lại
    const actualAmount = parseInt(amount) / 100;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(actualAmount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return dayjs(dateString).format('DD/MM/YYYY HH:mm');
  };

  const getResponseCodeText = (code) => {
    const responseCodes = {
      '00': 'Giao dịch thành công',
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)',
      '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking',
      '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch',
      '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa',
      '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch',
      '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
      '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch',
      '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức cho phép',
      '75': 'Ngân hàng thanh toán đang bảo trì',
      '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
      '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)'
    };
    return responseCodes[code] || `Mã lỗi: ${code}`;
  };

  const getServiceName = (serviceId) => {
    const serviceNames = {
      1: "Khám tổng quát",
      2: "Xét nghiệm máu", 
      3: "Tư vấn sức khỏe",
      4: "Xét nghiệm Testosterone",
      5: "Kiểm tra tinh dịch đồ",
      6: "Siêu âm tuyến tiền liệt",
      7: "Tầm soát ung thư tuyến tiền liệt",
      8: "Xét nghiệm nội tiết tố nam",
      9: "Kiểm tra rối loạn cương dương",
      10: "Do loãng xương nam giới",
      11: "Khám nam khoa tổng quát",
      12: "Xét nghiệm HIV cho nam",
      13: "Tầm soát bệnh lây qua đường tình dục nam giới",
      14: "Xét nghiệm estrogen",
      15: "Siêu âm tử cung buồng trứng",
      16: "Tầm soát ung thư cổ tử cung",
      17: "Siêu âm tuyến vú",
      18: "Xét nghiệm HPV",
      19: "Do loãng xương nữ giới",
      20: "Xét nghiệm HIV cho nữ",
      21: "Tầm soát bệnh lây qua đường tình dục nữ",
      22: "Combo chăm sóc sức khỏe nữ nhân nhân",
      23: "Combo chăm sóc tình dục",
      24: "Combo chăm sóc toàn diện"
    };
    return serviceNames[serviceId] || `Dịch vụ #${serviceId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          {getStatusIcon()}
          <Title level={2} className={getStatusClass()}>
            {status === 'processing' && 'Đang xử lý thanh toán...'}
            {status === 'success' && 'Thanh toán thành công!'}
            {status === 'error' && 'Thanh toán thất bại'}
          </Title>
          <Text className="text-gray-600 text-lg">{message}</Text>
        </div>

        {/* Payment Details */}
        {paymentDetails && (
          <Card title="Chi tiết giao dịch VNPay" className="mb-6">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Mã giao dịch" span={2}>
                <Tag color="blue">{paymentDetails.transactionId}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Mã phản hồi">
                <Tag color={paymentDetails.responseCode === '00' ? 'green' : 'red'}>
                  {paymentDetails.responseCode}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={paymentDetails.responseCode === '00' ? 'green' : 'red'}>
                  {getResponseCodeText(paymentDetails.responseCode)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Số tiền">
                <Text strong className="text-lg">
                  {formatAmount(paymentDetails.amount)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Ngân hàng">
                {paymentDetails.bankCode || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Mã giao dịch ngân hàng">
                {paymentDetails.transactionNo || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian thanh toán">
                {paymentDetails.payDate ? formatDate(paymentDetails.payDate) : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Nội dung">
                {paymentDetails.orderInfo || 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}

        {/* Medical Test Details */}
        {medicalTestDetails && (
          <Card title="Chi tiết thanh toán xét nghiệm" className="mb-6">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Mã đơn hàng" span={2}>
                <Tag color="orange">{medicalTestDetails.orderId}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng xét nghiệm">
                <Text strong>{medicalTestDetails.testCount} xét nghiệm</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                <Text strong className="text-lg text-green-600">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(medicalTestDetails.totalAmount)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Mã cuộc hẹn" span={2}>
                <Tag color="purple">{medicalTestDetails.appointmentId}</Tag>
              </Descriptions.Item>
            </Descriptions>
            
            {/* Bảng chi tiết các xét nghiệm */}
            {medicalTestDetails.medicalTests && medicalTestDetails.medicalTests.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-3">Danh sách xét nghiệm đã thanh toán:</h3>
                <Table
                  dataSource={medicalTestDetails.medicalTests.filter(test => test.status === 'paid')}
                  columns={[
                    {
                      title: 'Tên xét nghiệm',
                      dataIndex: 'testName',
                      key: 'testName',
                      render: (text) => <span className="font-medium">{text}</span>
                    },
                    {
                      title: 'Mã đơn hàng',
                      dataIndex: 'paymentId',
                      key: 'paymentId',
                      render: (paymentId) => (
                        <Tag color="blue" className="font-mono text-xs">
                          {paymentId || medicalTestDetails.orderId}
                        </Tag>
                      )
                    },
                    {
                      title: 'Ngày xét nghiệm',
                      dataIndex: 'testDate',
                      key: 'testDate',
                      render: (date) => new Date(date).toLocaleDateString('vi-VN')
                    },
                    {
                      title: 'Giá',
                      dataIndex: 'price',
                      key: 'price',
                      render: (price) => (
                        <span className="font-semibold text-green-600">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(price)}
                        </span>
                      )
                    },
                    {
                      title: 'Trạng thái',
                      dataIndex: 'status',
                      key: 'status',
                      render: (status) => {
                        const statusConfig = {
                          'pending': { color: 'orange', text: 'Chờ thanh toán' },
                          'paid': { color: 'green', text: 'Đã thanh toán' },
                          'completed': { color: 'blue', text: 'Hoàn thành' }
                        };
                        const config = statusConfig[status] || { color: 'default', text: status };
                        return <Tag color={config.color}>{config.text}</Tag>;
                      }
                    }
                  ]}
                  pagination={false}
                  size="small"
                  className="mt-2"
                />
              </div>
            )}
          </Card>
        )}

        {/* Appointment Details */}
        {appointmentDetails && (
          <Card title="Chi tiết dịch vụ đã đặt" className="mb-6">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Dịch vụ" span={2}>
                <Text strong className="text-lg">
                  {getServiceName(appointmentDetails.service_id)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian hẹn">
                <Space>
                  <CalendarOutlined />
                  {formatDate(appointmentDetails.appointmentTime)}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Chuyên khoa">
                <Tag color="purple">
                  {appointmentDetails.specialization === 'ANDROLOGY' ? 'Nam khoa' : 'Nữ khoa'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú" span={2}>
                {appointmentDetails.patientNotes || 'Không có ghi chú'}
              </Descriptions.Item>
              <Descriptions.Item label="Mã giao dịch" span={2}>
                <Tag color="orange">{appointmentDetails.transactionId}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="text-center">
          {status === 'processing' && (
            <div className="text-sm text-gray-500 mb-4">
              Vui lòng không đóng trang này...
            </div>
          )}
          
          {status !== 'processing' && (
            <Space size="large">
              {medicalTestDetails ? (
                <button
                  onClick={() => {
                    // Điều hướng theo role của user
                    if (userData?.role === 'doctor') {
                      navigate(`/doctor/appointment/${medicalTestDetails.appointmentId}`);
                    } else {
                      navigate(`/patient/appointment/${medicalTestDetails.appointmentId}`);
                    }
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Xem chi tiết cuộc hẹn
                </button>
              ) : (
                <button
                  onClick={() => {
                    // Điều hướng theo role của user
                    if (userData?.role === 'DOCTOR') {
                      navigate('/doctor/appointments');
                    } else {
                      navigate('/patient/appointments');
                    }
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Xem lịch hẹn
                </button>
              )}
              <button
                onClick={() => navigate('/service')}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Đặt dịch vụ khác
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Về trang chủ
              </button>
            </Space>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback; 